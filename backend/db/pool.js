import pg from "pg";

const { Pool } = pg;

const sslConfig = process.env.AWS_RDS_CA_CERT
  ? {
      ca: process.env.AWS_RDS_CA_CERT,
      rejectUnauthorized: true,
    }
  : undefined;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

export default pool;