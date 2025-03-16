/*
  Warnings:

  - Added the required column `route` to the `Journey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Journey" ADD COLUMN     "route" JSONB NOT NULL;
