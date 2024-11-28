require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvents.middleware");
// const errorHandler = require('./middleware/errorHandler')
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const restrictDirectoryAccess = require("./middleware/uploads.middleware");
const expressSession = require("./middleware/espressSession.middleware");
const csrfProtection = require("./middleware/csrf.middleware");
const limiter = require("./middleware/rateLimit.middleware");

const PORT = process.env.PORT || 3000;

const app = express();

//Connect to database
connectDB();

app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(helmet()); // Add security headers to HTTP responses

// Middleware to parse x-www-form-urlencoded data
app.use(express.urlencoded({ extended: true, limit: process.env.REQ_LIMIT }));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// Apply session middleware
app.use(expressSession);

// Apply CSRF middleware (after express session)
app.use(csrfProtection);

// Middleware to restrict access to the directory itself
app.use("/api/v1/uploads", restrictDirectoryAccess);

//serve static files
app.use("/api/v1", express.static(path.join(__dirname, "/public")));
app.use(
  "/api/v1/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

//routes
app.use("/api/v1", require("./routes/root"));
app.use("/api/v1/user", require("./routes/user.route"));
app.use("/api/v1/role", require("./routes/roles.route"));
app.use("/api/v1/address", require("./routes/address.route"));
app.use("/api/v1/category", require("./routes/category.route"));
app.use("/api/v1/tag", require("./routes/tag.route"));
app.use("/api/v1/attribute", require("./routes/attribute.route"));
app.use("/api/v1/product", require("./routes/product.route"));
app.use("/api/v1/variation", require("./routes/variation.route"));
app.use("/api/v1/cart", require("./routes/cart.route"));

app.all("*", limiter("15m", 100), (req, res) => {
  // res.redirect("/404.html")

  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

// app.use(errorHandler);

mongoose.connection.once("open", () => {
  app.on("error", (error) => {
    console.error("Error Connecting to server", error.message);
  });
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
