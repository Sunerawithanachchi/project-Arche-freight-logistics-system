const express = require("express");
const app = express();
const PORT = 3000;

// The "health check" route.(the directory entry)
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start the server (Opening the building)
app.listen(PORT, () => {
  console.log(
    "Arche freight logistics system Server is running at http://localhost:${PORT}"
  );
});
