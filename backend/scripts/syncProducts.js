// scripts/syncProducts.js
import "dotenv/config";
import { syncAllProductsToSquare } from "../services/square.catalog.service.js";

const results = await syncAllProductsToSquare();
console.log(JSON.stringify(results, null, 2));
process.exit(0);
