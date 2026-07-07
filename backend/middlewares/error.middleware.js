export function errorMiddleware(error, req, res, next) {
  console.error("Unhandled API error:", error);

  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    errors: error.errors || [],
  });
}