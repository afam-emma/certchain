import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export async function generateCertificate(data: {
  recipient: string;
  course: string;
  universityName?: string | null;
  department?: string | null;
  grade?: string | null;
  issuedAt: string;
  qrCode: string;
  certHash: string;
}) {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape (pts)
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const certId = data.certHash.substring(0, 16).toUpperCase();
    const dateStr = new Date(data.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const universityName = data.universityName || 'University of Example';
    const department = data.department || 'Department of Computer Science';
    const grade = data.grade || 'Second Class Honours';

    // --- Colors ---
    const gold = rgb(0.79, 0.65, 0.28);
    const goldLight = rgb(0.90, 0.82, 0.54);
    const dark = rgb(0.13, 0.13, 0.13);
    const gray = rgb(0.40, 0.40, 0.40);
    const lightGray = rgb(0.93, 0.93, 0.93);

    // --- Background ---
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(1, 1, 1),
    });

    // --- Gold Borders ---
    const margin = 28;
    page.drawRectangle({
      x: margin,
      y: margin,
      width: width - margin * 2,
      height: height - margin * 2,
      borderWidth: 4,
      borderColor: gold,
    });
    page.drawRectangle({
      x: margin + 10,
      y: margin + 10,
      width: width - (margin + 10) * 2,
      height: height - (margin + 10) * 2,
      borderWidth: 1.5,
      borderColor: goldLight,
    });

    // --- Watermark ---
    page.drawText('CERTCHAIN', {
      x: width / 2 - 200,
      y: height / 2 - 20,
      size: 80,
      font: fontBold,
      color: rgb(0.95, 0.95, 0.95),
      rotate: degrees(-15),
    });

    // --- Header Crest (circle placeholder) ---
    page.drawCircle({
      x: width / 2,
      y: height - 70,
      size: 22,
      borderWidth: 1.5,
      borderColor: gray,
      color: lightGray,
    });

    // --- Header Text ---
    page.drawText('FEDERAL REPUBLIC OF NIGERIA', {
      x: width / 2 - 90,
      y: height - 105,
      size: 9,
      font,
      color: dark,
    });

    page.drawText(universityName.toUpperCase(), {
      x: width / 2 - (universityName.length * 6.5),
      y: height - 125,
      size: 20,
      font: fontBold,
      color: dark,
    });

    page.drawText('CERTIFICATE OF BACHELOR OF SCIENCE', {
      x: width / 2 - 130,
      y: height - 150,
      size: 11,
      font,
      color: dark,
    });

    // --- Body Text ---
    const centerX = width / 2;
    let currentY = height - 200;

    page.drawText('This is to certify that', {
      x: centerX - 65,
      y: currentY,
      size: 11,
      font,
      color: dark,
    });

    currentY -= 35;
    page.drawText(data.recipient, {
      x: centerX - (data.recipient.length * 5.5),
      y: currentY,
      size: 24,
      font: fontBold,
      color: dark,
    });

    currentY -= 30;
    page.drawText('having satisfied all the requirements for the award of the degree', {
      x: centerX - 195,
      y: currentY,
      size: 10,
      font,
      color: dark,
    });

    currentY -= 25;
    page.drawText('Bachelor of Science (B.Sc)', {
      x: centerX - 105,
      y: currentY,
      size: 16,
      font: fontBold,
      color: dark,
    });

    currentY -= 22;
    page.drawText('in', {
      x: centerX - 6,
      y: currentY,
      size: 10,
      font,
      color: dark,
    });

    currentY -= 25;
    page.drawText(data.course, {
      x: centerX - (data.course.length * 4),
      y: currentY,
      size: 14,
      font: fontBold,
      color: dark,
    });

    currentY -= 22;
    page.drawText(`Department of ${department}`, {
      x: centerX - ((`Department of ${department}`.length * 4.2)),
      y: currentY,
      size: 10,
      font,
      color: dark,
    });

    currentY -= 22;
    page.drawText(`with ${grade} on this day ${dateStr}`, {
      x: centerX - ((`with ${grade} on this day ${dateStr}`.length * 4)),
      y: currentY,
      size: 10,
      font,
      color: dark,
    });

    // --- Signatures ---
    const sigY = 100;
    const leftSigX = 180;
    const rightSigX = width - 180;

    page.drawLine({
      start: { x: leftSigX - 60, y: sigY },
      end: { x: leftSigX + 60, y: sigY },
      thickness: 1,
      color: dark,
    });
    page.drawText('Vice Chancellor', {
      x: leftSigX - 40,
      y: sigY - 14,
      size: 9,
      font,
      color: dark,
    });

    page.drawLine({
      start: { x: rightSigX - 60, y: sigY },
      end: { x: rightSigX + 60, y: sigY },
      thickness: 1,
      color: dark,
    });
    page.drawText('Registrar', {
      x: rightSigX - 28,
      y: sigY - 14,
      size: 9,
      font,
      color: dark,
    });

    // --- QR Code ---
    if (data.qrCode && data.qrCode.startsWith('data:image')) {
      try {
        const base64Data = data.qrCode.split(',')[1];
        const qrImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));
        const qrSize = 60;
        page.drawImage(qrImage, {
          x: width - margin - 30 - qrSize,
          y: margin + 20,
          width: qrSize,
          height: qrSize,
        });
        page.drawText('Scan to Verify', {
          x: width - margin - 30 - qrSize + 2,
          y: margin + 12,
          size: 7,
          font,
          color: gray,
        });
      } catch (qrError) {
        console.warn('QR code embed failed:', qrError);
      }
    }

    // --- Footer Hash ---
    page.drawText(`Certificate ID: ${certId}`, {
      x: margin + 20,
      y: margin + 30,
      size: 7,
      font,
      color: gray,
    });
    page.drawText(`Hash: ${data.certHash}`, {
      x: margin + 20,
      y: margin + 18,
      size: 7,
      font,
      color: gray,
    });

    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully with pdf-lib, size:', pdfBytes.length);
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(`PDF Generation Failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
