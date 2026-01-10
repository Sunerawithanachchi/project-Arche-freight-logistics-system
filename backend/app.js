const express = require("express");
const app = express();
const healthRoutes = require("./routes/health.routes.js");
// Initialize express app
// This tells the app: "If someone goes to/health, use the logic in healthRoutes"
//Built-in Middleware: express.json()
//this allows the app to "read" json data sent in a request body
app.use(express.json());

//2.Custom logging middleware
//This runs for every request and logs the method (GET,POST,etc)and the path
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} request to: ${req.url}`);
  next(); // Critical: without this the request will hang forever
});

app.use("/health", healthRoutes);

module.exports = app;
