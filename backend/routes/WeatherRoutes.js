const express = require("express");
const { z } = require("zod");
const {
  simulateWeatherData,
  getForecastData,
} = require("../controllers/WeatherController");
const Weather = require("../models/Weather");
const Alert = require("../models/Alert");

const router = express.Router();

router.get("/", async (req, res) => {
  const { city, unit } = req.query;
  try {
    const weatherData = await simulateWeatherData(city, unit);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

router.get("/forecast", async (req, res) => {
  const { city, unit } = req.query;

  if (!city || !unit) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const forecast_Data = await getForecastData(city, unit);
    res.json(forecast_Data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

router.post("/append", async (req, res) => {
  const { city, country, lat, lon, date, summary } = req.body;

  if (
    !city || !country || !lat || !lon || !date || !summary || !summary.avg_temp || !summary.max_temp || !summary.min_temp || !summary.avg_humidity || !summary.avg_wind_speed || !summary.dominant_condition || !summary.icon
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const count = await Weather.countDocuments({});

    if (count >= 5) {
      return res
        .status(400)
        .json({ error: "Limit reached: 5 entries maximum" });
    }

    const weatherData = new Weather(req.body);
    await weatherData.save();
    res.status(201).json({ message: "Weather data successfully saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add data" });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.status(200).send(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/simulate", async (req, res) => {
  const { city, unit } = req.query;
  try {
    await simulateWeatherData(city, unit);
    res.status(200).json({ message: "simulation started." });
  } catch (error) {
    res.status(500).json({ error: "Failed to simulate data" });
  }
});

router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWeather = await Weather.findByIdAndDelete(id);

    if (!deletedWeather) {
      return res.status(404).json({ error: "data not found" });
    }

    res.status(200).json({ message: "data successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error in deleting data" });
  }
});

const alertSchema = z.object({
  email: z.string().email("Invalid email format").min(1).max(30),
  city: z.string().min(1).max(30),
  threshold: z.number().refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
    message: "Threshold must be between 1 and 100",
  }),
});

router.post("/alert", async (req, res) => {
  const { email, city, threshold } = req.body;

  const validation = alertSchema.safeParse({ email, city, threshold });
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.errors,
    });
  }

  try {
    const alert = new Alert({
      email,
      city,
      threshold: validation.data.threshold,
    });
    await alert.save();
    res.json({ message: "Alert set successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to set alert" });
  }
  
});

module.exports = router;