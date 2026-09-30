import {
  fetchAllProducts,
  fetchCustomizableProducts,
  fetchProductWithDetailsBySlug,
} from "../services/catalog.service.js";

export async function getCustomizableProducts(req, res) {
  try {
    const products = await fetchCustomizableProducts();

    res.json(products);
  } catch (error) {
    console.error("Failed to fetch customizable products:", error);

    res.status(500).json({
      message: "Failed to fetch customizable products",
    });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await fetchAllProducts();

    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;

    const product = await fetchProductWithDetailsBySlug(slug);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
  ...product,
  __api_version: "color-variants-v2",
});
  } catch (error) {
    console.error("Failed to fetch product:", error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}