/*
  Warnings:

  - You are about to drop the column `region` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_companyId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "region",
ADD COLUMN     "companyName" TEXT NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
