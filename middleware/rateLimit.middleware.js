const rateLimit = require("express-rate-limit");
const ApiResponse = require("../utils/ApiResponse");

const limiter = (time, maxRequest) => {
  const timeinMs = (time) => {
    if (time.endsWith("s")) {
      return time.replace("s", "") * 1000;
    } else if (time.endsWith("m")) {
      return time.replace("m", "") * 60 * 1000;
    } else if (time.endsWith("h")) {
      return time.replace("h", "") * 60 * 60 * 1000;
    } else if (time.endsWith("d")) {
      return time.replace("d", "") * 24 * 60 * 60 * 1000;
    } else {
      return null;
    }
  };

  if (!timeinMs(time)) {
    throw new Error("Invalid time format");
  }

  if (typeof maxRequest !== "number") {
    throw new Error("maxRequest must be a number");
  }

  return rateLimit({
    windowMs: timeinMs(time), // Convert time to milliseconds
    max: maxRequest, // Maximum requests per window
    standardHeaders: true, // Include rate limit info in standard headers
    legacyHeaders: false, // Disable legacy headers
    keyGenerator: (req) => req.ip, // Use the request IP as the unique key
    handler: (req, res) => {
      const userIp = req.ip;
      ApiResponse.tooManyRequests(
        res,
        `Too many requests from IP: ${userIp}. Please try again later.`
      );
    },
  });
};

module.exports = limiter;
