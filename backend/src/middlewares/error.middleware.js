module.exports = (err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || 500;
  const message =
    status >= 500 ? "Internal server error" : err.message || "Request failed";
  res.status(status).json({
    success: false,
    error: message,
    details: status >= 500 ? null : err.details || null,
  });
};
