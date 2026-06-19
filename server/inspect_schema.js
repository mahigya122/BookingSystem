import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkConstraints() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid) 
      FROM pg_constraint c 
      JOIN pg_namespace n ON n.oid = c.connamespace 
      WHERE conrelid = 'bookings'::regclass;
    `);
    console.log("Bookings Constraints:");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkConstraints();
