import dotenv from "dotenv";

// `import app from "./app.js"` (and everything app.js pulls in — routes,
// controllers, db/pool.js, config/env.js) used to sit above `dotenv.config()`.
// Static ES module imports are hoisted and evaluate BEFORE any of this
// file's own top-level code, no matter where the import line is written —
// so app.js's whole module tree, including anything reading process.env at
// import time, was always running before .env had been loaded. Values from
// .env were silently never seen by that code; only whatever was already in
// the OS/shell environment applied. Using a dynamic import() here forces
// dotenv.config() to actually run first.
dotenv.config();

const { env, validateEnv } = await import("./config/env.js");
const { default: app } = await import("./app.js");

validateEnv();

app.listen(env.port, () => {
  console.log(`Panassor backend running on http://localhost:${env.port}`);
});
