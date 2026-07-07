const requiredEnvVariables = [
  "SQUARE_ACCESS_TOKEN",
  "SQUARE_LOCATION_ID",
];

export const env = {
  port: process.env.PORT || 3001,
  siteUrl: process.env.SITE_URL || "http://localhost:5173",

  square: {
    environment: process.env.SQUARE_ENVIRONMENT || "sandbox",
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    locationId: process.env.SQUARE_LOCATION_ID,
    webhookSignatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,
    webhookUrl: process.env.SQUARE_WEBHOOK_URL,
    skipWebhookSignature:
      process.env.SQUARE_SKIP_WEBHOOK_SIGNATURE === "true",
  },
};

export function validateEnv() {
  const missingVariables = requiredEnvVariables.filter(
    (variableName) => !process.env[variableName]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
}