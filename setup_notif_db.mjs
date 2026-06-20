import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function setup() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env.local");
  }
  
  const sql = neon(process.env.DATABASE_URL);

  console.log("Creating notification_emails table...");
  await sql`
    CREATE TABLE IF NOT EXISTS notification_emails (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("Table notification_emails created or already exists.");
}

setup().catch(console.error);
