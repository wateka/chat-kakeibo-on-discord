-- RedefineTables
PRAGMA defer_foreign_keys = ON;
PRAGMA foreign_keys = OFF;
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category_id" TEXT NOT NULL,
    "subcategory_id" TEXT NOT NULL,
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Expense" (
        "created_at",
        "id",
        "item_name",
        "payment_date",
        "price",
        "updated_at",
        "category_id",
        "subcategory_id"
    )
SELECT "created_at",
    "id",
    "item_name",
    "payment_date",
    "price",
    "updated_at",
    "category",
    "subcategory"
FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense"
    RENAME TO "Expense";
PRAGMA foreign_keys = ON;
PRAGMA defer_foreign_keys = OFF;