import { prisma } from "@/lib/prisma";
import { generateCertHash } from "@/lib/hash";
import { generateCertificate } from "@/lib/pdf";
import QRCode from "qrcode";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, course, universityName, department, grade, walletAddress, preview = false } = body;

        const issuedAt = new Date();

        let certHash: string;
        let qrCode: string;

        if (preview) {
          certHash = `preview-${Date.now()}`;
          const dummyVerifyUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3001"}/verify/${certHash}`;
          qrCode = await QRCode.toDataURL(dummyVerifyUrl);
        } else {
          // Generate hash
          certHash = generateCertHash({
            recipient: name,
            course,
            universityName,
            department,
            grade,
            issuedAt: issuedAt.toISOString(),
          });

          // Verification URL
          const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3001";
          const verifyUrl = `${baseUrl}/verify/${certHash}`;

          // QR Code
          qrCode = await QRCode.toDataURL(verifyUrl);

          // Save certificate
          const certificate = await prisma.certificate.create({
            data: {
              recipient: name,
              course,
              universityName: universityName || null,
              department: department || null,
              grade: grade || null,
              issuedAt,
              certHash,
              qrCode,
              walletAddress: walletAddress || null,
            },
          });
        }



        // Generate PDF
        const pdfBytes = await generateCertificate({
            recipient: name,
            course,
            universityName,
            department,
            grade,
            issuedAt: issuedAt.toISOString(),
            qrCode,
            certHash,
        });

        const pdfArrayBuffer = pdfBytes.buffer.slice(
            pdfBytes.byteOffset,
            pdfBytes.byteOffset + pdfBytes.byteLength
        ) as ArrayBuffer;

        const response = new Response(pdfArrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": preview 
                    ? "inline; filename=preview.pdf" 
                    : `attachment; filename="${name.replace(/\s+/g, "_")}_certificate.pdf"`,
                ...( !preview && { "X-Cert-Hash": certHash } ),
            },
        });

        return response;

    } catch (error) {
        console.error('Certificate issuance failed:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message.includes('Puppeteer/PDF error') 
                ? `PDF Generation Failed: ${error.message}` 
                : `Issuance Error: ${error.message}`
            : 'Unknown error during certificate issuance';
            
        return Response.json({ 
            error: errorMessage,
            details: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
