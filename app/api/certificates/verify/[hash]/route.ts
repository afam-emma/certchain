import { prisma } from "@/lib/prisma";
import { Contract, JsonRpcProvider } from "ethers";

// Contract ABI - only the functions we need
const CONTRACT_ABI = [
    "function verifyCertificate(bytes32 certHash) external view returns (uint256)",
    "function isRegistered(bytes32 certHash) external view returns (bool)"
];

async function verifyOnBlockchain(certHash: string): Promise<{ verified: boolean; timestamp?: number; error?: string }> {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";

    if (!contractAddress) {
        return { verified: false, error: "Blockchain not configured" };
    }

    try {
        const provider = new JsonRpcProvider(rpcUrl);
        const contract = new Contract(contractAddress, CONTRACT_ABI, provider);

        // Convert certHash to bytes32
        const hashBytes32 = certHash.startsWith("0x") ? certHash : `0x${certHash}`;

        const timestamp = await contract.verifyCertificate(hashBytes32);

        return {
            verified: timestamp > 0,
            timestamp: timestamp > 0 ? Number(timestamp) : undefined,
        };
    } catch (error) {
        console.error("Blockchain verification error:", error);
        return { verified: false, error: "Failed to verify on blockchain" };
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ hash: string }> }
) {
    try {
        const { hash: rawHash } = await params;
        const hash = rawHash?.trim();
        const normalizedHash = hash && hash.length === 64 ? hash.toLowerCase() : hash;

        const cert = await prisma.certificate.findFirst({
            where: {
                OR: [
                    { certHash: normalizedHash },
                    { id: normalizedHash },
                ],
            },
            include: {
                template: true,
            },
        });

        if (!cert) {
            return Response.json(
                { valid: false, message: "Certificate not found. Use the exact verification hash or certificate ID." },
                { status: 404 }
            );
        }

        // Check blockchain status
        const blockchainResult = await verifyOnBlockchain(cert.certHash);

        return Response.json({
            valid: true,
            certificate: {
                recipient: cert.recipient,
                course: cert.course,
                universityName: cert.universityName,
                department: cert.department,
                grade: cert.grade,
                issuedAt: cert.issuedAt,
                certHash: cert.certHash,
                template: cert.template?.name || 'Unknown Template',
            },
            blockchain: {
                verified: blockchainResult.verified,
                timestamp: blockchainResult.timestamp,
                status: cert.blockchainStatus,
                txHash: cert.blockchainTxHash,
            },
        });

    } catch (error) {
        console.error(error);
        return Response.json(
            { valid: false, message: "Error verifying certificate" },
            { status: 500 }
        );
    }
}