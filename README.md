This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Local database (Postgres) setup ⚙️

This project uses Postgres in development. If you don't have a Postgres server running locally, you can start one quickly with Docker:

```bash
# starts Postgres on 5432 with user/postgres and password/postgres
docker run --rm -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=marketplace -p 5432:5432 -d postgres:15
```

1. Create a `.env.local` file at the repo root and add (SQLite example):

```env
DATABASE_URL="file:./dev.db"
```

2. Install the SQLite adapter and push the Prisma schema to the database and generate the client:

```bash
# Install the adapter (required for Prisma v7 when using SQLite)
npm install @prisma/adapter-sqlite --save

# Push schema and generate client
npx prisma db push && npx prisma generate
```

If you prefer Postgres, set `DATABASE_URL` to your Postgres DSN and install `@prisma/adapter-pg` (already included in this repo). Start Postgres (e.g., with Docker) before running `npx prisma db push`.

Admin login credentials

- For local development, add these to `.env.local`:

```env
ADMIN_USER="admin@example.com"
ADMIN_PASS="admin"
```

- In production, set secure values as environment variables in your hosting environment and never commit secrets to source control.
3. Run the dev server:

```bash
npm run dev
```

> Note: If you prefer not to use Postgres, you can switch to SQLite by updating `schema.prisma`'s `provider` to `sqlite` and setting a suitable `DATABASE_URL` (e.g. `file:./dev.db`).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
