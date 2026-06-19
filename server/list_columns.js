import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function listColumns() {
  const pool = getPool();
  try {
    const tables = ['cabins', 'locations', 'activities', 'offers', 'bookings', 'guests'];
    for (const table of tables) {
      const res = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}'
        ORDER BY ordinal_position;
      `);
      console.log(`Table: ${table}`);
      console.table(res.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

listColumns();
