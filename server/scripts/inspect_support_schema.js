import dotenv from "dotenv";
import { getPool } from "../services/dbPool.js";

dotenv.config({ path: "./server/.env" });

async function inspectSupportSchema() {
  const pool = getPool();
  try {
    console.log("=== COLUMNS ===");
    const colsRes = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name IN ('support_conversations', 'support_messages') 
      ORDER BY table_name, ordinal_position;
    `);
    console.log(JSON.stringify(colsRes.rows, null, 2));

    console.log("\n=== CONSTRAINTS ===");
    const constsRes = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def, conrelid::regclass as table_name
      FROM pg_constraint c 
      WHERE conrelid IN ('support_conversations'::regclass, 'support_messages'::regclass);
    `);
    console.log(JSON.stringify(constsRes.rows, null, 2));

    console.log("\n=== TRIGGERS ON support_messages ===");
    const trigRes = await pool.query(`
      SELECT trigger_name, event_manipulation, action_statement, action_orientation, action_timing
      FROM information_schema.triggers 
      WHERE event_object_table = 'support_messages';
    `);
    console.log(JSON.stringify(trigRes.rows, null, 2));

    console.log("\n=== TRIGGER FUNCTIONS ===");
    const trigFuncRes = await pool.query(`
      SELECT DISTINCT p.proname, pg_get_functiondef(p.oid) as definition
      FROM pg_trigger t
      JOIN pg_proc p ON t.tgfoid = p.oid
      WHERE t.tgrelid = 'support_messages'::regclass;
    `);
    console.log(JSON.stringify(trigFuncRes.rows, null, 2));

    console.log("\n=== FUNCTION reset_unread DEFINITION ===");
    const funcRes = await pool.query(`
      SELECT proname, pg_get_functiondef(p.oid) as definition
      FROM pg_proc p
      WHERE proname = 'reset_unread';
    `);
    console.log(JSON.stringify(funcRes.rows, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectSupportSchema();
