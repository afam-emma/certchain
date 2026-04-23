# CertChain Setup TODO - Progress Update

## ✅ Steps Completed
- [x] Created `.env.local` with NEXTAUTH_SECRET, NEXTAUTH_URL, AUTH_TRUST_HOST=true
- [ ] Prisma generate (failed EPERM - Windows issue)

## 🔄 Current Status
- `npx prisma generate`: Failed with EPERM rename in node_modules/.prisma (common on Windows - close VSCode/Next.js/antivirus exclude)
- `npx prisma db push`: Failed - No PostgreSQL DB (expected)

## 🚀 Next Steps (Copy-paste these commands):
1. **Fix Prisma generate** (EPERM error - Windows lock):
   ```
   Remove-Item -Recurse -Force node_modules\.prisma\client -ErrorAction SilentlyContinue
   npx prisma generate
   ```
   - Or close VSCode, delete `node_modules/.prisma/client` manually, reopen/retry.
   - Exclude folder from antivirus/Windows Defender.

2. **Quick PostgreSQL Setup (Docker - easiest)**:
   ```
   docker run --name certchain-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=certchain -p 5432:5432 -d postgres:16
   ```
   - Wait 30s for ready.
   - Verify: `docker logs certchain-db`

3. **Push & Seed** (DB now ready):
   ```
   npx prisma db push
   npx prisma db seed
   ```

4. **Restart Dev Server**:
   - Ctrl+C any running `npm run dev`
   ```
   npm run dev
   ```

5. **Test Auth**:
   - Visit http://localhost:3000/dashboard → redirects to /login
   - Login: `admin@certchain.com` / `admin123`
   - Should go to /dashboard without errors!

## If No Docker (Recommended PG Install):
1. Download PostgreSQL 16: https://www.postgresql.org/download/windows/ (use installer)
2. Install with:
   - Password: `postgres`
   - Port: 5432
   - Locale default
3. Add to PATH or use pgAdmin/psql
4. Create DB:
   ```
   psql -U postgres -h localhost
   CREATE DATABASE certchain;
   \q
   ```
5. `.env.local` DATABASE_URL already: "postgresql://postgres:postgres@localhost:5432/certchain?schema=public"

✅ Then run Prisma steps 1-5 above.

**Login works after seed!** (admin@certchain.com / admin123)

## Commands Ready:
Run the Docker command first if you have Docker installed.

Auth secret is now fixed - DB setup remaining!
