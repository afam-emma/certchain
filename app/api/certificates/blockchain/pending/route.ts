import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "PENDING";

        const certificates = await prisma.certificate.findMany({
            where: {
                blockchainStatus: status as "PENDING" | "FAILED",
            },
            include: {
                template: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return Response.json({
            success: true,
            certificates: certificates.map(cert => ({
                id: cert.id,
                recipient: cert.recipient,
                course: cert.course,
                certHash: cert.certHash,
                blockchainStatus: cert.blockchainStatus,
                createdAt: cert.createdAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching pending certificates:", error);
        return Response.json({ error: "Failed to fetch pending certificates" }, { status: 500 });
    }
}