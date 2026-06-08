import { getPool } from "./dbPool.js";

function normalizeQuery(sql) {
  return String(sql || "").trim().replace(/;\s*$/u, "");
}

function isSafeSelect(sql) {
  const lower = sql.toLowerCase();
  const blocked = ["insert", "update", "delete", "drop", "alter", "truncate"];

  return lower.startsWith("select") && !blocked.some((word) => lower.includes(word));
}

export async function executeSQL(sql) {
  const query = normalizeQuery(sql);

  if (!isSafeSelect(query)) {
    throw new Error("Only safe SELECT queries are allowed.");
  }

  const db = getPool();
  const result = await db.query(query);

  return {
    rows: result.rows,
    rowCount: result.rowCount,
  };
}
