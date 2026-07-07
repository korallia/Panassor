import dotenv from "dotenv";
import app from "./app.js";
import { env, validateEnv } from "./config/env.js";

dotenv.config();

validateEnv();

app.listen(env.port, () => {
  console.log(`Panassor backend running on http://localhost:${env.port}`);
});