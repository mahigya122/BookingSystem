import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkBookingsConstraints() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c 
      WHERE conrelid = 'bookings'::regclass;
    `);
    console.log("Bookings Constraints:");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkBookingsConstraints();
