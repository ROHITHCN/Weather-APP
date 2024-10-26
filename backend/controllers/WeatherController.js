const nodemailer = require("nodemailer");
const axios = require("axios");
const Weather = require("../models/Weather");
const Alert = require("../models/Alert");
const { DateTime } = require("luxon");
require("dotenv").config();

const fetchData = async (city, unit) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${process.env.OPENWEATHERMAP_KEY}`
  );
  return response.data;
};

const fetchForecastData = async (city, unit) => {
  const weatherData = await fetchData(city, unit);

  const {
    coord: { lat, lon },
  } = weatherData;

  const forecastDataResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_KEY}`
  );

  return forecastDataResponse.data;
};

let alertTime = {};

const checkAlerts = async () => {
  try {
    const alerts = await Alert.find();
    if (!Array.isArray(alerts)) {
      return;
    }

    for (let warning of alerts) {
      const { city, threshold, email, _id } = warning;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_KEY}`
        );
        const weatherData = await response.json();

        const {
          main: { temp: currentTemp },
          name: cityName,
        } = weatherData;

        const now = Date.now();
        const alertKey = `${city}-${threshold}`;
        const lastSentTime = alertTime[alertKey];

        if (!lastSentTime || now - lastSentTime > 3600000) {
          if (currentTemp > threshold) {
            const message = `
              <div style="background-color:#f5f5f5; color:#333; padding:20px; border:2px solid #3498db; border-radius:15px; font-family:'Helvetica Neue', sans-serif; text-align:left;">
                <h1 style="font-size:26px; color:#e74c3c; text-align:center;">🌧️ Urgent Weather Alert in ${cityName}! 🌧️</h1>
                
                <p style="font-size:16px; margin-top:10px; text-align:center;">The weather in <strong>${cityName}</strong> has hit critical levels! Please be advised.</p>

                <div style="margin:20px 0; text-align:center;">
                  <p style="font-size:20px; color:#2980b9;"><strong>Current Temperature:</strong> ${currentTemp}°C</p>
                  <p style="font-size:20px; color:#e74c3c;"><strong>Threshold Temperature:</strong> ${threshold}°C</p>
                </div>

                <p style="font-size:16px; margin-top:20px;">We recommend staying indoors and taking precautions for your safety.</p>

                <p style="font-size:16px; color:#8e44ad; margin-top:20px;">Alert has been deleted to avoid spam. You can set a new alert.⚠️</p>

                <h3 style="text-align:center; margin-top:30px; color:#3498db;">Stay Alert, Stay Safe!</h3>
                
                <p style="font-size:14px; text-align:center; color:#333;">Issued by:</p>
                <p style="font-size:14px; color:#333; text-align:center; margin-bottom:0;">
                  <a href="mailto:cnrohithkumar@gmail.com" style="color:#e74c3c;">Powered by Zeo</a>
                </p>

                <div style="text-align:center; margin-top:15px;">
                  <a href="https://github.com/ROHITHCN" target="_blank" style="display:inline-block; color:#3498db; text-decoration:none;">Visit My GitHub</a>
                </div>
              </div>
            `;


            await sendEmailAlert(
              email,
              `Weather Alert for ${cityName}`,
              "Weather Alert",
              message
            );
            alertTime[alertKey] = now;

            await Alert.deleteOne({ _id });
          }
        }
      } catch (error) {
      }
    }
  } catch (error) {
  }
};

setInterval(checkAlerts, 30000);

const sendEmailAlert = async (to, subject, text, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAILTRAP_USER,
    to,
    subject,
    text,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
  }
};

const localTimeData = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) =>
  DateTime.fromSeconds(secs, { zone: "utc" })
    .plus({ seconds: offset })
    .toFormat(format);

const iconUrl = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

const currentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_max, temp_min, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0] || {};
  const localTime = localTimeData(dt, timezone);

  return {
    temp,
    feels_like,
    temp_max,
    temp_min,
    humidity,
    name,
    country,
    sunrise: localTimeData(sunrise, timezone, "hh:mm a"),
    sunset: localTimeData(sunset, timezone, "hh:mm a"),
    details,
    icon: iconUrl(icon),
    speed,
    localTime,
    dt,
    timezone,
    lat,
    lon,
  };
};

const forecastWeather = (secs, offset, data) => {
  const hourlyData = data
    .filter((f) => f.dt > secs)
    .slice(0, 5)
    .map((f) => ({
      temp: f.main.temp,
      title: localTimeData(f.dt, offset, "hh:mm a"),
      icon: iconUrl(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourlyData };
};

const getForecastData = async (city, unit) => {
  const weatherData = await fetchData(city, unit);

  const forecastData = await fetchForecastData(city, unit);

  const formattedForecastData = forecastWeather(
    weatherData.dt,
    (timezone = 0),
    forecastData.list
  );

  return { ...currentWeather(weatherData), ...formattedForecastData };
};

const simulateWeatherData = async (city, unit) => {
  try {
    const data = await fetchData(city, unit);
    return currentWeather(data);
  } catch (error) {
  }
};

const saveWeatherData = async (city, unit) => {
  try {
    const data = await fetchData(city, unit);
    const formattedWeather = currentWeather(data);

    const { lat, lon, dt, name: cityName, country, weather } = formattedWeather;

    const forecastData = await fetchForecastData(lat, lon, unit);

    const totalTemp = forecastData.list.reduce(
      (accs, items) => accs + items.main.temp,
      0
    );
    const avgTemp = totalTemp / forecastData.list.length;

    const weatherSummaryData = {
      city: cityName,
      country: country,
      lat: lat,
      lon: lon,
      date: new Date(dt * 1000).toISOString().split("T")[0],
      summary: {
        avg_temp: avgTemp,
        max_temp: Math.max(...forecastData.list.map((items) => items.main.temp)),
        min_temp: Math.min(...forecastData.list.map((items) => items.main.temp)),
        avg_humidity:
          forecastData.list.reduce((accs, items) => accs + items.main.humidity, 0) /
          forecastData.list.length,
        dominant_condition: weather[0].main,
        icon: iconUrl(weather[0].icon),
      },
    };

    await Weather.create(weatherSummaryData);
  } catch (error) {
  }
};

module.exports = {
  simulateWeatherData,
  getForecastData,
  saveWeatherData,
};