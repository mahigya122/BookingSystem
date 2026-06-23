import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function findEarlyBird() {
  const pool = getPool();
  try {
    const res = await pool.query(`SELECT id, title FROM offers WHERE title ILIKE '%Early Bird%'`);
    console.table(res.rows);
    
    for (const row of res.rows) {
        const offerId = row.id;
        const resCabins = await pool.query(`SELECT count(*) FROM cabin_offers WHERE offer_id = $1`, [offerId]);
        console.log(`Offer ${row.title} (${offerId}): ${resCabins.rows[0].count} cabins`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

findEarlyBird();
