import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkOverlaps() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT b1.id as id1, b2.id as id2, b1.cabin_id, b1.start_date as s1, b1.end_date as e1, b2.start_date as s2, b2.end_date as e2
      FROM bookings b1
      JOIN bookings b2 ON b1.cabin_id = b2.cabin_id AND b1.id < b2.id
      WHERE b1.status IN ('booked', 'checked-in')
        AND b2.status IN ('booked', 'checked-in')
        AND daterange(b1.start_date, b1.end_date) && daterange(b2.start_date, b2.end_date);
    `);
    
    if (res.rows.length > 0) {
      console.log("Found overlapping bookings:");
      console.table(res.rows);
    } else {
      console.log("No overlapping bookings found.");
    }
  } catch (err) {
    console.error("Error checking overlaps:", err.message);
  } finally {
    await pool.end();
  }
}

checkOverlaps();
