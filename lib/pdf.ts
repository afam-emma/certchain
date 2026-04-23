// src/lib/pdf.ts

import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";

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
    // Read HTML template
    const templatePath = path.join(process.cwd(), 'certificate-template.html');
    let htmlTemplate;
    try {
      htmlTemplate = await fs.readFile(templatePath, 'utf8');
    } catch (fileError) {
      const errMsg = `Template file error: ${fileError instanceof Error ? fileError.message : String(fileError)}. Path: ${templatePath}`;
      console.error(errMsg);
      throw new Error(errMsg);
    }

    // Prepare data for replacement
    const certId = data.certHash.substring(0, 16).toUpperCase();
    const dateStr = new Date(data.issuedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const qrCodeUrl = data.qrCode; // already data URL
    const universityName = data.universityName || 'University of Example';
    const department = data.department || 'Department of Computer Science';
    const grade = data.grade || 'Second Class Honours';

    // Replace placeholders
    let html = htmlTemplate
      .replace(/{{FULL_NAME}}/g, data.recipient)
      .replace(/{{COURSE}}/g, data.course)
      .replace(/{{UNIVERSITY_NAME}}/g, universityName)
      .replace(/{{DEPARTMENT}}/g, department)
      .replace(/{{GRADE}}/g, grade)
      .replace(/{{DATE}}/g, dateStr)
      .replace(/{{QR_CODE_URL}}/g, qrCodeUrl)
      .replace(/{{CERT_ID}}/g, certId)
      .replace(/{{CERT_HASH}}/g, data.certHash);

    console.log('HTML template processed, launching browser...');
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-extensions',
          '--disable-default-apps',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--font-render-hinting=none',
          '--disable-ipc-flooding-protection',
          '--memory-pressure-off',
          '--disable-background-media-download',
          '--disable-component-extensions-with-background-pages',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--max_old_space_size=4096',
          '--disable-software-rasterizer',
          '--disable-background-networking'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        timeout: 120000,
        ignoreDefaultArgs: ['--disable-extensions'],
        // Try without single-process for Windows
        // singleProcess: false
      });
      
      const page = await browser.newPage();
      console.log('Page created, setting viewport...');
      await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });
      
      // Navigate to blank page first
      await page.goto('about:blank');
      console.log('Navigated to blank page');
      
      // Set user agent to avoid issues
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log('Setting page content...');
      await page.setContent(html, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      console.log('Page content set successfully');
      
      // Wait a bit for fonts/images to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Wait completed, starting PDF generation...');
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        timeout: 30000 // Add timeout to PDF generation
      });
      console.log('PDF generated successfully, size:', pdf.length);

      await browser.close();
      return pdf;
    } catch (puppeteerError) {
      if (browser) await browser.close().catch(() => {});
      const errMsg = `Puppeteer/PDF error: ${puppeteerError instanceof Error ? puppeteerError.name + ': ' + puppeteerError.message : String(puppeteerError)}`;
      console.error(errMsg);
      console.error('Stack:', puppeteerError instanceof Error ? puppeteerError.stack : '');
      throw new Error(errMsg);
    }
  } catch (error) {
    console.error('Overall PDF generation failed:', error);
    throw error; // Preserve original error details
  }
}
