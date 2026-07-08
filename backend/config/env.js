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