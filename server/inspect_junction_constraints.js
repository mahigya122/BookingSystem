import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkJunctionConstraints() {
  const pool = getPool();
  try {
    const tables = ['cabin_offers', 'cabin_activities'];
    for (const table of tables) {
      const res = await pool.query(`
        SELECT conname, pg_get_constraintdef(c.oid) 
        FROM pg_constraint c 
        JOIN pg_namespace n ON n.oid = c.connamespace 
        WHERE conrelid = '${table}'::regclass;
      `);
      console.log(`Constraints for ${table}:`);
      console.table(res.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkJunctionConstraints();
