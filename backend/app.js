import express from "express";
import cors from "cors";
import pool from "./db/pool.js";

import collectionsRoutes from "./routes/collections.routes.js";
import productsRoutes from "./routes/products.routes.js";
import atelierRoutes from "./routes/atelier.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import shipmentsRoutes from "./routes/shipments.routes.js";
import squareWebhookRoutes from "./routes/squareWebhook.routes.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());

// IMPORTANT : Square webhook doit rester AVANT express.json()
// parce que la validation de signature utilise le raw body.
app.use(
  "/api/square/webhook",
  express.raw({ type: "application/json" }),
  squareWebhookRoutes
);

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");

    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.use("/api/collections", collectionsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/atelier", atelierRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/shipments", shipmentsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;