import { prisma } from "@/lib/prisma";
import { generateCertificate } from "@/lib/pdf";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ hash: string }> }
) {
    try {
        const { hash: rawHash } = await params;
        const hash = rawHash?.trim();

        if (!hash) {
            return Response.json({ error: "Certificate hash required" }, { status: 400 });
        }

        const cert = await prisma.certificate.findFirst({
            where: {
                OR: [
                    { certHash: hash },
                    { id: hash },
                ],
            },
        });

        if (!cert) {
            return Response.json({ error: "Certificate not found" }, { status: 404 });
        }

        // Generate PDF using stored data
        const pdfBytes = await generateCertificate({
            recipient: cert.recipient,
            course: cert.course,
            universityName: cert.universityName,
            department: cert.department,
            grade: cert.grade,
            issuedAt: cert.issuedAt.toISOString(),
            qrCode: cert.qrCode,
            certHash: cert.certHash,
        });

        const pdfArrayBuffer = pdfBytes.buffer.slice(
            pdfBytes.byteOffset,
            pdfBytes.byteOffset + pdfBytes.byteLength
        ) as ArrayBuffer;

        return new Response(pdfArrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${cert.recipient.replace(/\s+/g, "_")}_certificate.pdf"`,
            },
        });

    } catch (error) {
        console.error("Error generating PDF:", error);
        return Response.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}