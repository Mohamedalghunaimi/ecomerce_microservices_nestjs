-- DropIndex
DROP INDEX "Product_categoryId_idx";

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_slug_idx" ON "Product"("categoryId", "slug");
