import pg from "pg";

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? {
        ca: process.env.AWS_RDS_CA_CERT,
        rejectUnauthorized: true,
      }
    : false,
});