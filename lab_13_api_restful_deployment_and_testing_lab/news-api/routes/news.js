const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /api/news/:country
// Example: /api/news/us  or  /api/news/pk
router.get("/:country", async (req, res) => {
  const { country } = req.params;
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "NEWS_API_KEY is missing in .env",
    });
  }

  // Validate country code length (must be 2 letters)
  if (!country || country.length !== 2) {
    return res.status(400).json({
      error: "Invalid country code. Use a 2-letter code like 'us', 'pk', 'gb'.",
    });
  }

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines`,
      {
        params: {
          country: country.toLowerCase(),
          apiKey: apiKey,
          pageSize: 10, // Limit to 10 articles
        },
      }
    );

    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      return res.status(404).json({
        error: `No headlines found for country code: ${country}`,
      });
    }

    // Format the response — pick only needed fields
    const headlines = articles.map((article) => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
      published_at: article.publishedAt,
    }));

    res.json({
      country: country.toUpperCase(),
      total_results: headlines.length,
      headlines: headlines,
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data.message || "News API error.",
      });
    } else {
      res.status(500).json({ error: "Server error. Please try again." });
    }
  }
});

module.exports = router;