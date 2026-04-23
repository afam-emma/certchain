import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const templates = await prisma.template.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return Response.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}