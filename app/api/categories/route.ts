import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();

    const categories = await prisma.category.findMany({
      where: search ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      } : undefined,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { templates: true },
        },
      },
    });

    return Response.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      return Response.json(
        { error: "Category already exists", category: existingCategory },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return Response.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
