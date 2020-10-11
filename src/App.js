import React, { useState, useEffect } from "react";

import { fetchWeather } from "./api/fetchWeather";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  const search = async (e) => {
    if (e.key === "Enter") {
      const data = await fetchWeather(query);

      setWeather(data);
      setQuery("");
    }
  };

  const backgroundImage = (weatherData) => {
    let weatherImageUrl = "https://wallpaperaccess.com/full/568191.png";
    if (weatherData.weather) {
      const weatherId = weatherData.weather[0].id;
      if (weatherId <= 804 && weatherId >= 800) {
        weatherImageUrl =
          "https://cdn.dribbble.com/users/13449/screenshots/10094240/media/bbac9c3ddc0d46017085b7c7cafa5f6b.png";
      } else if (weatherId <= 781 && weatherId >= 701) {
        weatherImageUrl =
          "https://cdn.dribbble.com/users/1786276/screenshots/6675059/14-1200.jpg";
      } else if (weatherId <= 321 && weatherId >= 300) {
        weatherImageUrl =
          "https://cdn.dribbble.com/users/3178178/screenshots/9776963/media/a0663d51aad1c1528fe3a57e85bf3ed0.jpg";
      } else if (weatherId <= 531 && weatherId >= 500) {
        weatherImageUrl =
          "https://cdn.dribbble.com/users/3178178/screenshots/11294232/media/d728d213fcded0f54ebdb73b540def36.jpg";
      } else {
        weatherImageUrl =
          "https://cdn.dribbble.com/users/518045/screenshots/11604863/media/c6e2755cd5a30fecda85c2171b34b342.png";
      }
    }
    return {
      backgroundImage: `url(${weatherImageUrl})`,
    };
  };

  useEffect(() => {
    async function firstFetchWeather() {
      const response = await fetchWeather();
      setWeather(response.data);
    }
    firstFetchWeather();
  }, []);

  return (
    <div className="main-container" style={backgroundImage(weather)}>
      <input
        type="text"
        className="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={search}
      />
      {weather.main ? (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
