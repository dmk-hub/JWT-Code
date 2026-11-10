import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Thay thế dòng env("DATABASE_URL") bằng đường link thật
    url: "postgres://e306e5fd941dab79d9539108e106a07c48065dbd40b508df56066310887eb74e:sk_Db59XET_5ZFxFeOOHqYOQ@pooled.db.prisma.io:5432/postgres?sslmode=require",
  },
});