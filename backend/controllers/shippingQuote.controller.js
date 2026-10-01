import { getShippingQuote } from "../services/shippingQuote.service.js";

export async function postShippingQuote(req, res) {
  try {
    const { postalCode, city, country, items = [], carriers } = req.body;

    const quote = await getShippingQuote({ postalCode, city, country, items, carriers });

    res.json(quote);
  } catch (error) {
    console.error("Shipping quote failed:", error);

    res.status(error.status || 500).json({
      message: error.message || "QUOTE_FAILED",
    });
  }
}
