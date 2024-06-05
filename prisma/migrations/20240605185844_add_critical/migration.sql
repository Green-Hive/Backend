/*
  Warnings:

  - The values [DANGER] on the enum `AlertSeverity` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AlertSeverity_new" AS ENUM ('INFO', 'WARNING', 'CRITICAL');
ALTER TABLE "Alert" ALTER COLUMN "severity" TYPE "AlertSeverity_new" USING ("severity"::text::"AlertSeverity_new");
ALTER TYPE "AlertSeverity" RENAME TO "AlertSeverity_old";
ALTER TYPE "AlertSeverity_new" RENAME TO "AlertSeverity";
DROP TYPE "AlertSeverity_old";
COMMIT;
