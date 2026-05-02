import prisma from "../../utils/prismaClient.js";

/**
 * AutoCreateService handles the automatic creation of essential data on system startup.
 * This includes roles, departments, or any other initial configuration.
 */

const autoCreateRoles = async () => {
  const roles = [
    {
      role: "SUPER_ADMIN",
      description: "System Overlord with full access and control",
    },
    {
      role: "ADMIN",
      description: "Administrator with high-level access to manage the platform",
    },
    {
      role: "USER",
      description: "General user or client looking for services",
    },
    {
      role: "WORKER",
      description: "Service provider or worker looking for jobs and tasks",
    },
  ];

  console.log("🚀 [AutoCreate] Checking and ensuring essential roles...");

  for (const roleData of roles) {
    const existingRole = await prisma.allRole.findFirst({
      where: { role: roleData.role },
    });

    if (!existingRole) {
      await prisma.allRole.create({
        data: {
          role: roleData.role,
          description: roleData.description,
          isActive: true,
        },
      });
      console.log(`✅ [AutoCreate] Role created: ${roleData.role}`);
    }
  }
};

/**
 * Main initialization function to be called on server startup.
 * Add any new auto-creation logic here.
 */
const init = async () => {
  try {
    console.log("🛠️ [AutoCreate] Starting automated initialization...");
    
    // Create Roles
    await autoCreateRoles();
    
    // Future additions can go here:
    // await autoCreateDepartments();
    // await autoCreateInitialCategories();
    
    console.log("✨ [AutoCreate] All automated tasks completed successfully!");
  } catch (error) {
    console.error("❌ [AutoCreate] Critical error during initialization:", error);
  }
};

export const AutoCreateService = {
  init,
};
