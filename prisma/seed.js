import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.template.createMany({
        data: [
            {
                name: "Bachelor Degree Certificate",
                bgImage: null,
                fontFamily: "Georgia",
                fontSize: 28,
            },
            {
                name: "PhD / Doctorate Certificate",
                bgImage: null,
                fontFamily: "Times New Roman",
                fontSize: 30,
            },
            {
                name: "MBA Certificate",
                bgImage: null,
                fontFamily: "Arial",
                fontSize: 26,
            },
        ],
        skipDuplicates: true,
    });

    console.log("Seed complete");
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });