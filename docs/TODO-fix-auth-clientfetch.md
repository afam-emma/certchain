# Fix Auth ClientFetchError - Implementation Steps

## Current Status
- [x] Env vars setup (NEXTAUTH_SECRET)
- [x] Restart dev server instructed
- [ ] Complete .env.local
- [ ] Prisma migrate + seed
- [ ] Restart dev server
- [ ] Test login flow
- [ ] Verify console error fixed

## Step 1: Complete .env.local
Create/update .env.local with:
```
DATABASE_URL="postgresql://user:pass@localhost:5432/certchain?schema=public"
NEXTAUTH_SECRET="E+IU2ftQom/7tusF+pfD/nT+OfkRJm96VLMVvk9HnsA="
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

**Next action: Run prisma commands after env setup.**
