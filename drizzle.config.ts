import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts", // 之後產生的 schema 要放在哪
  out: "./drizzle", // 遷移文件存放處
  dialect: "postgresql", // 資料庫類型
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
