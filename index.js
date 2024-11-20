require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents.middleware");
// const errorHandler = require('./middleware/errorHandler')
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
// const session = require("express-session");
// const csrf = require("lusca").csrf;
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn");
const restrictDirectoryAccess = require("./middleware/uploads.middleware");
const PORT = process.env.PORT || 3000;

const app = express();

//Connect to database
connectDB();

app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Middleware to parse x-www-form-urlencoded data
app.use(express.urlencoded({ extended: true, limit: process.env.REQ_LIMIT }));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// Middleware to restrict access to the directory itself
app.use("/api/v1/uploads", restrictDirectoryAccess);

//serve static files
app.use("/api/v1", express.static(path.join(__dirname, "/public")));
app.use(
  "/api/v1/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

//routes
app.use("/api/v1", require("./routes/root"));
app.use("/api/v1/user", require("./routes/user.route"));
app.use("/api/v1/role", require("./routes/roles.route"));
app.use("/api/v1/address", require("./routes/address.route"));
app.use("/api/v1/category", require("./routes/category.route"));
app.use("/api/v1/tag", require("./routes/tag.route"));
app.use("/api/v1/attribute", require("./routes/attribute.route"));
app.use("/api/v1/product", require("./routes/product.routes"));
app.use("/api/v1/variation", require("./routes/variation.route"));
app.use("/api/v1/cart", require("./routes/cart.route"));

app.all("*", (req, res) => {
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
