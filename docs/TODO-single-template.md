# TODO: Implement Single HTML Template for All Certificates

Status: 6/13 ✅

## Step 1: Install puppeteer
- `npm install puppeteer`
- Update package.json

## Step 2: Update lib/hash.ts
- Remove templateId from generateCertHash input
- Hash = recipient-course-uni-dept-grade-issuedAt

## Step 3: Update Prisma Schema
- Make Certificate.templateId String? (optional)
- Run `npx prisma db push` or migrate

## Step 4: Update lib/pdf.ts
- Read certificate-template.html statically
- Replace placeholders with data
- Use puppeteer to generate PDF from HTML string
- Remove old pdf-lib hardcoded layout

## Step 5: Update app/api/certificates/issue/route.ts
- Remove templateId req/fetch
- Add inputs: university_name, department, grade
- Compute full data for pdf gen
- Save cert without templateId (null)

## Step 6: Update app/api/certificates/bulk/route.ts
- Remove templateId
- Accept multiple field mappings (nameField, courseField, uniField, deptField, gradeField)
- Parse XLSX with all fields

## Step 7: Update app/dashboard/page.tsx
- Remove category/template selection UI
- Add inputs: university_name, department, grade
- Update generate call with new fields
- Simplify preview

## Step 8: Update app/dashboard/components/BulkUploadPanel.tsx
- Add selects for uni, dept, grade columns
- Update onUpload with all fields

## Step 9: Update app/dashboard/components/CertificatePreview.tsx
- Render HTML template with replaced placeholders

## Step 10: Update app/api/certificates/download/[hash]/route.ts
- Extract data from stored cert (add defaults if missing fields)
- Gen PDF with new method

## Step 11: Remove/update templates API/UI references (suspend)
- Keep APIs but no UI selection

## Step 12: Update types app/dashboard/types.ts
- Add new fields to types

## Step 13: Test
- Single issue PDF
- Bulk XLSX (with all columns)
- Download/verify
- Preview UI

