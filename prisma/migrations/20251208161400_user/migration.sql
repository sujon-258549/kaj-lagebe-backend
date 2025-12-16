/*
  Warnings:

  - You are about to drop the column `bio` on the `WorkInfo` table. All the data in the column will be lost.
  - You are about to drop the column `dailySalary` on the `WorkInfo` table. All the data in the column will be lost.
  - You are about to drop the column `monthlySalary` on the `WorkInfo` table. All the data in the column will be lost.
  - Changed the type of `name` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ELECTRICIAN', 'PLUMBER', 'CARPENTER', 'PAINTER', 'MECHANIC', 'CLEANER', 'OTHER');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "name" "CategoryType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordChangeTime" TIMESTAMP(3),
ADD COLUMN     "passwordChanged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WorkInfo" DROP COLUMN "bio",
DROP COLUMN "dailySalary",
DROP COLUMN "monthlySalary",
ADD COLUMN     "idDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordChangeTime" TIMESTAMP(3),
ADD COLUMN     "passwordChanged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
