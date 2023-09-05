import { useState } from "react";
import Spinner from "../spinner/Spinner";
import TempGraph from "../tempGraph/TempGraph";
import "./Card.css";

const API_KEY = import.meta.env.VITE_APIKEY;

const Card = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Function to fetch weather data from the API
  const fetchWeather = async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("City not found or API request failed");
    }
    return response.json();
  };

  // Function to add a city to the list
  const addCity = async () => {
    setIsLoading(true);
    try {
      const weather = await fetchWeather(search);
      console.log(weather);
      if (weather.cod === 200) {
        setCities([...cities, weather]);
        setSearch("");
      } else {
        console.error("City not found");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a city from the list
  const deleteCity = (cityToDelete) => {
    setCities((prevCities) =>
      prevCities.filter((city) => city.name !== cityToDelete.name)
    );
  };

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCities = cities.slice(startIndex, endIndex);

  // Function to handle page navigation
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Function to toggle temperature unit
  const toggleTemperatureUnit = () => {
    setTemperatureUnit(
      temperatureUnit === "celsius" ? "fahrenheit" : "celsius"
    );
  };

  // Function to convert temperature between Celsius and Fahrenheit
  const convertTemperature = (temp) => {
    if (temperatureUnit === "celsius") {
      return (temp - 273.15).toFixed(2) + "°C";
    } else {
      return ((temp - 273.15) * 1.8 + 32).toFixed(2) + "°F";
    }
  };

  return (
    <div className="Card">
      <div className="inner-Card">
        <div className="inner-Card-input">
          <input
            placeholder="Enter City Name"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={addCity}>Add City</button>
          <button onClick={toggleTemperatureUnit}>
            Toggle {temperatureUnit === "celsius" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          // Display the weather data for the current page
          <div className="Card-details">
            {currentCities.map((city) => (
              <div className="inner-Card-details" key={city.name}>
                <h2>{city.name}</h2>
                <p>Feels like - {city.weather[0].description}</p>
                <p>Temp - {convertTemperature(city.main?.temp)}</p>
                <TempGraph city={city} />
                <p>Humidity - {city.main?.humidity}</p>
                <p>Wind Speed - {city.wind?.speed}</p>
                <button onClick={() => deleteCity(city)}>Delete</button>
              </div>
            ))}
            {/* Pagination buttons */}
            <div className="pagination">
              {cities.length > itemsPerPage && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
              )}
              {cities.length > itemsPerPage && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={endIndex >= cities.length}
                >
                  {">"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
