import React from "react";
import { Chip } from "@material-tailwind/react";

const CityBar = ({ setQuery ,query}) => {
  const cities = [
    { id: 1, name: "Bangalore" },
    { id: 2, name: "Delhi" },
    { id: 3, name: "Mumbai" },
    { id: 4, name: "Chennai" },
    { id: 5, name: "Kolkata" },
    { id: 6, name: "Hyderabad" },
  ];
  const vari=false;
  console.log(query)

  return (
    <div className="flex justify-around items-center my-1">
      {cities.map((city) => (
        <div className="flex gap-1">
        <Chip key={city.id}
          onClick={() => setQuery({ q: city.name })} variant={query.q == city.name ?"filled":"outlined"} value={city.name} className="cursor-pointer text-sm font-medium hover:bg-blue-100 px-2"/>
        </div>
      ))}
    </div>
  );
};

export default CityBar;
