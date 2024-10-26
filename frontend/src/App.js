import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Input from "./components/Input";
import WeatherForecast from "./components/WeatherForecast";
import AlertModal from "./components/AlertModal";
import config from "./config";
import CityBar from "./components/CityBar";
import TempDetails from "./components/TempDetails";
import TempChart from "./components/TempChart";
import WeatherPopup from "./components/WeatherPopup";
import { Card } from "@material-tailwind/react";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecastDatas, setForecastDatas] = useState([]);
  const [query, setQuery] = useState({ q: "Delhi" });
  const [units, setUnits] = useState("metric");
  const [avgTemps, setAvgTemps] = useState([]);
  const [weatherDataList, setWeatherDataList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location";
    toast.info(cityName.charAt(0).toUpperCase() + cityName.slice(1));

    try {
      const response = await fetch(
        `${
          config.BACKEND_BASE_URL
        }?city=${cityName}&unit=${units}`
      );
      if (!response.ok) {
        throw new Error("Network response bad");
      }
      const data = await response.json();
      const { lat, lon } = data;

      try {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${
            config.OPENWEATHERMAP_KEY
          }`
        );
        const forecastData = await forecastResponse.json();

        const dailyTemps = {};

        forecastData.list.forEach((item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          dailyTemps[date] = (dailyTemps[date] || []).concat(item.main.temp);
        });

        const avgTempsData = Object.keys(dailyTemps).map((date) => ({
          date,
          avgTemp:
            dailyTemps[date].reduce((acc, temp) => acc + temp, 0) /
            dailyTemps[date].length,
        }));

        setAvgTemps(avgTempsData);

        const totalTemp = forecastData.list.reduce(
          (acc, item) => acc + convertTemp(item.main.temp, units),
          0
        );
        const avgTemp = totalTemp / forecastData.list.length;

        const totalHumidity = forecastData.list.reduce(
          (acc, item) => acc + item.main.humidity,
          0
        );
        const avgHumidity = totalHumidity / forecastData.list.length;

        const totalWindSpeed = forecastData.list.reduce(
          (acc, item) => acc + item.wind.speed,
          0
        );
        const avgWindSpeed = totalWindSpeed / forecastData.list.length;

        const weatherConditions = forecastData.list.map(
          (item) => item.weather[0].main
        );
        const conditionCounts = {};

        weatherConditions.forEach((condition) => {
          conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        });

        const dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
          conditionCounts[a] > conditionCounts[b] ? a : b
        );

        const formattedLocalTime = new Date(data.dt * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setWeather({
          ...data,

          avgTemp,
          formattedLocalTime,
          avgHumidity,
          avgWindSpeed,
          dominantCondition,
        });
        setForecastDatas(
          forecastData.list.map((item) => ({
            ...item,
            main: {
              ...item.main,
              temp: convertTemp(item.main.temp, units),
            },
          }))
        );
      } catch (error) {
        toast.error(`Please re-load to fetch forecast data`);
      }
    } catch (error) {
      toast.error(`Please re-load to fetch weather data`);
    }
  };

  const convertTemp = (temp, units) => {
    if (units === "metric") {
      return temp - 273.15;
    } else if (units === "imperial") {
      return ((temp - 273.15) * 9) / 5 + 32;
    } else {
      return temp;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(getWeather, 300000); // 5 minutes
    return () => clearInterval(intervalId);
  }, [query, units]);

  const addWeatherData = async () => {
    if (!weather) {
      return;
    }

    const weatherData = {
      city: weather.name,
      country: weather.country,
      lat: weather.lat,
      lon: weather.lon,
      date: new Date().toISOString(),
      summary: {
        avg_temp: weather.avgTemp.toFixed(),
        max_temp: weather.temp_max,
        min_temp: weather.temp_min,
        avg_humidity: weather.avgHumidity.toFixed(),
        avg_wind_speed: weather.avgWindSpeed.toFixed(),
        dominant_condition: weather.dominantCondition,
        icon: `http://openweathermap.org/img/wn/${weather.icon}@2x.png`,
      },
    };

    try {
      const response = await fetch(
        `${config.BACKEND_BASE_URL}/append`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(weatherData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error || "Failed to store weather data");
      }

      const result = await response.json();
      toast.success("Weather data stored successfully!");
    } catch (error) {
      toast.error(`Limit exceeded: Delete a summary to add more.`);
    }
  };

  const deleteWeatherData = async (id) => {
    try {

      const response = await fetch(
        `${
          config.BACKEND_BASE_URL
        }/remove/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove weather data");
      }

      const result = await response.json();
      toast.success("Weather data removed successfully!");

      setWeatherDataList((prevData) =>
        prevData.filter((data) => data._id !== id)
      );
    } catch (error) {
      toast.error(`Error in deleting weather data`);
    }
  };

  const fetchWeatherDataFromDb = async () => {
    try {
      const response = await fetch(
        `${config.BACKEND_BASE_URL}/fetch`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
      }

      const data = await response.json();
      setWeatherDataList(data);
      setShowPopup(true);
    } catch (error) {
      toast.error(`Error in fetching saved weather data`);
    }
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);

  const handleAddWeatherData = () => {
    addWeatherData();
  };

  const handleDeleteWeatherData = (index) => {
    deleteWeatherData(index);
  };


  const handleAlertSubmit = (alertData) => {
    const threshold = parseFloat(alertData.threshold);
    if (isNaN(threshold)) {
      toast.error("Please enter a valid temperature threshold.");
      return;
    }

    const updatedAlertData = {
      ...alertData,
      threshold,
    };
    
    fetch(
      `${config.BACKEND_BASE_URL}/alert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAlertData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            const errorMessages = errorData.errors
              .map((err) => err.message)
              .join(", ");
            throw new Error(errorMessages);
          });
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Alert successfully applied!");
        toast.success("email notification sent");
      })
      .catch((error) => {
        let errorMessage = error.message || "Try again !!";
        if (errorMessage.includes("email")) {
          errorMessage = "Please enter a valid email.";
        } else if (errorMessage.includes("city")) {
          errorMessage = "Please enter a valid city.";
        } else if (errorMessage.includes("threshold")) {
          errorMessage = "Please enter a valid temperature threshold.";
        }
        toast.error(errorMessage);
      });
  };

  return (
  <div className="container mx-auto p-5 space-y-8 bg-gradient-to-r from-pink-100 to-pink-500">
    <CityBar setQuery={setQuery} query={query}/>
    <Input
      units={units}
      setQuery={setQuery}
      setUnits={setUnits}
      addWeatherDataToDb={handleAddWeatherData}
      fetchWeatherDataFromDb={fetchWeatherDataFromDb}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {weather && <>
        <div className="md:col-span-1"><Card className="bg-gradient-to-r from-Zinc-300 to-Zinc-400"
        ><TempDetails weather={weather} units={units} /></Card></div>
        <div className="md:col-span-1"><Card className="bg-gradient-to-r from-Zinc-300 to-Zinc-400">
          {avgTemps.length > 0 && (
                  <TempChart data={avgTemps} />
              )}</Card></div>
                  
                </>}
        </div>
        <AlertModal onSubmit={handleAlertSubmit} />
        <Card className="bg-gradient-to-r from-pink-900 to-pink-900"><WeatherForecast title={<span className="text-white">Weather Forecast</span>} data={forecastDatas} units={units}/></Card>
        <WeatherPopup 
              handleDeleteWeatherData={handleDeleteWeatherData}
              weatherDataList={weatherDataList}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
            />
         <ToastContainer 
        autoClose={1000} 
        hideProgressBar 
        theme="dark" 
        position="top-right"
      />
  </div>
  );
}

export default App;