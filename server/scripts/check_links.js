import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function checkOffersAndActivities() {
  const pool = getPool();
  try {
    const resOffers = await pool.query(`SELECT * FROM cabin_offers LIMIT 5`);
    console.log("Cabin Offers sample:");
    console.table(resOffers.rows);

    const resActs = await pool.query(`SELECT * FROM cabin_activities LIMIT 5`);
    console.log("Cabin Activities sample:");
    console.table(resActs.rows);

    const resO = await pool.query(`SELECT id, title FROM offers LIMIT 5`);
    console.log("Offers sample:");
    console.table(resO.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkOffersAndActivities();
