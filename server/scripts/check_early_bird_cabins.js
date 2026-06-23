import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkEarlyBirdCabins() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT c.id, c.name, c.price_per_night, o.id as offer_id, o.title
      FROM cabins c
      JOIN cabin_offers co ON c.id = co.cabin_id
      JOIN offers o ON co.offer_id = o.id
      WHERE o.title ILIKE '%Early Bird%'
    `);
    console.log("Cabins with Early Bird offers:");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkEarlyBirdCabins();
