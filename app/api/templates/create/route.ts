import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const fontFamily = formData.get("fontFamily") as string;
        const fontSize = Number(formData.get("fontSize"));
        const categoryId = formData.get("categoryId") as string;
        const bgColor = formData.get("bgColor") as string | null;
        const file = formData.get("bgImage") as File | null;

        // Validate required fields
        if (!name || !fontFamily || !fontSize || !categoryId) {
            return Response.json(
                { error: "Missing required fields: name, fontFamily, fontSize, categoryId" },
                { status: 400 }
            );
        }

        // Validate category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return Response.json(
                { error: "Selected category does not exist" },
                { status: 400 }
            );
        }

        let base64Image = null;
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
        }

        const template = await prisma.template.create({
            data: {
                name,
                bgImage: base64Image,
                bgColor: bgColor || null,
                fontFamily,
                fontSize,
                categoryId,
            },
            include: {
                category: true,
            },
        });

        return Response.json(template);
    } catch (error) {
        console.error("Error creating template:", error);
        return Response.json(
            { error: "Failed to create template" },
            { status: 500 }
        );
    }
}