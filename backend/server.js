require("dotenv").config();
const app = require("./app");

// Start the server (Opening the building)
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(
    `Arche freight logistics system Server is running in ${ENV} mode on PORT:${PORT}`
  );
});
