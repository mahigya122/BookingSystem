import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function runPaymentConstraintsMigration() {
  console.log("Starting DB migration for bookings payment constraints...");
  const pool = getPool();
  try {
    // 1. Drop existing bookings_payment_method_check and recreate it with new options
    console.log("Updating bookings_payment_method_check constraint...");
    await pool.query(`
      ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_method_check;
      ALTER TABLE bookings ADD CONSTRAINT bookings_payment_method_check CHECK (
        (payment_method IS NULL) OR 
        (payment_method = ANY (ARRAY['arrival'::text, 'visa'::text, 'mastercard'::text, 'fonepay'::text, 'esewa'::text, 'khalti'::text, 'esewa_deposit'::text, 'esewa_full'::text]))
      );
    `);
    console.log("bookings_payment_method_check updated successfully.");

    // 2. Drop existing bookings_payment_status_check and recreate it with fully_paid
    console.log("Updating bookings_payment_status_check constraint...");
    await pool.query(`
      ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
      ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check CHECK (
        (payment_status IS NULL) OR
        (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'fully_paid'::text, 'refunded'::text]))
      );
    `);
    console.log("bookings_payment_status_check updated successfully.");

    // 3. Notify PostgREST to reload schema
    console.log("Notifying PostgREST to reload schema...");
    await pool.query("NOTIFY pgrst, 'reload schema';");
    console.log("PostgREST schema reload notification sent.");

    console.log("Payment constraints migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runPaymentConstraintsMigration();
