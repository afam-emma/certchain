const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testPDF() {
  try {
    console.log('1. Launching Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
        '--disable-extensions'
      ]
    });
    console.log('2. Browser launched successfully');
    
    const page = await browser.newPage();
    await page.setContent('<h1>Puppeteer Test Success!</h1><p>Generating PDF...</p>');
    console.log('3. Generating PDF...');
    
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    
    fs.writeFileSync('test-puppeteer.pdf', pdf);
    console.log('✅ SUCCESS! Check test-puppeteer.pdf (should open in browser)');
    console.log('Puppeteer works! Issue is Next.js API specific.');
  } catch (error) {
    console.error('❌ FAILED at step:', error.message);
    if (error.stack) console.error('Stack:', error.stack.split('\\n')[0]);
  }
}

testPDF();
