-- DropForeignKey
ALTER TABLE "Hive" DROP CONSTRAINT "Hive_userId_fkey";

-- AddForeignKey
ALTER TABLE "Hive" ADD CONSTRAINT "Hive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
