import { prisma } from "@/lib/prisma";
import { Contract, BrowserProvider } from "ethers";

// Contract ABI
const CONTRACT_ABI = [
    "function registerCertificate(bytes32 certHash) external",
    "function verifyCertificate(bytes32 certHash) external view returns (uint256)",
    "event CertificateRegistered(bytes32 indexed certHash, uint256 timestamp, address indexed registrar)"
];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { certHash, walletAddress, txHash } = body;

        if (!certHash) {
            return Response.json({ error: "Certificate hash is required" }, { status: 400 });
        }

        // Find the certificate
        const cert = await prisma.certificate.findFirst({
            where: { certHash },
        });

        if (!cert) {
            return Response.json({ error: "Certificate not found" }, { status: 404 });
        }

        // Check if already confirmed
        if (cert.blockchainStatus === "CONFIRMED") {
            return Response.json({
                success: true,
                message: "Certificate already registered on blockchain",
                txHash: cert.blockchainTxHash,
            });
        }

        // If txHash provided, update status
        if (txHash) {
            const updatedCert = await prisma.certificate.update({
                where: { certHash },
                data: {
                    blockchainStatus: 'CONFIRMED' as const,
                    blockchainTxHash: txHash,
                },
            });
            return Response.json({
                success: true,
                message: "Certificate status updated",
                txHash,
            });
        } else {
            // Optional wallet validation
            if (walletAddress && walletAddress !== cert.walletAddress) {
                return Response.json({ error: "Wallet mismatch" }, { status: 400 });
            }

            return Response.json({
                success: true,
                message: "Ready for blockchain registration. Use frontend wallet connect.",
                hash: certHash
            });
        }


    } catch (error) {
        console.error("Blockchain registration error:", error);
        
        // If transaction failed, mark as failed
        if (error instanceof Error && error.message.includes("user rejected")) {
            return Response.json({ error: "Transaction rejected by user" }, { status: 400 });
        }

        return Response.json({ error: "Failed to register on blockchain" }, { status: 500 });
    }
}