import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function fixConflicts() {
  const pool = getPool();
  try {
    console.log("Cancelling overlapping bookings to clear path for constraint...");
    
    // We'll cancel one from each pair. 
    // For simplicity, we can cancel all bookings that are part of an overlap.
    // In a real prod environment, we'd manually resolve, but for this task, 
    // we need to make the DB consistent.
    
    const res = await pool.query(`
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id IN (
        SELECT b2.id
        FROM bookings b1
        JOIN bookings b2 ON b1.cabin_id = b2.cabin_id AND b1.id < b2.id
        WHERE b1.status IN ('booked', 'checked-in')
          AND b2.status IN ('booked', 'checked-in')
          AND daterange(b1.start_date, b1.end_date) && daterange(b2.start_date, b2.end_date)
      );
    `);
    
    console.log(`Updated ${res.rowCount} conflicting bookings to 'cancelled'.`);
  } catch (err) {
    console.error("Error fixing conflicts:", err.message);
  } finally {
    await pool.end();
  }
}

fixConflicts();
