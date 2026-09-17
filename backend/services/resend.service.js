import { env } from "../config/env.js";
import { fetchWithRetry } from "../utils/fetchWithRetry.js";

// Thin wrapper around Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email)
// for transactional email -- right now just the order tracking
// notification, see trackingEmail.service.js.
//
// If RESEND_API_KEY isn't set (local dev, or before Korallia finishes
// setting up the Resend account), sends are skipped with a console.error
// instead of throwing -- mirrors how DISCORD_ORDER_WEBHOOK_URL being
// unset just skips the Discord notification rather than breaking the
// order flow.

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail({ to, subject, html }) {
  if (!env.resend.apiKey) {
    console.error(
      "RESEND_API_KEY not set -- skipping email send instead of failing the caller.",
      { to, subject }
    );
    return null;
  }

  const response = await fetchWithRetry(
    RESEND_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resend.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.resend.fromEmail,
        to: [to],
        subject,
        html,
      }),
    },
    { timeoutMs: 10000, retries: 1 }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend send failed (${response.status}): ${body}`);
  }

  return response.json();
}
