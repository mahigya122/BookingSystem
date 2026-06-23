import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function migrate() {
  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log("Starting migration to prevent double bookings...");

    await client.query("BEGIN");

    // 1. Enable btree_gist extension (required for exclusion constraints with btree types like uuid/text)
    console.log("Enabling btree_gist extension...");
    await client.query("CREATE EXTENSION IF NOT EXISTS btree_gist");

    // 2. Add exclusion constraint
    // This constraint ensures that for any two rows with the same cabin_id and an active status,
    // their [start_date, end_date) ranges do not overlap.
    // We use status = 'booked' or 'checked-in' as active statuses.
    // Note: Standard EXCLUDE doesn't support easy filtering by status in the same way as a partial index,
    // but we can use a WHERE clause in the exclusion constraint if supported by the PG version, 
    // or simply apply it to all bookings and handle cancellations by allowing overlaps (which is tricky).
    
    // Better: Add a partial exclusion constraint if the PG version supports it (9.0+).
    console.log("Adding exclusion constraint to bookings table...");
    await client.query(`
      ALTER TABLE bookings 
      ADD CONSTRAINT no_overlapping_bookings 
      EXCLUDE USING gist (
        cabin_id WITH =,
        daterange(start_date, end_date) WITH &&
      )
      WHERE (status = 'booked' OR status = 'checked-in')
    `);

    await client.query("COMMIT");
    console.log("Migration completed successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err.message);
    if (err.message.includes("conflicts with existing key")) {
      console.error("ERROR: Existing overlapping bookings found. Please resolve them before applying this constraint.");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
