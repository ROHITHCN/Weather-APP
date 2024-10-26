import React, { useState } from "react";
import { Button, Input as Matinput} from "@material-tailwind/react";

const Input = ({  units, setQuery, setUnits, addWeatherDataToDb, fetchWeatherDataFromDb }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city !== "") {
      setQuery({ q: city });
      setCity("");
    }
  };

  return (
    <div className="flex flex-col items-center my-6">
      <div className="flex items-center w-full max-w-md space-x-2">
        <Matinput
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          type="text"
          label="City"
          placeholder="Search by city..."
          color="blue"
        />
          <Button onClick={handleSearch} className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd"></path>
          </svg>
           </Button>
      </div>
      <div className="flex space-x-2 py-3">
      <Button
        onClick={() => setUnits(units === "metric" ? "imperial" : "metric")}
        style={{ flex: 1, minWidth: "2.5rem", padding: "0.5rem" }}
      >
        {units === "metric" ? "°F" :"°C" }
      </Button>
        <Button
          onClick={addWeatherDataToDb}
          style={{ flex: 1, padding: "0.5rem" }}
        >
          ADD SUMMARY
        </Button>
        <Button
          onClick={fetchWeatherDataFromDb}
          style={{ flex: 1, padding: "0.5rem" }}
        >
          FETCH SUMMARY
        </Button>
      </div>
    </div>
  );
};

export default Input;
