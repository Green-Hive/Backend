/*
  Warnings:

  - Changed the type of `type` on the `Alert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `severity` on the `Alert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'DANGER');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('TEMP', 'WEIGHT', 'TILT', 'SENSOR');

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "type",
ADD COLUMN     "type" "AlertType" NOT NULL,
DROP COLUMN "severity",
ADD COLUMN     "severity" "AlertSeverity" NOT NULL;
