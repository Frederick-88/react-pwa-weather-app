import React, { useRef, useState, useEffect } from "react";

import { fetchWeather } from "./api/fetchWeather";

import searchIcon from "./assets/images/search.png";
import cloudyBg from "./assets/images/cloudy.jpg";
import rainyBg from "./assets/images/rainy.jpg";
import sunnyBg from "./assets/images/sunny.png";
import thunderBg from "./assets/images/thunder.png";
import windyBg from "./assets/images/windy.webp";

import "./App.css";

const App = () => {
  const inputRef = useRef();

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // -------
  // Computed
  // -------
  const isShowCityDetails = () => {
    if (isMobile) return weather.main && !isInputFocused;
    return weather.main;
  };

  const backgroundImage = (weatherData) => {
    let weatherImageUrl = "";

    if (weatherData.weather) {
      const weatherId = weatherData.weather[0].id;

      if (weatherId <= 804 && weatherId >= 800) weatherImageUrl = sunnyBg;
      else if (weatherId <= 781 && weatherId >= 701) weatherImageUrl = windyBg;
      else if (weatherId <= 321 && weatherId >= 300) weatherImageUrl = cloudyBg;
      else if (weatherId <= 531 && weatherId >= 500) weatherImageUrl = rainyBg;
      else weatherImageUrl = thunderBg;
    }

    return {
      backgroundImage: `url(${weatherImageUrl})`,
    };
  };

  const weatherName = (weatherData) => {
    let weatherDataName = "Sunny";

    if (weatherData.weather) {
      const weatherId = weatherData.weather[0].id;

      if (weatherId <= 804 && weatherId >= 800) weatherDataName = "Sunny";
      else if (weatherId <= 781 && weatherId >= 701) weatherDataName = "Windy";
      else if (weatherId <= 321 && weatherId >= 300) weatherDataName = "Cloudy";
      else if (weatherId <= 531 && weatherId >= 500) weatherDataName = "Rainy";
      else weatherDataName = "Storm";
    }

    return weatherDataName;
  };

  // -------
  // Methods
  // -------
  const detectScreenSize = () => {
    if (window.innerWidth < 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const onKeyPressSearch = (event) => {
    if (event.key === "Enter") searchCity();
  };

  const searchCity = async () => {
    if (!query) return;

    const response = await fetchWeather(query);
    if (response) {
      setWeather(response.data);
      setQuery("");
    } else {
      alert("Please use another city/country keyword.");
    }

    if (isMobile) inputRef.current.blur();
  };

  const onBlurInput = (event) => {
    // event.persist(); // for debugging "event" purpose, so event values won't be "null"
    // console.log("onBlurInput", event);

    // since react's onBlur event have bug where if got onBlur, onClick event cannot be triggered
    if (isMobile && event && event.relatedTarget) event.relatedTarget.click();
    setIsInputFocused(false);
  };

  useEffect(() => {
    async function fetchSingaporeWeather() {
      const response = await fetchWeather();
      setWeather(response.data);
    }
    fetchSingaporeWeather();

    detectScreenSize();
    // proper way to handle event listener -> https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
    window.addEventListener("resize", detectScreenSize);
    return () => window.removeEventListener("resize", detectScreenSize);
  }, []);

  return (
    <div className="main-container" style={backgroundImage(weather)}>
      <div className="content-wrapper">
        <div className="content__input-wrapper">
          <button
            type="button"
            title="Search"
            onClick={(event) => searchCity(event)}
            className="input-icon"
          >
            <img src={searchIcon} alt="search-icon" className="search-icon" />
          </button>
          <input
            type="text"
            className="input"
            placeholder="Search City/Country..."
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyPress={(event) => onKeyPressSearch(event)}
            onBlur={(event) => onBlurInput(event)}
            onFocus={() => setIsInputFocused(true)}
          />
        </div>

        {isShowCityDetails() ? (
          <div className="content__city-details">
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
              <p>
                {weatherName(weather)} - {weather.weather[0].description}
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default App;
