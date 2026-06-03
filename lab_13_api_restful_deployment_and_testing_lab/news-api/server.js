const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const newsRoutes = require("./routes/news");

const app = express();
app.use(express.json());

// Routes
app.use("/api/news", newsRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "News Headlines API is running!" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`News API server running on port ${PORT}`);
});