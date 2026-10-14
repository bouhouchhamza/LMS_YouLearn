function errorHandler(error, req, res, next) {
  const statusCode =
    error.code === "LIMIT_FILE_SIZE"
      ? 413
      : error.statusCode || error.status || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
}
// module.exports = errorHandler;
export default errorHandler;
