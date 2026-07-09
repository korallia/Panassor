import fs from "node:fs";
import pg from "pg";

const { Pool } = pg;

const rdsCaCert = fs.readFileSync(
  new URL("./certs/ca-central-1-bundle.pem", import.meta.url),
  "utf8"
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: rdsCaCert,
    rejectUnauthorized: true,
  },
});

export default pool;