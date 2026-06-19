import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function findCabinWithOffer() {
  const pool = getPool();
  try {
    const res = await pool.query(`
      SELECT c.id, c.name, o.id as offer_id, o.title
      FROM cabins c
      JOIN cabin_offers co ON c.id = co.cabin_id
      JOIN offers o ON co.offer_id = o.id
      LIMIT 1
    `);
    if (res.rows.length > 0) {
      console.log("Cabin with offer:");
      console.log(JSON.stringify(res.rows[0], null, 2));
    } else {
      console.log("No cabins with offers found in DB.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

findCabinWithOffer();
