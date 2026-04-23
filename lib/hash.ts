import crypto from "crypto";


export function generateCertHash(data: {
  recipient: string;
  course: string;
  universityName?: string;
  department?: string;
  grade?: string;
  issuedAt: string;
}) {
  const raw = `${data.recipient}-${data.course}-${data.universityName || ''}-${data.department || ''}-${data.grade || ''}-${data.issuedAt}`;

  return crypto.createHash("sha256").update(raw).digest("hex");
}

