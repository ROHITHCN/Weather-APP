import React from "react";
import { Dialog } from "@material-tailwind/react";

const WeatherPopup = ({
  weatherDataList,
  showPopup,
  setShowPopup,
  handleDeleteWeatherData,
}) => {
  if (!showPopup) return null;

  return (
    <Dialog
      open={showPopup}
      handler={setShowPopup}
      size="lg"
      className="bg-white p-5 rounded-lg shadow-lg"
    >
      <button
        className="absolute top-4 right-4 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
        onClick={() => setShowPopup(false)}
      >
        Close
      </button>

      <h2 className="text-2xl mb-4">Saved Weather Data</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {weatherDataList.map((data, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-sm bg-gray-100"
          >
            <h3 className="font-bold mb-2">
              {data.city}, {data.country}
            </h3>
            <p>
              Avg Temperature: <b>{data.summary.avg_temp} °C</b>
            </p>
            <p>
              Avg Humidity: <b>{data.summary.avg_humidity}</b> %
            </p>
            <p>
              Avg Wind Speed: <b>{data.summary.avg_wind_speed}</b> m/s
            </p>
            <p>
              Avg Condition: <b>{data.summary.dominant_condition}</b>
            </p>
            <p>
              Date:{" "}
              {new Date(data.date).toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>

            <button
              onClick={() => handleDeleteWeatherData(data._id)}
              className="mt-2 px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700 focus:ring-4 focus:ring-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default WeatherPopup;
