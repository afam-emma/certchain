import { prisma } from "@/lib/prisma";
import { generateCertHash } from "@/lib/hash";
import QRCode from "qrcode";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const nameField = (formData.get("nameField") as string) || "";
        const courseField = (formData.get("courseField") as string) || "";
        const universityField = (formData.get("universityField") as string) || "";
        const departmentField = (formData.get("departmentField") as string) || "";
        const gradeField = (formData.get("gradeField") as string) || "";

        if (!file || !nameField || !courseField) {
            return Response.json({ error: "Missing file or required field mappings (name, course)" }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Parse Excel
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        let success = 0;
        let failed = 0;

        const results = [];

        for (const row of rows) {
            try {
                const name = row[nameField] || row[nameField?.toLowerCase?.()] || row[nameField?.toUpperCase?.()];
                const course = row[courseField] || row[courseField?.toLowerCase?.()] || row[courseField?.toUpperCase?.()];
                const universityName = universityField ? (row[universityField] || row[universityField?.toLowerCase?.()] || row[universityField?.toUpperCase?.()] || null) : null;
                const department = departmentField ? (row[departmentField] || row[departmentField?.toLowerCase?.()] || row[departmentField?.toUpperCase?.()] || null) : null;
                const grade = gradeField ? (row[gradeField] || row[gradeField?.toLowerCase?.()] || row[gradeField?.toUpperCase?.()] || null) : null;

                if (!name || !course) {
                    failed++;
                    continue;
                }

                const issuedAt = new Date();

                const certHash = generateCertHash({
                    recipient: name,
                    course,
                    universityName,
                    department,
                    grade,
                    issuedAt: issuedAt.toISOString(),
                });

                const verifyUrl = `${process.env.NEXT_PUBLIC_URL}/verify/${certHash}`;

                const qrCode = await QRCode.toDataURL(verifyUrl);

                const cert = await prisma.certificate.create({
                    data: {
                        recipient: name,
                        course,
                        universityName,
                        department,
                        grade,
                        issuedAt,
                        certHash,
                        qrCode,
                    },
                });

                results.push({
                    name,
                    course,
                    universityName,
                    department,
                    grade,
                    hash: certHash,
                    verifyUrl,
                });

                success++;

            } catch (err) {
                console.error("Row failed:", err);
                failed++;
            }
        }

        return Response.json({
            total: rows.length,
            success,
            failed,
            results,
        });

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Bulk upload failed" }, { status: 500 });
    }
}