# Fix Auth ClientFetchError - Step by Step

1. [ ] Add trustHost: true to NextAuth config
2. [ ] Run `npx prisma generate`
3. [ ] Run `npx prisma db push`
4. [ ] Run `npx prisma db seed`
5. [ ] Run `npm run dev` in new terminal
6. [ ] Test login at http://localhost:3000/login with admin@certchain.com / admin123
7. [ ] Check browser console for no ClientFetchError
8. [ ] Mark complete

1. [x] Add trustHost: true to NextAuth config
2. [x] Run `npx prisma generate` ✓

3. [x] Run `npx prisma db push` ✓

4. [ ] Run `npx prisma db seed` (running)
Current step: 2
