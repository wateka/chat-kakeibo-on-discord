import type { PrismaClient } from "@prisma/client";
import {
  createMessageResponse,
  type InteractionData,
} from "./utils/interaction";
import categories from "./config/categories";
import {
  getParentCategoryBySubcategoryId,
  getSubcategoryById,
} from "./utils/category";
import { truncate, formatDate } from "./utils/formatter";

export async function handleApplicationCommand(
  data: InteractionData,
  prisma: PrismaClient,
) {
  switch (data.name()) {
    case "expense-add":
      return await handleExpenseAdd(data, prisma);
    case "expense-delete":
      return await handleExpenseDelete(data, prisma);
    case "expense-list":
      return await handleExpenseList(data, prisma);
    case "expense-stat":
      return await handleExpenseStat(data, prisma);
  }
}

async function handleExpenseAdd(data: InteractionData, prisma: PrismaClient) {
  const item_name = data.option("item");
  const price = data.option("price");
  const subcategory_id = data.option("category");

  const date_str = data.option("date");
  const date = date_str ? new Date(date_str) : new Date();
  date.setHours(9, 0, 0, 0);

  const category = getParentCategoryBySubcategoryId(
    categories,
    subcategory_id,
  )!;
  const subcategory = getSubcategoryById(categories, subcategory_id)!;

  const _result = await prisma.expense.create({
    data: {
      item_name: item_name,
      price: price,
      category_id: category.id,
      subcategory_id: subcategory.id,
      payment_date: date,
    },
  });

  const message = `記録しました！ ${item_name} ${price}円 [${subcategory.id}]`;

  const res = createMessageResponse(message);
  return res;
}

async function handleExpenseDelete(
  data: InteractionData,
  prisma: PrismaClient,
) {
  const id = data.option("id");

  const deleted = await prisma.expense.delete({
    where: { id: id },
  });

  const { item_name, price } = deleted;
  const message = `削除しました：[${id}] ${item_name} ${price}円`;

  const res = createMessageResponse(message);
  return res;
}

async function handleExpenseList(data: InteractionData, prisma: PrismaClient) {
  const expenses = await prisma.expense.findMany({
    orderBy: {
      payment_date: "asc",
    },
  });

  let message = "";

  message += "出費記録です！\n";
  message += "```";

  for (const expense of expenses) {
    const subcategory = getSubcategoryById(categories, expense.subcategory_id);

    const id = truncate(expense.id, 4, "half", "right");
    const date = formatDate(expense.payment_date);
    const emoji = subcategory?.emoji;
    const name = truncate(expense.item_name, 12, "full", "left");
    const price = truncate(expense.price, 5, "half", "right");

    const line = `[${id}] ${date} ${emoji}${name} ¥${price}\n`;
    message += line;
  }

  message += "```";

  const res = createMessageResponse(message);
  return res;
}

async function handleExpenseStat(data: InteractionData, prisma: PrismaClient) {
  const expensesBySubcategory = await prisma.expense.groupBy({
    by: ["subcategory_id"],
    _sum: { price: true },
  });

  let total_price = 0;
  const category_price_map = new Map<string, number>();
  const subcategory_price_map = new Map<string, number>();

  for (const category of categories) {
    let category_price = 0;

    for (const subcategory of category.subcategories) {
      const expenses = expensesBySubcategory.find(
        (expense) => expense.subcategory_id === subcategory.id,
      );
      const price = expenses?._sum.price || 0;
      category_price += price;
      subcategory_price_map.set(subcategory.id, price);
    }

    total_price += category_price;
    category_price_map.set(category.id, category_price);
  }

  let message = "出費の統計情報です！\n";

  message += "```";

  for (const category of categories) {
    const category_price = category_price_map.get(category.id)!;

    if (category_price === 0) {
      continue;
    }

    const f_name = truncate(category.name, 12, "full", "left");
    const f_price = truncate(category_price, 6, "half", "right");
    const line = `${f_name}  ¥${f_price}\n`;
    message += line;

    for (const subcategory of category.subcategories) {
      const subcategory_price = subcategory_price_map.get(subcategory.id);

      if (subcategory_price === 0 || category.name === subcategory.name) {
        continue;
      }

      const f_emoji = subcategory.emoji;
      const f_name = truncate(subcategory.name, 8, "full", "left");
      const f_price = truncate(subcategory_price!, 6, "half", "right");
      const f_tab = "　".repeat(3);

      const line = `${f_tab}${f_emoji}${f_name} (¥${f_price})\n`;
      message += line;
    }
  }

  const f_name = truncate("合計", 12, "full", "left");
  const f_price = truncate(total_price, 6, "half", "right");

  const line = `${f_name}  ¥${f_price}\n`;
  message += line;

  message += "```";

  const res = createMessageResponse(message);
  return res;
}
