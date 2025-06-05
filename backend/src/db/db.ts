import "dotenv/config"
import { drizzle } from "drizzle-orm/better-sqlite3"

export const db = drizzle(process.env.DEV_DB_URL!);