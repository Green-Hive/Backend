/*
  Warnings:

  - You are about to drop the column `humidity` on the `HiveData` table. All the data in the column will be lost.
  - You are about to drop the column `inclination` on the `HiveData` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `HiveData` table. All the data in the column will be lost.
  - Added the required column `time` to the `HiveData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HiveData" DROP COLUMN "humidity",
DROP COLUMN "inclination",
DROP COLUMN "temperature",
ADD COLUMN     "humidityBottomLeft" DOUBLE PRECISION,
ADD COLUMN     "humidityOutside" DOUBLE PRECISION,
ADD COLUMN     "humidityTopRight" DOUBLE PRECISION,
ADD COLUMN     "magnetic_x" DOUBLE PRECISION,
ADD COLUMN     "magnetic_y" DOUBLE PRECISION,
ADD COLUMN     "magnetic_z" DOUBLE PRECISION,
ADD COLUMN     "pressure" DOUBLE PRECISION,
ADD COLUMN     "tempBottomLeft" DOUBLE PRECISION,
ADD COLUMN     "tempOutside" DOUBLE PRECISION,
ADD COLUMN     "tempTopRight" DOUBLE PRECISION,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "weight" DROP DEFAULT;
