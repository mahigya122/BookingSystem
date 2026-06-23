import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkRecentBookings() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT b.id, b.created_at, b.guest_id, b.status, g.email as guest_email, g.full_name as guest_name
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      ORDER BY b.created_at DESC;
    `);
    console.log("Recent Bookings in Database:");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkRecentBookings();
