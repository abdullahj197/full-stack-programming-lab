const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const weatherRoutes = require("./routes/weather");

const app = express();
app.use(express.json());

// Routes
app.use("/api/weather", weatherRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Weather API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});