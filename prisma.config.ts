import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Thay thế dòng env("DATABASE_URL") bằng đường link thật
    url: "postgresql://postgres:123456@127.0.0.1:5432/postgres?schema=public",
  },
});