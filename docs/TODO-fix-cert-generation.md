# Certificate Generation Fix - TODO

## Steps to Complete:

- [x] Step 1: Improve error handling in lib/pdf.ts with detailed error logging
- [ ] Step 2: Update app/api/certificates/issue/route.ts to return detailed errors 
- [ ] Step 3: Improve frontend error display in app/dashboard/page.tsx
- [x] Step 4: Test standalone Puppeteer with create test script (launches but Target closed - Windows crash, fixing args)
- [x] Step 5: Fix Puppeteer configuration for Windows/Next.js API (.env.local + stable args)
- [ ] Step 6: Add input validation
- [ ] Step 7: Full end-to-end test
- [ ] Step 8: Complete!

**Current Status:** Step 1 complete. Run `node test-puppeteer.js` and test cert generation to diagnose Puppeteer issue. See console/terminal for detailed errors.
