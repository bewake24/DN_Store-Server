class ApiResponse {
  static success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  }

  static redirect(res, url, statusCode = 302) {
    return res.redirect(statusCode, url);
  }

  static validationError(res, message, errors = {}, statusCode = 400) {
    return res.status(statusCode).json({
      status: "fail",
      message,
      errors,
    });
  }

  static unauthorized(res, message = "Unauthorized access") {
    return res.status(401).json({
      status: "fail",
      message,
    });
  }

  static forbidden(res, message = "Access forbidden") {
    return res.status(403).json({
      status: "fail",
      message,
    });
  }

  static notFound(res, message = "Resource not found") {
    return res.status(404).json({
      status: "fail",
      message,
    });
  }

  static conflict(res, message = "Resource already exists", statusCode = 409) {
    return res.status(statusCode).json({
      status: "fail",
      message,
    });
  }

  static tooManyRequests(res, message = "Too many requests", statusCode = 429) {
    return res.status(statusCode).json({
      status: "fail",
      message,
    });
  }

  static error(res, message, statusCode = 500, error = null) {
    return res.status(statusCode).json({
      status: "error",
      message,
      ...(error && { error: error.message || error }),
    });
  }
}

module.exports = ApiResponse;
