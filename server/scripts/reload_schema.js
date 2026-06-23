import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function reload() {
  const pool = getPool();
  try {
    console.log("Sending NOTIFY pgrst, 'reload schema'...");
    await pool.query("NOTIFY pgrst, 'reload schema';");
    console.log("PostgREST schema reload notification sent.");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

reload();
