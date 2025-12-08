-- DropForeignKey
ALTER TABLE "WorkInfo" DROP CONSTRAINT "WorkInfo_mobile_fkey";

-- AddForeignKey
ALTER TABLE "WorkInfo" ADD CONSTRAINT "WorkInfo_mobile_fkey" FOREIGN KEY ("mobile") REFERENCES "User"("mobile") ON DELETE RESTRICT ON UPDATE CASCADE;
