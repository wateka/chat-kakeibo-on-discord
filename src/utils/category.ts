type Subcategory = {
    id: string;
    name: string;
    emoji: string;
};

export type Category = {
    id: string;
    name: string;
    subcategories: Subcategory[];
};

export function getCategoryById(categories: Category[], id: string) {
    return categories.find((category) => category.id === id);
}

export function getSubcategoryById(categories: Category[], id: string) {
    return categories
        .flatMap((category) => category.subcategories)
        .find((subcategory) => subcategory.id === id);
}

export function getParentCategoryBySubcategoryId(
    categories: Category[],
    subcategory_id: string,
) {
    return categories.find((category) =>
        category.subcategories.some(
            (subcategory) => subcategory.id === subcategory_id,
        ),
    );
}

export function convertCategoriesToDiscordChoices(categories: Category[]) {
    const choices = categories.flatMap((category) =>
        category.subcategories.map((subcategory) => {
            const name =
                category.name === subcategory.name
                    ? `${category.name}`
                    : `${category.name} > ${subcategory.name}`;
            const value = subcategory.id;

            return { name, value };
        }),
    );

    return choices;
}
