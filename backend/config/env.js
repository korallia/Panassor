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

  canadaPost: {
    // OAuth2 client_credentials app credentials from the Canada Post
    // Developer Portal (an "app" of type Test or Production). The API
    // Secret is only ever shown once at creation time in the portal.
    apiKey: readEnv("CANADA_POST_API_KEY"),
    apiSecret: readEnv("CANADA_POST_API_SECRET"),

    // Business/Solutions-for-Small-Business customer number — needed to
    // get commercial rates instead of consumer "counter" rates.
    customerNumber: readEnv("CANADA_POST_CUSTOMER_NUMBER"),

    // Only needed for a negotiated commercial contract. Leave unset to
    // rate as a Solutions for Small Business member instead.
    contractNumber: readEnv("CANADA_POST_CONTRACT_NUMBER"),

    // "test" uses the Test app's credentials — same gateway URL as
    // production, but Canada Post returns static/stubbed rates and never
    // bills. Switch to "production" (with a Production app's keys) once
    // real numbers are needed, e.g. before going live.
    environment: readEnv("CANADA_POST_ENVIRONMENT", "test"),
  },

  // Adresse d'origine des envois — le centre/comptoir de dépôt (pas de
  // ramassage à domicile). Utilisée comme origine pour les appels de
  // tarification Postes Canada + Purolator, et plus tard comme adresse
  // "expéditeur" sur les étiquettes.
  shippingOrigin: {
    name: readEnv("SHIPPING_ORIGIN_NAME", "Panassor"),
    street: readEnv("SHIPPING_ORIGIN_STREET", "337 59e Avenue"),
    city: readEnv("SHIPPING_ORIGIN_CITY", "Pointe-Calumet"),
    province: readEnv("SHIPPING_ORIGIN_PROVINCE", "QC"),
    postalCode: readEnv("SHIPPING_ORIGIN_POSTAL_CODE", "J0N1G0"),
    country: readEnv("SHIPPING_ORIGIN_COUNTRY", "CA"),
    phone: readEnv("SHIPPING_ORIGIN_PHONE"),
  },

  // Purolator REST API (E-Ship / API Portal) - "Business Integration" app.
  // Auth is HTTP Basic (clientId:clientSecret) -> Bearer token; the apiKey
  // below is a separate "x-api-key" header required on every call.
  purolator: {
    clientId: readEnv("PUROLATOR_CLIENT_ID"),
    clientSecret: readEnv("PUROLATOR_CLIENT_SECRET"),
    apiKey: readEnv("PUROLATOR_API_KEY"),

    // Test-mode-only account numbers from the Purolator dev app. In test
    // mode, billingAccountNumber must be the test sender account, not a
    // real Purolator account number.
    testSenderAccount: readEnv("PUROLATOR_TEST_SENDER_ACCOUNT"),
    testReceiverAccount: readEnv("PUROLATOR_TEST_RECEIVER_ACCOUNT"),

    // Real Purolator courier account number, once Panassor has one and
    // moves to production credentials.
    accountNumber: readEnv("PUROLATOR_ACCOUNT_NUMBER"),

    environment: readEnv("PUROLATOR_ENVIRONMENT", "test"),
  },

  resend: {
    // Transactional email (order tracking notifications) via Resend
    // (https://resend.com). Create an API key in their dashboard and
    // verify the panassor.ca domain there first (a few DNS records) so
    // emails can be sent AS support@panassor.ca instead of Resend's
    // shared onboarding domain.
    apiKey: readEnv("RESEND_API_KEY"),

    // Full "Display Name <email>" form, e.g. "Panassor <support@panassor.ca>".
    fromEmail: readEnv("RESEND_FROM_EMAIL", "Panassor <support@panassor.ca>"),
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