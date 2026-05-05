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

const autoCreateWorkTypes = async () => {
  const workTypes = [
    { name: "Full-time", description: "Standard full-time employment" },
    { name: "Part-time", description: "Part-time employment with flexible hours" },
    { name: "Contractual", description: "Fixed-term or project-based contract work" },
    { name: "Remote", description: "Work from anywhere (Work from Home)" },
    { name: "Internship", description: "Training or internship for beginners" },
    { name: "Freelance", description: "Independent contractor work" },
    { name: "Project Based", description: "Hired specifically for a single project" },
    { name: "Temporary", description: "Short-term or seasonal work" },
    { name: "Volunteer", description: "Unpaid work for social or organizational causes" },
    { name: "Shift Based", description: "Work divided into specific time shifts" },
  ];

  console.log("🚀 [AutoCreate] Checking and ensuring work types...");

  for (const type of workTypes) {
    const existingType = await prisma.workType.findUnique({
      where: { name: type.name },
    });

    if (!existingType) {
      await prisma.workType.create({
        data: {
          name: type.name,
          description: type.description,
          isActive: true,
        },
      });
      console.log(`✅ [AutoCreate] Work Type created: ${type.name}`);
    }
  }
};

const autoCreateMedia = async () => {
  const folders = [
    { name: "General Banner", slug: "general-banner" },
    { name: "Service Icons", slug: "service-icons" },
    { name: "User Profiles", slug: "user-profiles" },
    { name: "Project Gallery", slug: "project-gallery" },
    { name: "Marketing Assets", slug: "marketing-assets" },
    { name: "App Screenshots", slug: "app-screenshots" },
    { name: "Blog Covers", slug: "blog-covers" },
    { name: "Worker Portfolio", slug: "worker-portfolio" },
    { name: "Client Testimonials", slug: "client-testimonials" },
    { name: "Team Photos", slug: "team-photos" },
  ];

  console.log("🚀 [AutoCreate] Checking and ensuring initial media folders...");

  for (const folderData of folders) {
    let folder = await prisma.folder.findUnique({
      where: { slug: folderData.slug },
    });

    if (!folder) {
      folder = await prisma.folder.create({
        data: {
          name: folderData.name,
          slug: folderData.slug,
          status: true,
        },
      });
      console.log(`✅ [AutoCreate] Folder created: ${folderData.name}`);

      // Seed 100 images for each NEW folder
      console.log(`📸 [AutoCreate] Seeding 100 images for folder: ${folderData.name}...`);
      const imageCount = 100;
      const imagesToCreate = [];

      for (let i = 1; i <= imageCount; i++) {
        const keyword = folderData.slug.split("-")[0] || "business";
        const imageUrl = `https://picsum.photos/seed/${folderData.slug}-${i}/1200/800`;
        const imageName = `${folderData.name} Image ${i}`;
        const imageSlug = `${folderData.slug}-img-${i}-${Math.floor(Math.random() * 1000)}`;

        imagesToCreate.push({
          name: imageName,
          url: imageUrl,
          slug: imageSlug,
          folderId: folder.id,
          status: true,
        });
      }

      // Bulk create images for performance
      await prisma.image.createMany({
        data: imagesToCreate,
        skipDuplicates: true,
      });
      console.log(`✨ [AutoCreate] 100 images seeded in ${folderData.name}`);
    }
  }
};

