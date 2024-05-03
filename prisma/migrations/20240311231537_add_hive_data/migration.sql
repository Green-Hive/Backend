/*
  Warnings:

  - You are about to drop the column `data` on the `Hive` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hive" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "HiveData" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hiveId" TEXT NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hum" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inclination" BOOLEAN NOT NULL DEFAULT false,
    "lat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lng" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "HiveData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HiveData" ADD CONSTRAINT "HiveData_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
