import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './schema.prisma',
  // For Prisma CLI db push, ensure a concrete URL is available at runtime.
  // Provider is declared in `prisma/schema.prisma`.
  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
})
