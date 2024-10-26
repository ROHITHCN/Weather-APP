import React from "react";
import { Typography } from "@material-tailwind/react";
const CityCard = ({ weather: { formattedLocalTime, name, country } }) => {
  return (
    <div className="my-6">
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
  );
};

export default CityCard;
