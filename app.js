const express = require("express");
const https = require("https");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const ejs = require("ejs");
dotenv.config();

const app = express();
const key = process.env.APIkey;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//app functions

app.get("/", function (req, res) {
  res.render("index", { weatherData: null, city: null, error: null });
});

app.post("/", (req, res) => {
  const cityName = req.body.location;
  const units = req.body.units;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=${units}`;

  //Get API Data

  https.get(url, (response) => {
    response.on("data", (data) => {
      const weather = JSON.parse(data);
      if (weather.cod !== 200) {
        const error = "Invalid location, Please try again";
        res.render("index", { weatherData: 0, city: null, error: error });
      } else {
        const weatherIcon = weather.weather[0].icon;
        const weatherURL =
          "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        
        //Date based in search location
        // const currentDate = new Date();
        // const sunrise = new Date(weather.sys.sunrise * 1000)
        //   .toLocaleTimeString()
        //   .slice(0, 4);

        //Destructed API data
        const weatherData = {
          cod: weather.cod,
          location: weather.name,
          country: weather.sys.country,
          currentForecast: weather.weather[0].main,
          currentTemp: Math.round(weather.main.temp),
          feelsLike: Math.round(weather.main.feels_like),
          tempMin: Math.round(weather.main.temp_min),
          tempMax: Math.round(weather.main.temp_max),
          timezone: weather.timezone,
          pressure: weather.main.pressure,
          windspeed: weather.wind.speed,
          description: weather.weather[0].description,
          humidity: weather.main.humidity,
          icon: weatherURL,
        };

        //Callback Log Functions

        //
        res.render("index", {
          weatherData: weatherData,
          city: cityName,
          error: null,
        });
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
