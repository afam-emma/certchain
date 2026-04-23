# Database Setup Guide

## Quick Start

### 1. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL
```

### 2. Initialize Database

**First time setup:**
```bash
npm run db:migrate:dev
npm run db:seed
```

**Subsequent setups:**
```bash
npm run db:push
npm run db:seed
```

**Complete reset (development only):**
```bash
npm run db:reset
```

## Available Database Commands

- `npm run db:push` - Push schema changes to database (development)
- `npm run db:migrate` - Run pending migrations (production)
- `npm run db:migrate:dev` - Create and run migrations interactively
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio UI
- `npm run db:reset` - Reset database completely (dev only)

## Database Schema

### Models

#### Certificate
- `id` (UUID) - Primary key
- `recipient` - Certificate recipient name
- `course` - Course/degree name
- `certHash` - Unique certificate hash
- `qrCode` - QR code data
- `templateId` - Foreign key to Template
- `issuedAt` - Issue timestamp
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### Template
- `id` (UUID) - Primary key
- `name` - Template name (unique)
- `bgImage` - Background image URL/data
- `fontFamily` - Font for certificate
- `fontSize` - Font size
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Best Practices Implemented

✅ **Singleton Pattern** - Single Prisma Client instance prevents connection pool exhaustion
✅ **Type Safety** - TypeScript seed script with interfaces
✅ **Proper Error Handling** - Comprehensive error handling with cleanup
✅ **Database Indexes** - Optimized indexes on frequently queried fields
✅ **Constraints** - Unique constraints, foreign keys with cascade delete
✅ **Field Types** - Proper PostgreSQL field types (VarChar, SmallInt, Text)
✅ **Timestamps** - createdAt and updatedAt for auditing
✅ **Seed Script** - Idempotent seeding with skip duplicates
✅ **Environment Management** - .env.example for documentation

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Check database credentials

### Migration Drift
```bash
npm run db:push
```

### Schema Validation
```bash
npx prisma validate
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Reset Everything (dev only)
```bash
npm run db:reset
npm run db:seed
```
