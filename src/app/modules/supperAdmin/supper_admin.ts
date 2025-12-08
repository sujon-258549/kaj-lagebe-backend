import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";
import prisma from "../../utils/prismaClient.js";
import { Role } from "@prisma/client";

async function main() {
  const superAdminEmail = "superadmin@hospital.com";
  const superAdminPassword = "superadmin";

  // Check if Super Admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (existing) {
    console.log("Super Admin already exists");
    return;
  }

  // Hash password
  const hashedPassword = await argon2.hash(superAdminPassword as string);
  const superAdminMobile = "01717171717" as string;
  // Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      id: superAdminMobile,
      email: superAdminEmail,
      password: hashedPassword,
      role: Role.SUPER_ADMIN as Role,
      mobile: superAdminMobile,
    },
  });

  console.log("✅ Super Admin created:", superAdmin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
