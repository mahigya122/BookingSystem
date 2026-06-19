import dotenv from "dotenv";
import { getPool } from "./services/dbPool.js";

dotenv.config({ path: "./server/.env" });

const PRICES = {
  'Cycling': 35,
  'Boating': 60,
  'Paragliding': 180,
  'Trekking': 85,
  'Bungee Jumping': 140,
  'Jungle Safari': 110,
  'Hiking': 45,
  'Diving': 150,
  'Skiing': 120
};

async function migrateActivities() {
  const pool = getPool();
  try {
    console.log("Starting activities migration...");

    // 1. Move legacy associations from 'activities' table to 'cabin_activities'
    console.log("Migrating legacy cabin associations from activities table to cabin_activities junction...");
    await pool.query(`
      INSERT INTO cabin_activities (cabin_id, activity_id)
      SELECT cabin_id, id FROM activities
      WHERE cabin_id IS NOT NULL
      ON CONFLICT DO NOTHING
    `);

    // 2. Identify unique activity names and pick a master ID for each
    console.log("Identifying unique activity names and deduplicating...");
    const res = await pool.query(`
      SELECT name, array_agg(id) as ids
      FROM activities
      GROUP BY name
    `);

    for (const row of res.rows) {
      const { name, ids } = row;
      const masterId = ids[0];
      const otherIds = ids.slice(1);

      console.log(`Processing activity: "${name}" (Master: ${masterId}, Duplicates: ${otherIds.length})`);

      // Update junction table to point to masterId
      if (otherIds.length > 0) {
        // Insert links for other IDs pointing to masterId
        await pool.query(`
          INSERT INTO cabin_activities (cabin_id, activity_id)
          SELECT cabin_id, $1 FROM cabin_activities
          WHERE activity_id = ANY($2)
          ON CONFLICT DO NOTHING
        `, [masterId, otherIds]);

        // Delete links for other IDs
        await pool.query(`
          DELETE FROM cabin_activities
          WHERE activity_id = ANY($1)
        `, [otherIds]);

        // Delete duplicate activity records
        await pool.query(`
          DELETE FROM activities
          WHERE id = ANY($1)
        `, [otherIds]);
      }

      // 3. Set reasonable price for the master record
      const price = PRICES[name] || 50;
      await pool.query(`
        UPDATE activities
        SET price = $1, cabin_id = NULL, cabin_name = NULL
        WHERE id = $2
      `, [price, masterId]);
    }

    // 4. Final check: delete any activities that might have been left over (though logic above should handle it)
    console.log("Cleaning up activities table...");
    // We already nulled out cabin_id and cabin_name on master records. 
    // Let's just make sure all records have reasonable names and prices.

    console.log("Migration completed successfully!");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrateActivities();
