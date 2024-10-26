import React from "react";
import { BiSolidDropletHalf, BiArrowFromBottom } from "react-icons/bi";
import { FaThermometerEmpty } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { TbAlarmAverage } from "react-icons/tb";
import { Typography } from "@material-tailwind/react";


const TempDetails = ({
    weather: {
        formattedLocalTime, name, country,
        details,
        icon,
        temp,
        temp_min,
        temp_max,
        sunrise,
        sunset,
        speed,
        humidity,
        feels_like,
        avgTemp,
        avgHumidity,
        avgWindSpeed,
        dominantCondition,
      } = {}, // default value to handle undefined weather prop
      units,
    }) => {
      const verticalDetails = [
        { id: 1, Icon: FaThermometerEmpty, title: "Real Feel", value: feels_like ? `${feels_like.toFixed()}°` : "N/A" },
        { id: 2, Icon: BiSolidDropletHalf, title: "Humidity", value: humidity ? `${humidity.toFixed()}%` : "N/A" },
        { id: 3, Icon: FiWind, title: "Wind", value: speed ? `${speed.toFixed()} ${units === "metric" ? "Km/h" : "m/s"}` : "N/A" },
      ];
    
      const horizontalDetails = [
        { id: 1, Icon: GiSunrise, title: "Sunrise", value: sunrise || "N/A" },
        { id: 2, Icon: GiSunset, title: "Sunset", value: sunset || "N/A" },
        { id: 3, Icon: MdKeyboardArrowUp, title: "High", value: temp_max ? `${temp_max.toFixed()}°` : "N/A" },
        { id: 4, Icon: MdKeyboardArrowDown, title: "Low", value: temp_min ? `${temp_min.toFixed()}°` : "N/A" },
        { id: 5, Icon: TbAlarmAverage, title: "Avg Temp", value: avgTemp ? `${avgTemp.toFixed()}°` : "N/A" },
        { id: 6, Icon: BiSolidDropletHalf, title: "Avg Humidity", value: avgHumidity ? `${avgHumidity.toFixed()}%` : "N/A" },
        { id: 7, Icon: FiWind, title: "Avg Wind Speed", value: avgWindSpeed ? `${avgWindSpeed.toFixed()} ${units === "metric" ? "Km/h" : "m/s"}` : "N/A" },
        { id: 8, Icon: BiArrowFromBottom, title: "Dominant Condition", value: dominantCondition || "N/A" },
      ];
    
      return (
        <div className="text-gray-700">

          
    
          <div className="flex flex-row justify-between items-center py-3">
            <div className="flex flex-col">
              <div className="flex items-center justify-center mb-4">
                <Typography variant="h6" color="blue-gray">
                  Time: {formattedLocalTime}
                </Typography>
              </div>

              <div className="flex items-center justify-center">
                <Typography variant="h4" color="blue-gray" className="font-semibold">
                  {name}, {country}
                </Typography>
              </div>
            </div>
            <div className="flex flex-col">
            <div className="flex items-center justify-center py-6">
            <Typography variant="h6">Mood:{details || "N/A"}</Typography>
            </div>

            {icon && <img src={icon} alt="Weather icon" className="w-24 h-24" />}
            </div>
            <Typography variant="h2">
              {temp ? `${temp.toFixed()}° ${units === "metric" ? "C" : "F"}` : "N/A"}
            </Typography>
    
            <div className="flex flex-col space-y-3">
              {verticalDetails.map(({ id, Icon, title, value }) => (
                <div key={id} className="flex items-center text-gray-700">
                  <Icon size={18} className="mr-1" />
                  <Typography variant="small" className="font-light">
                    {title}:
                    <span className="font-medium ml-1">{value}</span>
                  </Typography>
                </div>
              ))}
            </div>
          </div>
    
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {horizontalDetails.map(({ id, Icon, title, value }) => (
              <div key={id} className="flex items-center p-2">
                <Icon size={24} className="mr-2" />
                <Typography variant="small" className="font-light">
                  {title}:
                  <span className="font-medium ml-1">{value}</span>
                </Typography>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
export default TempDetails;
