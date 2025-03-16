/*
  Warnings:

  - You are about to drop the column `journeyDate` on the `Journey` table. All the data in the column will be lost.
  - You are about to drop the column `reachTime` on the `Journey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Journey" DROP COLUMN "journeyDate",
DROP COLUMN "reachTime";
