# Auth Protection TODO

## Step 1: Install Dependencies [ ]
- npm i next-auth@beta @auth/prisma-adapter bcryptjs
- npm i -D @types/bcryptjs

## Step 2: Update Prisma Schema [ ]
- Edit schema.prisma: Add Role enum + User.role
- Run: npx prisma db push
- npx prisma generate

## Step 3: Create NextAuth Config [ ]
- Create app/api/auth/[...nextauth]/route.ts

## Step 4: Create Middleware [ ]
- Create middleware.ts

## Step 5: Create Login Page [ ]
- Create app/login/page.tsx

## Step 6: Update Dashboard Layout [ ]
- Edit app/dashboard/layout.tsx: useSession + redirect

## Step 7: Update Header [ ]
- Edit app/dashboard/components/Header.tsx: Add logout/user menu

## Step 8: Add SessionProvider [ ]
- Edit app/layout.tsx

## Step 9: Update Seed [ ]
- Edit prisma/seed.ts: Add admin/user

## Step 10: Seed DB [ ]
- npx prisma db seed

## Step 11: Update Home [ ]
- Edit app/page.tsx: Login link

## Step 12: Test [ ]
- /login → signin admin → /dashboard protected ✓
