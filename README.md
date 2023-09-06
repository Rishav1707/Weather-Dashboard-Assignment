# Weather Dashboard: Time-bound Challenge

## Background

You are tasked with creating a weather dashboard using HTML, CSS, and ReactJS. The dashboard will display current weather information for multiple cities using a weather API.

![weather-dashboard](https://github.com/Rishav1707/Weather-Dashboard-Assignment/assets/97666287/6cfd9c33-c804-4eb7-9f97-6eee57a68cc1)

## Basic Requirements

1. Users should be able to search for a city's weather by entering a city name.
2. Display the current weather information for multiple cities in cards.
3. Users should be able to delete a city's weather card.

## Advanced Requirements

1. Toggle between Celsius and Fahrenheit for temperature display.
2. Implement pagination to display only 3 cities per page.
3. Display a basic line graph showing temperature trends for the past 24 hours for a selected city.
4. Implement a responsive design that adapts to mobile and tablet views.

## How I Fixed the Bugs

1. The city search and addition are not functioning properly.
   - The problem here is that the `fetchWeather` function is asynchronous, and not wait for the `response` before adding the city to the cities state. We should await the fetchWeather function and handle the result properly.
   - Here's the updated code for `addcity` function
     ```bash
     const addCity = async () => {
        try {
          const weather = await fetchWeather(search);
          if (weather.cod === 200) {
            setCities([...cities, weather]);
            setSearch('');
          } else {
            console.error('City not found');
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };
     ```
   
2. The temperature is not being displayed.
   - We need to access the temperature property correctly in the city weather data. We should use `city.main?.temp` instead of `city.main.temp` to handle potential undefined values.
   - Here's the updated temperature display
     ```bash
     <p>Temperature: {city.main?.temp}</p>
     ```
     
3. The delete functionality is not working.
   - The `deleteCity` function is not correctly filtering the cities. We need to compare the city names to remove the correct city. Also, we should use the `setCities` function with the filtered array to update the state.
   - Here's the updated `deletecity` function
     ```bash
     const deleteCity = (cityToDelete) => {
        setCities((prevCities) => prevCities.filter((city) => city.name !== cityToDelete.name));
      };
     ```

## How I Implemented the Advanced Features

1. Toggle between Celsius and Fahrenheit for temperature display.
   - Added state to the `Card` component to keep track of the temperature unit (Celsius or Fahrenheit).
   - Created a `function` to convert between Celsius and Fahrenheit.
   - Updated the rendering logic to `display` temperatures based on the selected unit.
   - Added a `toggle` button to switch between units.
   - Here's an updated version of the Card component with the temperature unit toggle:
     ```bash
      import { useState } from "react";
      import Spinner from "../spinner/Spinner";
      import "./Card.css";
      
      const Card = () => {
        const [cities, setCities] = useState([]);
        const [search, setSearch] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [temperatureUnit, setTemperatureUnit] = useState("celsius"); // Default to Celsius
      
        const fetchWeather = async (city) => {
          // ... (same as before)
        };
      
        const addCity = async () => {
          setIsLoading(true);
          try {
            const weather = await fetchWeather(search);
            // ... (same as before)
          } catch (error) {
            console.error("Error fetching weather data:", error);
          } finally {
            setIsLoading(false);
          }
        };
      
        const deleteCity = (cityToDelete) => {
          setCities((prevCities) =>
            prevCities.filter((city) => city.name !== cityToDelete.name)
          );
        };
      
        // Function to toggle temperature unit
        const toggleTemperatureUnit = () => {
          setTemperatureUnit(temperatureUnit === "celsius" ? "fahrenheit" : "celsius");
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
                {/* ... (same as before) */}
                <button onClick={toggleTemperatureUnit}>
                  Toggle {temperatureUnit === "celsius" ? "Fahrenheit" : "Celsius"}
                </button>
              </div>
              {isLoading ? (
                <Spinner />
              ) : (
                <div className="Card-details">
                  {cities.map((city) => (
                    <div className="inner-Card-details" key={city.name}>
                      <h2>{city.name}</h2>
                      <p>Feels like - {city.weather[0].description}</p>
                      <p>Temp - {convertTemperature(city.main?.temp)}</p>
                      <p>Humidity - {city.main?.humidity}</p>
                      <p>Wind Speed - {city.wind?.speed}</p>
                      <button onClick={() => deleteCity(city)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      };
      
      export default Card;
     ```

2. Implement pagination to display only 3 cities per page.
   - Updated the `state` to keep track of the current page.
   - Created a `function` to slice the cities array based on the current page and items per page.
   - Added buttons to `navigate` to the next and previous pages.
   - Updated the rendering logic to display the sliced cities array.
   - Here's an updated `Card` component with pagination:
     ```bash
      import { useState } from "react";
      import Spinner from "../spinner/Spinner";
      import "./Card.css";
      
      const Card = () => {
        const [cities, setCities] = useState([]);
        const [search, setSearch] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 3;
      
        const fetchWeather = async (city) => {
          // ... (same as before)
        };
      
        const addCity = async () => {
          setIsLoading(true);
          try {
            const weather = await fetchWeather(search);
            // ... (same as before)
          } catch (error) {
            console.error("Error fetching weather data:", error);
          } finally {
            setIsLoading(false);
          }
        };
      
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
      
        return (
          <div className="Card">
            <div className="inner-Card">
              <div className="inner-Card-input">
                {/* ... (same as before) */}
              </div>
              {isLoading ? (
                <Spinner />
              ) : (
                <div className="Card-details">
                  {currentCities.map((city) => (
                    <div className="inner-Card-details" key={city.name}>
                      {/* ... (same as before) */}
                    </div>
                  ))}
                  {/* Pagination buttons */}
                  <div className="pagination">
                    {cities.length > itemsPerPage && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    )}
                    {cities.length > itemsPerPage && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={endIndex >= cities.length}
                      >
                        Next
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
     ```

3. Display a basic line graph showing temperature trends for the past 24 hours for a selected city.
   - Fetched historical weather data for the selected city, including temperature data for the past 24 hours.
   - Using a charting library like `Chart.js` to create a line graph.
   - Display the `temperature` data on the graph.

4. Implement a responsive design that adapts to mobile and tablet views.
   - Added media query for the small screen like mobile phones and tablets.

## Bonus

1. Added error handling for API calls.
2. Implemented a loading spinner while the weather information is being fetched.
