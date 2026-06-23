import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function runMigration() {
  console.log("Starting DB migration...");
  const pool = getPool();
  try {
    // 1. Add description and price columns to activities if they do not exist
    console.log("Checking activities columns...");
    await pool.query(`
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
    `);
    console.log("activities columns verified/added.");

    // 2. Add foreign key constraint to reviews table if it does not exist
    console.log("Checking reviews guest_id foreign key constraint...");
    await pool.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.table_constraints tc 
              JOIN information_schema.key_column_usage kcu 
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
              WHERE tc.constraint_type = 'FOREIGN KEY' 
                AND tc.table_name = 'reviews'
                AND kcu.column_name = 'guest_id'
          ) THEN
              ALTER TABLE reviews 
              ADD CONSTRAINT fk_reviews_guests 
              FOREIGN KEY (guest_id) 
              REFERENCES guests(id) 
              ON DELETE CASCADE;
          END IF;
      END $$;
    `);
    console.log("reviews guest_id foreign key constraint verified/added.");
    console.log("DB migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
