-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MAINTAINER', 'OWNER', 'USER', 'WORKER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "name" TEXT,
    "gender" "Gender",
    "age" INTEGER,
    "dob" TIMESTAMP(3),
    "bloodGroup" "BloodGroup",
    "photo" TEXT,
    "nid" TEXT,
    "nidPhoto" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "nidVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "division" TEXT,
    "district" TEXT,
    "upazila" TEXT,
    "address" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkInfo" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experience" TEXT,
    "workType" TEXT,
    "availableTime" TEXT,
    "bio" TEXT,
    "dailySalary" INTEGER,
    "monthlySalary" INTEGER,

    CONSTRAINT "WorkInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_mobile_key" ON "Profile"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Address_mobile_key" ON "Address"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "WorkInfo_mobile_key" ON "WorkInfo"("mobile");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_mobile_fkey" FOREIGN KEY ("mobile") REFERENCES "User"("mobile") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_mobile_fkey" FOREIGN KEY ("mobile") REFERENCES "User"("mobile") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkInfo" ADD CONSTRAINT "WorkInfo_mobile_fkey" FOREIGN KEY ("mobile") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
