/*
  Warnings:

  - You are about to drop the column `temperatur` on the `HiveData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HiveData" DROP COLUMN "temperatur",
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0;
