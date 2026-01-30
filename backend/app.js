require("dotenv").config(); // THIS MUST BE LINE 1
const express = require("express");
const app = express();
const mockUser = require("./middleware/mockUser");
const healthRoutes = require("./routes/health.routes.js");
const shipmentRoutes = require("./routes/shipments.routes");
// Initialize express app
// This tells the app: "If someone goes to/health, use the logic in healthRoutes"
//Built-in Middleware: express.json()
//this allows the app to "read" json data sent in a request body
app.use(express.json());

app.use(mockUser);

//2.Custom logging middleware
//This runs for every request and logs the method (GET,POST,etc)and the path
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} request to: ${req.url}`);
  next(); // Critical: without this the request will hang forever
});

app.use("/health", healthRoutes);

//Mount the domain route
app.use("/shipments", shipmentRoutes);

// 404 catch-all
app.use((req, res, next) => {
  res.status(404).json({ error: "Route Not Found" });
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live at http://localhost:${PORT}`);
  console.log(`📡 Press Ctrl+C to stop the server`);
});

module.exports = app;
