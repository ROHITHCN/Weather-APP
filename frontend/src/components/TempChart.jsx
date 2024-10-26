import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const TempChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Daily Average Temperature (°C)",
        data: data.map((entry) => entry.avgTemp),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  return (
    <div>
      <h2 className="text-lg font-semibold flex justify-center">Daily Average Temperature</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TempChart;