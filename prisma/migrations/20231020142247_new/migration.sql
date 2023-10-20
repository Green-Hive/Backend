/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BeeData" ALTER COLUMN "temperature" SET DEFAULT 0,
ALTER COLUMN "humidity" SET DEFAULT 0,
ALTER COLUMN "weight" SET DEFAULT 0,
ALTER COLUMN "light" SET DEFAULT 0,
ALTER COLUMN "battery" SET DEFAULT 0,
ALTER COLUMN "lat" SET DEFAULT 0,
ALTER COLUMN "lng" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Hive" ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "name" SET NOT NULL;
