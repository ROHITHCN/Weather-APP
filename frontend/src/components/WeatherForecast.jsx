import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const WeatherForecast = ({ title, data, units}) => {
  if (!data || data.length === 0) {
    return <p>No forecast data available.</p>;
  }

  const forecastData = data.slice(0, 8);

  return (
    <div>
      <div className="flex items-center justify-center mt-6">
        <Typography variant="h5" className="font-medium uppercase">
          {title}
        </Typography>
      </div>
      <hr className="my-1" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
        {forecastData.map((d, index) => {
          // Extract and format the date from dt_txt
          const date = new Date(d.dt_txt);
          const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`; // e.g., "20 October 2014"

          return (
            <div key={index}>
              <Card className="flex flex-col justify-center items-center bg-gradient-to-r from-Zinc-300 to-Zinc-400 p-4">
                <CardBody>
                  <Typography className="font-medium text-md mb-1">
                    Date: {formattedDate}
                  </Typography>
                  <Typography className="font-light text-sm">
                    Time: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Display time */}
                  </Typography>
                  <img
                    src={`http://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
                    alt="weather-icon"
                    className="w-12 my-1"
                  />
                  <Typography className="font-medium text-lg">
                    Temparature: {`${d.main.temp.toFixed()}° ${units === "metric" ? "C" : "F"}`}
                  </Typography>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
