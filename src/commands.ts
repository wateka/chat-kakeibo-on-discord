import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { categoryChoices } from "./categories";

const commands = [
	{
		name: "expense-add",
		description: "出費記録をつける",
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: "item",
				name_localized: "用途",
				description: "買ったもの・買った場所など",
				required: true,
			},
			{
				type: ApplicationCommandOptionType.Integer,
				name: "price",
				name_localized: "分類",
				description: "金額 (円)",
				required: true,
			},
			{
				type: ApplicationCommandOptionType.String,
				name: "category",
				name_localized: "分類",
				description: "分類など",
				required: true,
				choices: categoryChoices,
			},
			{
				type: ApplicationCommandOptionType.String,
				name: "date",
				description: "年/月/日",
				required: false,
			},
		],
	},
	{
		name: "expense-stat",
		description: "出費の統計情報を見る",
	},
	{
		name: "expense-list",
		description: "出費記録を見る",
	},
	{
		name: "expense-delete",
		description: "出費記録を取り消す",
		options: [
			{
				type: ApplicationCommandOptionType.Integer,
				name: "id",
				description: "取り消したい記録のID",
				required: true,
			},
		],
	},
];

export default commands;
