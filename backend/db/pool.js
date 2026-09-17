import fs from "node:fs";
import pg from "pg";

import { env } from "../config/env.js";

const { Pool } = pg;

const rdsCaCert = fs.readFileSync(
  new URL("./certs/ca-central-1-bundle.pem", import.meta.url),
  "utf8"
);

function isAwsRdsHost(connectionString) {
  try {
    const { hostname } = new URL(connectionString || "");
    return hostname.endsWith(".rds.amazonaws.com");
  } catch {
    return false;
  }
}

// pg's ConnectionParameters does:
//   config = Object.assign({}, config, parse(config.connectionString))
// when both `connectionString` and an explicit `ssl` option are passed to
// `new Pool()` — meaning if the URL itself has `sslmode`/`sslcert`/etc. in
// its query string, pg-connection-string rebuilds its OWN `ssl` object from
// that and it silently overwrites whatever we pass below. Stripping those
// params out of the string is what lets our explicit `ssl` config actually
// take effect instead of being discarded.
function stripSslParamsFromConnectionString(connectionString) {
  if (!connectionString) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("channel_binding");
    url.searchParams.delete("sslcert");
    url.searchParams.delete("sslkey");
    url.searchParams.delete("sslrootcert");
    return url.toString();
  } catch {
    return connectionString;
  }
}

// `ca` REPLACES Node's default trusted root store instead of adding to it.
// For a real AWS RDS host we keep the strict old behavior: pin to ONLY the
// RDS CA bundle, so nothing else validates even if it has a perfectly good
// certificate from a normal public CA (extra protection against e.g. DNS
// hijacking pointing DATABASE_URL at an impostor host).
//
// Any other host (Neon, or any other non-RDS Postgres provider) isn't
// signed by that RDS CA at all, so it falls back to Node's normal public
// CA trust store instead — otherwise every non-RDS connection fails with
// "The server does not support SSL connections".
const sslConfig = env.db.disableSsl
  ? false
  : isAwsRdsHost(env.databaseUrl)
  ? { ca: rdsCaCert, rejectUnauthorized: true }
  : { rejectUnauthorized: true };

if (env.db.disableSsl) {
  console.warn(
    "DB_DISABLE_SSL is set — connecting to Postgres WITHOUT TLS. Local troubleshooting only, never in a deployed environment."
  );
}

const pool = new Pool({
  connectionString: stripSslParamsFromConnectionString(env.databaseUrl),
  ssl: sslConfig,
});

export default pool;