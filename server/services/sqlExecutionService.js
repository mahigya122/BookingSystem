import pkg from "pg";
const { Pool } = pkg;

let pool;

function normalizeQuery(sql) {
  return String(sql || "").trim().replace(/;\s*$/u, "");
}

function getConnectionString() {
  const directUrl =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.SUPABASE_POSTGRES_URL ||
    process.env.POSTGRES_URL ||
    null;

  if (directUrl) {
    return directUrl;
  }

  const projectRef = process.env.SUPABASE_PROJECT_REF || null;
  const password = process.env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_PASSWORD || null;
  const host = process.env.SUPABASE_DB_HOST || process.env.SUPABASE_HOST || null;
  const user = process.env.SUPABASE_DB_USER || "postgres";
  const port = process.env.SUPABASE_DB_PORT || "5432";
  const database = process.env.SUPABASE_DB_NAME || "postgres";

  if (projectRef && password) {
    const resolvedHost = host || `db.${projectRef}.supabase.co`;
    const encodedPassword = encodeURIComponent(password);

    return `postgresql://${user}:${encodedPassword}@${resolvedHost}:${port}/${database}`;
  }

  return null;
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error(
        "Missing Supabase Postgres connection string. Add DATABASE_URL, or set SUPABASE_PROJECT_REF and SUPABASE_DB_PASSWORD in server/.env so the server can execute validated SQL."
      );
    }

    if (connectionString.includes("[YOUR-PASSWORD]")) {
      throw new Error(
        "Your DATABASE_URL still contains [YOUR-PASSWORD]. Replace it with the real Supabase database password."
      );
    }

    pool = new Pool({
      connectionString,
      ssl:
        process.env.DATABASE_SSL === "false"
          ? false
          : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
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
