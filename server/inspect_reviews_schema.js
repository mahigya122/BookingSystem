import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function inspectReviews() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reviews'
      ORDER BY ordinal_position;
    `);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectReviews();
