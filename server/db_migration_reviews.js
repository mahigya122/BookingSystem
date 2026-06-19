import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function runReviewsMigration() {
  console.log("Dropping and recreation of reviews guest_id foreign key constraint...");
  const pool = getPool();
  try {
    // 1. Drop existing reviews_guest_id_fkey referencing auth.users if it exists
    await pool.query(`
      ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_guest_id_fkey;
    `);
    console.log("Dropped reviews_guest_id_fkey if existed.");

    // 2. Add fk_reviews_guests referencing guests(id)
    await pool.query(`
      ALTER TABLE reviews 
      ADD CONSTRAINT fk_reviews_guests 
      FOREIGN KEY (guest_id) 
      REFERENCES guests(id) 
      ON DELETE CASCADE;
    `);
    console.log("Added fk_reviews_guests constraint pointing to guests(id).");

    // 3. Notify PostgREST to reload schema
    console.log("Notifying PostgREST to reload schema...");
    await pool.query("NOTIFY pgrst, 'reload schema';");
    console.log("PostgREST schema reload notification sent.");

    console.log("Reviews constraint migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runReviewsMigration();
