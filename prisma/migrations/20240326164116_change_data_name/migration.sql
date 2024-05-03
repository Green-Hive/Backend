/*
  Warnings:

  - You are about to drop the column `hum` on the `HiveData` table. All the data in the column will be lost.
  - You are about to drop the column `temp` on the `HiveData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HiveData" DROP COLUMN "hum",
DROP COLUMN "temp",
ADD COLUMN     "humidity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "temperatur" DOUBLE PRECISION NOT NULL DEFAULT 0;
