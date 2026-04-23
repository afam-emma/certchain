import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedCategory {
  name: string;
  description?: string;
}

interface SeedTemplate {
  name: string;
  bgImage: string | null;
  bgColor: string | null;
  fontFamily: string;
  fontSize: number;
  categoryName: string;
}

const seedCategories: SeedCategory[] = [
  { name: "Academic", description: "Academic degree and course certificates" },
  { name: "Professional", description: "Professional certification and training" },
  { name: "Technical", description: "Technical skills and software certifications" },
  { name: "Corporate", description: "Corporate training and compliance" },
];

const seedTemplates: SeedTemplate[] = [
  {
    name: "Bachelor Degree Certificate",
    bgImage: null,
    bgColor: "#f8f9fa",
    fontFamily: "Georgia",
    fontSize: 28,
    categoryName: "Academic",
  },
  {
    name: "PhD / Doctorate Certificate",
    bgImage: null,
    bgColor: "#e9ecef",
    fontFamily: "Times New Roman",
    fontSize: 30,
    categoryName: "Academic",
  },
  {
    name: "MBA Certificate",
    bgImage: null,
    bgColor: "#fff3cd",
    fontFamily: "Arial",
    fontSize: 26,
    categoryName: "Professional",
  },
  {
    name: "AWS Certification",
    bgImage: null,
    bgColor: "#d1ecf1",
    fontFamily: "Helvetica",
    fontSize: 24,
    categoryName: "Technical",
  },
  {
    name: "Safety Training Certificate",
    bgImage: null,
    bgColor: "#d4edda",
    fontFamily: "Arial",
    fontSize: 22,
    categoryName: "Corporate",
  },
];

async function main() {
  try {
    console.log("🌱 Starting database seed...");

    // Seed categories first
    console.log("📂 Seeding categories...");
    for (const category of seedCategories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }
    console.log(`✅ Created/verified ${seedCategories.length} categories`);

    // Get categories for template seeding
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.name, c.id]));

    // Seed templates
    console.log("🎨 Seeding templates...");
    for (const template of seedTemplates) {
      const categoryId = categoryMap.get(template.categoryName);
      if (!categoryId) {
        console.warn(`⚠️ Category "${template.categoryName}" not found, skipping template "${template.name}"`);
        continue;
      }

      await prisma.template.upsert({
        where: { name: template.name },
        update: {},
        create: {
          name: template.name,
          bgImage: template.bgImage,
          bgColor: template.bgColor,
          fontFamily: template.fontFamily,
          fontSize: template.fontSize,
          categoryId,
        },
      });
    }
    console.log(`✅ Created/verified ${seedTemplates.length} templates`);

    // Verify seed was successful
    const templateCount = await prisma.template.count();
    const categoryCount = await prisma.category.count();
console.log(`📊 Total categories: ${categoryCount}, Total templates: ${templateCount}`); 

    // Seed users
    console.log("👤 Seeding users...");
    const hashedAdminPass = await import('@/lib/auth').then(m => m.hashPassword('admin123'));
    const hashedUserPass = await import('@/lib/auth').then(m => m.hashPassword('password'));

    await prisma.user.upsert({
      where: { email: 'admin@certchain.com' },
      update: {},
      create: {
        email: 'admin@certchain.com',
        password: hashedAdminPass,
        role: 'ADMIN',
        name: 'Admin User'
      }
    });

    await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        password: hashedUserPass,
        role: 'USER',
        name: 'Test User'
      }
    });

    console.log("✅ Created admin@certchain.com/admin123 and user@test.com/password");

console.log("✨ Seed completed successfully!");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