const autoCreateCategories = async () => {
  const categories = [
    { name: "IT & Software", slug: "it-software", icon: "fa-solid fa-laptop-code" },
    { name: "Home Maintenance", slug: "home-maintenance", icon: "fa-solid fa-screwdriver-wrench" },
    { name: "Health & Wellness", slug: "health-wellness", icon: "fa-solid fa-heart-pulse" },
    { name: "Education & Tutoring", slug: "education-tutoring", icon: "fa-solid fa-graduation-cap" },
    { name: "Events & Photography", slug: "events-photography", icon: "fa-solid fa-camera-retro" },
    { name: "Beauty & Salon", slug: "beauty-salon", icon: "fa-solid fa-scissors" },
    { name: "Logistics & Delivery", slug: "logistics-delivery", icon: "fa-solid fa-truck-fast" },
    { name: "Business & Finance", slug: "business-finance", icon: "fa-solid fa-chart-line" },
    { name: "Automotive Services", slug: "automotive-services", icon: "fa-solid fa-car-wrench" },
    { name: "Construction & Renovation", slug: "construction-renovation", icon: "fa-solid fa-helmet-safety" },
  ];

  console.log("🚀 [AutoCreate] Checking and ensuring categories and subcategories with icons...");

  // Remove existing sub-categories if they exceed the desired count to reset
  const currentSubCount = await prisma.subCategory.count();
  if (currentSubCount > 50) {
    console.log("🧹 [AutoCreate] Too many subcategories found. Removing existing ones to reset to 50...");
    await prisma.subCategory.deleteMany({});
  }

  // Fetch some images to use as icons/thumbnails
  const availableImages = await prisma.image.findMany({
    take: 300,
    select: { id: true }
  });

  for (const catData of categories) {
    let category = await prisma.category.findUnique({
      where: { slug: catData.slug },
    });

    if (!category) {
      // Pick a random image for category
      const randomImgObj = availableImages.length > 0 
        ? availableImages[Math.floor(Math.random() * availableImages.length)]
        : null;
      const randomImage = randomImgObj ? randomImgObj.id : null;

      category = await prisma.category.create({
        data: {
          name: catData.name,
          slug: catData.slug,
          icon: catData.icon,
          description: `Premium ${catData.name} services`,
          status: true,
          imageId: randomImage,
        },
      });
      console.log(`✅ [AutoCreate] Category created with icon: ${catData.name}`);
    } else {
      // Update icon to ensure it's Font Awesome as requested
      await prisma.category.update({
        where: { id: category.id },
        data: { icon: catData.icon }
      });
    }

    // Ensure each category has 5 subcategories
    const subCountForCat = await prisma.subCategory.count({ where: { categoryId: category.id } });
    
    // Always update icons for existing subcategories to ensure they match Font Awesome
    await prisma.subCategory.updateMany({
      where: { categoryId: category.id },
      data: { icon: "fa-solid fa-circle-check" }
    });

    if (subCountForCat < 5) {
      console.log(`📂 [AutoCreate] Seeding subcategories for ${catData.name}...`);
      const subCountToCreate = 5 - subCountForCat;
      const subCategoriesToCreate = [];

      for (let i = 1; i <= subCountToCreate; i++) {
        const subName = `${catData.name} Sub ${subCountForCat + i}`;
        const subSlug = `${catData.slug}-sub-${subCountForCat + i}-${Math.floor(Math.random() * 1000)}`;
        const subImgObj = availableImages.length > 0 
          ? availableImages[Math.floor(Math.random() * availableImages.length)]
          : null;
        const subRandomImage = subImgObj ? subImgObj.id : null;

        subCategoriesToCreate.push({
          name: subName,
          slug: subSlug,
          categoryId: category.id,
          icon: "fa-solid fa-circle-check",
          description: `Professional services for ${subName}`,
          status: true,
          imageId: subRandomImage,
        });
      }

      await prisma.subCategory.createMany({
        data: subCategoriesToCreate,
        skipDuplicates: true,
      });
      console.log(`✨ [AutoCreate] ${subCountToCreate} subcategories seeded in ${catData.name}`);
    }
  }
};

const autoCreateDepartments = async () => {
  const departments = [
    { name: "Administration", description: "Core administrative operations" },
    { name: "Customer Support", description: "Helping users and resolving issues" },
    { name: "Sales & Marketing", description: "Business growth and brand awareness" },
    { name: "Human Resources", description: "Managing people and talent" },
    { name: "Operations", description: "Managing daily business processes" },
    { name: "IT & Technical", description: "Managing technology and infrastructure" },
    { name: "Finance", description: "Budgeting, accounting, and payroll" },
    { name: "Quality Assurance", description: "Ensuring service excellence" },
    { name: "Logistics", description: "Managing service delivery and transport" },
    { name: "Legal & Compliance", description: "Ensuring regulatory adherence" },
  ];

  console.log("🚀 [AutoCreate] Checking and ensuring departments...");

  for (const dept of departments) {
    const existingDept = await prisma.department.findFirst({
      where: { name: dept.name },
    });

    if (!existingDept) {
      await prisma.department.create({
        data: {
          name: dept.name,
          description: dept.description,
          isActive: true,
        },
      });
      console.log(`✅ [AutoCreate] Department created: ${dept.name}`);
    }
  }
};

