import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkLocations() {
  const pool = getPool();
  try {
    const res = await pool.query(`SELECT id, name, city FROM locations LIMIT 10`);
    console.log("Locations sample:");
    console.table(res.rows);

    const resCabins = await pool.query(`SELECT id, name, location_id FROM cabins LIMIT 5`);
    console.log("Cabins location links:");
    console.table(resCabins.rows);

    const resJoin = await pool.query(`
      SELECT c.name as cabin, l.name as location_name
      FROM cabins c
      LEFT JOIN locations l ON c.location_id = l.id
      LIMIT 10
    `);
    console.log("Cabins with joined locations:");
    console.table(resJoin.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkLocations();
