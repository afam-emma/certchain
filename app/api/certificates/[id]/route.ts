import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { blockchainStatus, blockchainTxHash, blockchainTimestamp } = body;

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        blockchainStatus,
        blockchainTxHash,
        blockchainTimestamp: blockchainTimestamp ? new Date(blockchainTimestamp * 1000) : null,
      },
    });

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        blockchainStatus: certificate.blockchainStatus,
        blockchainTxHash: certificate.blockchainTxHash,
        blockchainTimestamp: certificate.blockchainTimestamp,
      },
    });
  } catch (error) {
    console.error("Failed to update certificate status:", error);
    return NextResponse.json(
      { error: "Failed to update certificate status" },
      { status: 500 }
    );
  }
}

