// src/lib/qr.ts

import QRCode from "qrcode";

export async function generateQR(url: string) {
    // return await QRCode.toDataURL(url); 
    return QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
    });
}