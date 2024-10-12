const categories = [
	{
		id: "food",
		name: "食費",
		subcategories: [
			{ id: "food-lunch", name: "昼ご飯", emoji: "🍱" },
			{ id: "food-dinner", name: "夜ご飯", emoji: "🍽️" },
			{ id: "food-snack", name: "軽食", emoji: "🍿" },
		],
	},
	{
		id: "hobby",
		name: "趣味費",
		subcategories: [
			{ id: "hobby-books", name: "書籍", emoji: "📚" },
			{ id: "hobby-fangoods", name: "ファン活動", emoji: "💖" },
			{ id: "hobby-equipments", name: "機材系", emoji: "🎸" },
			{ id: "hobby-others", name: "趣味その他", emoji: "😃" },
		],
	},
	{
		id: "beauty",
		name: "被服・美容費",
		subcategories: [{ id: "beauty-others", name: "被服・美容費", emoji: "👕" }],
	},
	{
		id: "entertainment",
		name: "交際費",
		subcategories: [
			{ id: "entertainment-others", name: "交際費", emoji: "🎉" },
		],
	},
	{
		id: "traffic",
		name: "移動費",
		subcategories: [{ id: "traffic-others", name: "移動費", emoji: "🚃" }],
	},
	{
		id: "others",
		name: "その他",
		subcategories: [{ id: "others-others", name: "その他", emoji: "💲" }],
	},
];

export default categories;

export const categoryChoices = categories.flatMap((category) =>
	category.subcategories.map((subcategory) => ({
		name:
			category.name === subcategory.name
				? category.name
				: `${category.name} > ${subcategory.name}`,
		value: subcategory.id,
	})),
);

export function getCategory(id: string) {
	return categories.find((category) => category.id === id);
}

export function getSubcategory(id: string) {
	return categories
		.flatMap((category) => category.subcategories)
		.find((subcategory) => subcategory.id === id);
}
