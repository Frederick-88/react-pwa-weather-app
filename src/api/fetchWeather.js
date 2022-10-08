import axios from "axios";

const URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "08c63bb12c5a4132f5d570f08f17872d";

export const fetchWeather = async (query) => {
  try {
    let data = {};

    data = await axios.get(URL, {
      params: {
        q: query || "singapore",
        units: "metric",
        APPID: API_KEY,
      },
    });

    return data;
  } catch (error) {
    //
  }
};
