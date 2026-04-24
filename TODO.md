# Fix PDF Preview for Vercel Deployment

## Problem
Puppeteer/Chromium cannot run in Vercel serverless functions → Preview fails with 500.

## Solution
Replace Puppeteer with `pdf-lib` (pure JS, serverless-safe).

## Steps
- [x] 1. Rewrite `lib/pdf.ts` — replace Puppeteer with `pdf-lib`
- [x] 2. Update `app/api/certificates/issue/route.ts` — keep same interface, fix regex bug
- [x] 3. Update `app/dashboard/page.tsx` — show actual error messages from API
- [x] 4. Update `app/api/certificates/download/[hash]/route.ts` — fix regex bug
- [ ] 5. Test locally, then deploy to Vercel

