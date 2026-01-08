const express = require("express");
const app = express();
const healthRoutes = require("./routes/health.routes.js");

// This tells the app: "If someone goes to/health, use the logic in healthRoutes"
app.use("/health", healthRoutes);

module.exports = app;
