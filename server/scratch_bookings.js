import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config();

const pool = getPool();
try {
  const { rows } = await pool.query("SELECT id, payment_status, payment_method, total_price FROM bookings LIMIT 5");
  console.log("Bookings:", rows);
} catch (error) {
  console.error("Error running query:", error);
} finally {
  await pool.end();
}
