import "dotenv/config";
import app from "./app.js";
import { env, validateEnv } from "./config/env.js";
import { startTrackingPoller } from "./jobs/trackingPoller.js";

validateEnv();

app.listen(env.port, () => {
  console.log(`Panassor backend running on http://localhost:${env.port}`);

  // Periodically checks "shipped" shipments against the carrier's
  // tracking API and marks them delivered automatically (see
  // jobs/trackingPoller.js). Runs in-process -- fine since this is a
  // persistent server (app.listen), not a serverless/sleeping instance.
  startTrackingPoller();
});