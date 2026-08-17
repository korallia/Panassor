const requiredEnvVariables = ["SQUARE_ACCESS_TOKEN", "SQUARE_LOCATION_ID"];

function readEnv(name, fallback = undefined) {
  const value = process.env[name];

  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();

  return trimmedValue || fallback;
}

export const env = {
  nodeEnv: readEnv("NODE_ENV", "development"),
  port: readEnv("PORT", "3001"),
  siteUrl: readEnv("SITE_URL", "http://localhost:5173"),

  square: {
    environment: readEnv("SQUARE_ENVIRONMENT", "sandbox"),
    accessToken: readEnv("SQUARE_ACCESS_TOKEN"),
    locationId: readEnv("SQUARE_LOCATION_ID"),
    webhookSignatureKey: readEnv("SQUARE_WEBHOOK_SIGNATURE_KEY"),
    webhookUrl: readEnv("SQUARE_WEBHOOK_URL"),
    skipWebhookSignature: readEnv("SQUARE_SKIP_WEBHOOK_SIGNATURE") === "true",
  },

  discord: {
    // Incoming webhook URL for the Discord channel that should receive
    // new-order notifications. Optional: if unset, notifications are
    // skipped (see services/discord.service.js).
    orderWebhookUrl: readEnv("DISCORD_ORDER_WEBHOOK_URL"),

    // Numeric role ID to ping on each new-order notification (e.g. the
    // "Conseil de Guilde" role) — NOT the role name. Optional: if unset,
    // the message posts without pinging anyone.
    orderRoleId: readEnv("DISCORD_ORDER_ROLE_ID"),
  },

  db: {
    // Local-only escape hatch: set DB_DISABLE_SSL=true in your local .env
    // to skip TLS entirely when troubleshooting a local connection issue.
    // Never set this in a deployed environment (Vercel/AWS) — leaving it
    // unset there keeps SSL required as before.
    disableSsl: readEnv("DB_DISABLE_SSL") === "true",
  },
};

export function validateEnv() {
  const missingVariables = requiredEnvVariables.filter(
    (variableName) => !readEnv(variableName)
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
}