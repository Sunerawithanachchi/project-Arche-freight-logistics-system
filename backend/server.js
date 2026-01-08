const app = require("./app");
const PORT = 3000;

// Start the server (Opening the building)
app.listen(PORT, () => {
  console.log(
    "Arche freight logistics system Server is running at http://localhost:${PORT}"
  );
});
