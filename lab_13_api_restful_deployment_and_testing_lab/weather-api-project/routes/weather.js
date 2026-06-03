const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /api/weather/:city
router.get("/:city", async (req, res) => {
  const { city } = req.params;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OPENWEATHER_API_KEY is missing in .env" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: apiKey,
          units: "metric", // Celsius
        },
      }
    );

    const data = response.data;

    // Return clean structured JSON
    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: `${data.main.temp} °C`,
      feels_like: `${data.main.feels_like} °C`,
      condition: data.weather[0].description,
      humidity: `${data.main.humidity}%`,
      wind_speed: `${data.wind.speed} m/s`,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "City not found. Please enter a valid city name." });
    } else {
      res.status(500).json({ error: "API failure. Please try again later." });
    }
  }
});

module.exports = router;