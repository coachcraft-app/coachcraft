import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/sqlite_schemas/dev_schema.ts",
  dbCredentials: {
    url: "./src/db/dev.db",
  },
});
