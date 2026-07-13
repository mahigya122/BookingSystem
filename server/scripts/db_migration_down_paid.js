import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function runMigration() {
  console.log("Starting DB migration for bookings payment statuses...");
  const pool = getPool();
  try {
    // 1. Drop existing bookings_payment_status_check and recreate it with down-paid
    console.log("Updating bookings_payment_status_check constraint to include down-paid...");
    await pool.query(`
      ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
      ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check CHECK (
        (payment_status IS NULL) OR
        (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'fully_paid'::text, 'down-paid'::text, 'refunded'::text]))
      );
    `);
    console.log("Constraint bookings_payment_status_check updated successfully.");

    // 2. Migrate existing rows to match new logic
    console.log("Migrating existing data: mapping 'fully_paid' to 'paid'...");
    const migrateFullyPaid = await pool.query(`
      UPDATE bookings
      SET payment_status = 'paid'
      WHERE payment_status = 'fully_paid';
    `);
    console.log(`Migrated ${migrateFullyPaid.rowCount} fully paid bookings.`);

    console.log("Migrating existing data: mapping 'paid' with 'esewa_deposit' to 'down-paid'...");
    const migrateDownPaid = await pool.query(`
      UPDATE bookings
      SET payment_status = 'down-paid'
      WHERE payment_status = 'paid' AND payment_method = 'esewa_deposit';
    `);
    console.log(`Migrated ${migrateDownPaid.rowCount} down-paid bookings.`);

    // 3. Notify PostgREST to reload schema
    console.log("Notifying PostgREST to reload schema...");
    await pool.query("NOTIFY pgrst, 'reload schema';");
    console.log("PostgREST schema reload notification sent.");

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
