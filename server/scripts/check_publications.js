import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkPubs() {
  const pool = getPool();
  try {
    const pubRes = await pool.query("SELECT * FROM pg_publication;");
    console.log("Publications:");
    console.table(pubRes.rows);

    const tableRes = await pool.query("SELECT * FROM pg_publication_tables;");
    console.log("\nPublication Tables:");
    console.table(tableRes.rows);

    const rlsRes = await pool.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relname IN ('bookings', 'profiles', 'guests');
    `);
    console.log("\nRLS Status (relrowsecurity: true means RLS is enabled):");
    console.table(rlsRes.rows);

    const policyRes = await pool.query(`
      SELECT tablename, policyname, roles, cmd, qual 
      FROM pg_policies 
      WHERE tablename IN ('bookings', 'profiles', 'guests');
    `);
    console.log("\nRLS Policies:");
    console.table(policyRes.rows);
  } catch (err) {
    console.error("Error checking publications:", err);
  } finally {
    await pool.end();
  }
}

checkPubs();
