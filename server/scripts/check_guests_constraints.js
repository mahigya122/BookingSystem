import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkBookingsRLS() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'bookings';
    `);
    console.log("Bookings Table RLS Status:");
    console.table(res.rows);

    const res2 = await pool.query(`
      SELECT * 
      FROM pg_policies 
      WHERE tablename = 'bookings';
    `);
    console.log("Bookings Policies:");
    console.table(res2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkBookingsRLS();