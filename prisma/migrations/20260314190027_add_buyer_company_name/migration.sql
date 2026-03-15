/*
  Warnings:

  - Added the required column `buyerCompanyName` to the `DealRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DealRequest" ADD COLUMN     "buyerCompanyName" TEXT NOT NULL;
