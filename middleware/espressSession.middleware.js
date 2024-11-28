const session = require("express-session");

const expressSession = session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false, // Do not save the session if it hasn't been modified
  saveUninitialized: true, // Save uninitialized sessions for login tracking
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60, // Time after which cookie expires and refreshes
    sameSite: "Strict", // Prevent cookies from being sent in cross-site requests
    // rolling: true, // Reset the session maxAge on every request
  },
});

module.exports = expressSession;
