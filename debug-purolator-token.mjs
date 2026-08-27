// Diagnostic: decode the Purolator JWT access token (without verifying
// the signature) to see what scopes/claims were actually granted to
// this app, so we know exactly what's missing for the Estimate API.
import "dotenv/config";
import { env } from "./backend/config/env.js";

async function main() {
  const basicAuth = Buffer.from(
    `${env.purolator.clientId}:${env.purolator.clientSecret}`
  ).toString("base64");

  const tokenRes = await fetch("https://shipapi.purolator.com/auth/v1/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify({ grant_type: "client_credentials", scope: "portal_api" }),
  });
  const tokenData = await tokenRes.json();
  console.log("TOKEN STATUS:", tokenRes.status);
  console.log("TOKEN RESPONSE:", JSON.stringify(tokenData, null, 2));

  const accessToken = tokenData.access_token;
  const parts = String(accessToken).split(".");

  if (parts.length === 3) {
    const decode = (b64url) => {
      const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
    };
    console.log("\nJWT HEADER:", JSON.stringify(decode(parts[0]), null, 2));
    console.log("\nJWT PAYLOAD:", JSON.stringify(decode(parts[1]), null, 2));
  } else {
    console.log("\n(Le token n'est pas un JWT lisible -- c'est un token opaque.)");
  }
}

main().catch((e) => console.error("SCRIPT ERROR:", e));
