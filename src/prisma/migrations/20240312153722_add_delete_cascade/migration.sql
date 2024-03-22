/*
  Warnings:

  - You are about to drop the column `lat` on the `HiveData` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `HiveData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HiveData" DROP CONSTRAINT "HiveData_hiveId_fkey";

-- AlterTable
ALTER TABLE "HiveData" DROP COLUMN "lat",
DROP COLUMN "lng";

-- AddForeignKey
ALTER TABLE "HiveData" ADD CONSTRAINT "HiveData_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;
