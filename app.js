const express = require("express");
const https = require("https");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { response } = require("express");
const ejs = require("ejs");
const { NONAME } = require("dns");
dotenv.config();

const app = express();
const key = process.env.APIkey;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index", { weatherData: null, city: null, error: null });
});

app.post("/", (req, res) => {
  const cityName = req.body.location;
  const units = req.body.units;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=${units}`;

  https.get(url, (response) => {
    response.on("data", (data) => {
      const weather = JSON.parse(data);

      if (weather.cod !== 200) {
        const error = "Invalid location, Please try again";
        res.render('index', {weatherData: 0, city: null, error: error });
      } else {
        const weatherData = {
          cod: weather.cod,
          location: weather.name,
          country: weather.sys.country,
          currentForecast: weather.weather[0].main,
          currentTemp: Math.round(weather.main.temp),
          feelsLike: Math.round(weather.main.feels_like),
          tempMin: Math.round(weather.main.temp_min),
          tempMax: Math.round(weather.main.temp_max),
          sunrise: weather.sys.sunrise,
          sunset: weather.sys.sunset,
          timezone: weather.timezone,
          pressure: weather.main.pressure,
          windspeed: weather.wind.speed,
          description: weather.weather[0].description,
          humidity: weather.main.humidity,
        };
        console.log(weatherData)
        res.render("index", { weatherData: weatherData, city: cityName, error: null });
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