const autoCreateBlogs = async () => {
  console.log("🚀 [AutoCreate] Checking and ensuring blogs...");

  // 1. Find an author (Super Admin)
  const adminUser = await prisma.user.findFirst({
    where: { role: { role: "SUPER_ADMIN" } },
  });

  if (!adminUser) {
    console.log("⚠️ [AutoCreate] Skipping blog seeding: No SUPER_ADMIN user found.");
    return;
  }

  // 2. Seed 20 Blogs if none exist
  const existingBlogsCount = await prisma.blog.count();
  if (existingBlogsCount < 20) {
    console.log("📝 [AutoCreate] Seeding 20 sample blogs matching schema...");
    const blogsToCreate = [];
    
    const categories = ["Marketplace", "Worker Tips", "Safety", "Company News"];

    for (let i = 1; i <= 20; i++) {
      const title = `Professional Guide #${i}: Success in the Gig Economy`;
      const slug = `blog-post-${i}-${Math.floor(Math.random() * 10000)}`;
      
      blogsToCreate.push({
        title,
        slug,
        content: `<h3>Modern Working Strategies</h3><p>This is the detailed content for blog post #${i}. We discuss how to improve efficiency and maintain quality standards.</p>`,
        description: `Short summary of blog post #${i} for SEO purposes.`,
        excerpt: `Discover the secrets of success in this featured post #${i}...`,
        category: categories[i % categories.length] || null,
        authorId: adminUser.id,
        authorName: "System Administrator",
        isPublished: true,
        publishedAt: new Date(),
        tags: ["Professional", "GigEconomy", "Tips"],
      });
    }

    await prisma.blog.createMany({
      data: blogsToCreate,
      skipDuplicates: true,
    });
    console.log("✨ [AutoCreate] 20 sample blogs seeded successfully (Schema Validated)!");
  }
};

const autoCreateSubscriptions = async () => {
  const subscriptions = [
    {
      name: "Starter",
      slug: "starter-plan",
      price: "0",
      discount: "0",
      duration: "Monthly",
      activeDays: 30,
      maxJobs: 5,
      maxEmployees: 2,
      description: "Ideal for individuals starting out.",
      featured: ["5 Job Posts", "Basic Support"],
    },
    {
      name: "Professional",
      slug: "pro-plan",
      price: "2500",
      discount: "200",
      duration: "Monthly",
      activeDays: 30,
      maxJobs: 50,
      maxEmployees: 20,
      hasAnalytics: true,
      supportLevel: "Premium",
      isRecomended: true,
      description: "Best for growing agencies and companies.",
      featured: ["50 Job Posts", "Premium Support", "Analytics Dashboard"],
    },
    {
      name: "Enterprise",
      slug: "enterprise-plan",
      price: "10000",
      discount: "1000",
      duration: "Yearly",
      activeDays: 365,
      maxJobs: 9999,
      maxEmployees: 9999,
      hasAnalytics: true,
      supportLevel: "24/7",
      description: "Full power for large organizations.",
      featured: ["Unlimited Jobs", "24/7 Priority Support", "Custom Integration"],
    }
  ];

  console.log("🚀 [AutoCreate] Ensuring SaaS Subscription Plans...");

  for (const plan of subscriptions) {
    const existing = await prisma.subscription.findUnique({ where: { slug: plan.slug } });
    if (!existing) {
      await prisma.subscription.create({ data: plan });
      console.log(`✅ [AutoCreate] Subscription created: ${plan.name}`);
    }
  }
};

const autoCreateTenants = async () => {
  console.log("🚀 [AutoCreate] Ensuring Default Tenant and Data Migration...");

  // 1. Create a Default Tenant if none exists
  let defaultTenant = await prisma.tenant.findUnique({ where: { slug: "default-tenant" } });
  if (!defaultTenant) {
    defaultTenant = await prisma.tenant.create({
      data: {
        name: "KajLagbe Default Workspace",
        slug: "default-tenant",
        email: "support@kajlagbe.com",
      }
    });
    console.log("✅ [AutoCreate] Default Tenant created.");
  }

  // 2. Link existing users and jobs to the default tenant if they don't have one
  await prisma.user.updateMany({
    where: { tenantId: null },
    data: { tenantId: defaultTenant.id }
  });

  await prisma.job.updateMany({
    where: { tenantId: null },
    data: { tenantId: defaultTenant.id }
  });
  
  console.log("✨ [AutoCreate] All orphaned records linked to Default Tenant.");
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

    // Create Work Types
    await autoCreateWorkTypes();

    // Create Initial Media (Folders and Images)
    await autoCreateMedia();

    // Create Categories and SubCategories
    await autoCreateCategories();

    // Create Departments
    await autoCreateDepartments();

    // Create Blogs
    await autoCreateBlogs();

    // SaaS Specific Initializations
    await autoCreateSubscriptions();
    await autoCreateTenants();
    
    console.log("✨ [AutoCreate] All automated tasks completed successfully!");
  } catch (error) {
    console.error("❌ [AutoCreate] Critical error during initialization:", error);
  }
};

export const AutoCreateService = {
  init,
};
