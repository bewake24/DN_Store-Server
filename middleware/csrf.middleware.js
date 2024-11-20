const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: {
    httpOnly: true, // Prevent JavaScript access to the CSRF cookie
    secure: process.env.NODE_ENV === "production", // Only send the cookie over HTTPS in production
    sameSite: "Strict", // Prevent cookies from being sent in cross-site requests
  },
});

module.exports = csrfProtection;
