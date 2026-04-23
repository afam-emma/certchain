import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      select: {
        id: true,
        recipient: true,
        course: true,
        issuedAt: true,
        certHash: true,
        blockchainStatus: true,
        blockchainTxHash: true,
      },
      orderBy: {
        issuedAt: "desc",
      },
    });

    // Transform for frontend
    const data = certificates.map((cert) => ({
      id: cert.id,
      recipient: cert.recipient,
      course: cert.course,
      issuedAt: cert.issuedAt.toISOString(),
      certHash: cert.certHash,
      blockchainStatus: cert.blockchainStatus,
      blockchainTxHash: cert.blockchainTxHash,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

