import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function inspect() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT b.*, g.email as guest_email, g.full_name as guest_name
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      WHERE b.id = 'a8bbf709-3133-4119-b99a-d7c817be6bb0';
    `);
    console.log("Inspection of 22nd Booking:");
    console.log(res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspect();
