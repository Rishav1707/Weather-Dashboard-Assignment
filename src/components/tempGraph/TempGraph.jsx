/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const API_KEY = import.meta.env.VITE_APIKEY;

const TempGraph = ({ city }) => {
  const [temperatureData, setTemperatureData] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Fetch historical weather data for the past 24 hours
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${
            city.coord.lat
          }&lon=${city.coord.lon}&dt=${Math.floor(
            Date.now() / 1000 - 86400
          )}&appid=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Unable to fetch historical weather data");
        }
        const data = await response.json();
        const hourlyTemperatures = data.hourly.map(
          (hour) => hour.temp - 273.15
        ); // Convert to Celsius
        setTemperatureData(hourlyTemperatures);
      } catch (error) {
        console.error("Error fetching historical weather data:", error);
      }
    };

    fetchHistoricalData();
  }, [city]);

  useEffect(() => {
    // Clear the previous chart
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create and update the chart when temperature data changes
    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 24 }, (_, i) => i + "h ago"),
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatureData,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      // Cleanup: destroy the chart on component unmount
      newChart.destroy();
    };
  }, [temperatureData]);

  return <canvas ref={canvasRef} width="200" height="150"></canvas>;
};

export default TempGraph;
