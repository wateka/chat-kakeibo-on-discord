import { type APIInteraction, InteractionType } from "discord-api-types/v10";
import { Hono } from "hono";
import {
	createMessageResponse,
	createPingPongResponse,
	InteractionData,
} from "./interaction";
import type { PrismaClient } from "@prisma/client";
import categories, { getSubcategory } from "./categories";
import { toFullWidth } from "./utils";
import { verifyDiscordRequestMiddleware } from "./middleware/discord";

type Env = {
	Bindings: {
		DB: D1Database;
		DISCORD_TOKEN: string;
		DISCORD_APPLICATION_ID: string;
		DISCORD_PUBLIC_KEY: string;
	};
	Variables: {
		prisma: PrismaClient;
	};
};

const app = new Hono<Env>();

app.use(verifyDiscordRequestMiddleware);

app.post("/", async (c) => {
	const interaction: APIInteraction = await c.req.json();

	if (interaction.type === InteractionType.Ping) {
		const res = createPingPongResponse();
		return c.json(res);
	}

	if (interaction.type === InteractionType.ApplicationCommand) {
		const data = new InteractionData(interaction.data);

		if (data.name() === "expense-add") {
			const item_name = data.option("item");
			const price = data.option("price");
			const subcategory_id = data.option("category");
			const category_id = subcategory_id.split("-")[0];

			const date_str = data.option("date");
			const date = date_str ? new Date(date_str) : new Date();
			date.setHours(9, 0, 0, 0);

			const result = await c.var.prisma.expense.create({
				data: {
					item_name: item_name,
					price: price,
					category_id: category_id,
					subcategory_id: subcategory_id,
					payment_date: date,
				},
			});

			const res = createMessageResponse(
				`記録しました！ ${item_name} ${price}円 [${subcategory_id}]`,
			);

			return c.json(res);
		}

		if (data.name() === "expense-stat") {
			const expensesBySubcategory = await c.var.prisma.expense.groupBy({
				by: ["subcategory_id"],
				_sum: { price: true },
			});

			const converted_categories = categories.map((category) => {
				const subcategories = category.subcategories.map((subcategory) => {
					const price =
						expensesBySubcategory.find(
							(expense) => expense.subcategory_id === subcategory.id,
						)?._sum.price || 0;
					return { ...subcategory, price };
				});
				const price = subcategories.reduce((sum, { price }) => sum + price, 0);
				return { ...category, subcategories, price };
			});

			const price = converted_categories.reduce(
				(sum, { price }) => sum + price,
				0,
			);

			const categories_message = converted_categories
				.map((category) => {
					if (category.price === 0) {
						return "";
					}

					const subcategories_message = category.subcategories
						.map((subcategory) => {
							if (
								subcategory.price === 0 ||
								subcategory.name === category.name
							) {
								return "";
							}

							const f_name = toFullWidth(subcategory.name).padEnd(8, "　");
							const f_emoji = subcategory.emoji;
							const f_price = subcategory.price.toString().padStart(6);
							const message = `　　　${f_emoji}${f_name} (¥${f_price})\n`;
							return message;
						})
						.join("");

					const f_name = toFullWidth(category.name).padEnd(12, "　");
					const f_price = category.price.toString().padStart(6);

					const message = `${f_name}  ¥${f_price}\n${subcategories_message}`;
					return message;
				})
				.join("");

			const f_price = price.toString().padStart(6);

			const message = `出費の統計情報です！\n\`\`\`${categories_message}\n合計${"　".repeat(10)}  ¥${f_price}\`\`\``;

			const res = createMessageResponse(message);
			return c.json(res);
		}

		if (data.name() === "expense-list") {
			const expenses = await c.var.prisma.expense.findMany({
				orderBy: {
					payment_date: "asc",
				},
			});

			const expensesMessage = expenses
				.map(({ id, item_name, subcategory_id, price, payment_date }) => {
					const f_id = id.toString().padStart(4);
					const f_m = (payment_date.getMonth() + 1).toString().padStart(2);
					const f_d = payment_date.getDate().toString().padStart(2);
					const f_ddd = ["日", "月", "火", "水", "木", "金", "土"][
						payment_date.getDay()
					];
					const f_emoji = getSubcategory(subcategory_id)?.emoji;
					const f_name = toFullWidth(item_name).slice(0, 12).padEnd(12, "　");
					const f_price = price.toString().padStart(5);

					return `[${f_id}] ${f_m}/${f_d} ${f_ddd} ${f_emoji}${f_name} ¥${f_price}`;
				})
				.join("\n");

			const res = createMessageResponse(
				`出費記録です！\n\`\`\`${expensesMessage}\`\`\``,
			);
			return c.json(res);
		}

		if (data.name() === "expense-delete") {
			const id = data.option("id");

			const deleted = await c.var.prisma.expense.delete({
				where: { id: id },
			});

			const res = createMessageResponse(
				`削除しました：[${deleted.id}] ${deleted.item_name} ${deleted.price}円`,
			);
			return c.json(res);
		}
	}

	return c.text("Bad request, 400");

	// if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
	// 	const res = {
	// 		type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
	// 		data: {
	// 			choices: categoryChoices,
	// 		},
	// 	};
	// 	return c.json(res);
	// }
});

export default app;
