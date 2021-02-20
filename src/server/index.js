const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
// To try and deploy the project to netlify
const serverless = require('serverless-http');
// Start up an instance of app
const app = express();

// Cors allows the browser and server to communicate without any security interruptions
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

// Geonames API
const GeonamesURL = 'http://api.geonames.org/searchJSON?q=';
const GeonamesKey = process.env.GEONAMES_USERNAME;
console.log(`Geonames API Key is ${GeonamesKey}`);

// Weatherbit API
const weatherbitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbitKey = process.env.WEATHERBIT_KEY;
console.log(`Weatherbit API Key is ${weatherbitKey}`);

// Pixabay API
const pixabayURL = 'https://pixabay.com/api/?';
const pixabayKey = process.env.PIXABAY_KEY;
const pixabayParameters = 'image_type=photo&safesearch=true';
console.log(`Pixabay API Key is ${pixabayKey}`);

const geonamesData = (data) => {
  const lon = data.geonames[0].lng;
  const lat = data.geonames[0].lat;
  const country = data.geonames[0].countryName;
  const geonamesInfo = {
    lon: lon,
    lat: lat,
    country: country,
  };

  console.log(geonamesInfo);
  return geonamesInfo;
};

const weatherbitData = (data) => {
  const lon = data.lon;
  const lat = data.lat;
  const country = data.country;
  return fetch(
    `${weatherbitURL}&lat=${lat}&lon=${lon}&days=16&key=${weatherbitKey}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const temp = Math.round(data.data[0].temp);
      const icon = data.data[0].weather.icon;
      const description = data.data[0].weather.description;

      // Average temp for 16 days (They only offer 16 days forecast)
      let avgTemp = 0;
      let maxTemp = 0;
      let minTemp = 0;
      for (let i = 0; i < 16; i++) {
        avgTemp = data.data[i].temp + avgTemp;
        maxTemp = data.data[i].max_temp + maxTemp;
        minTemp = data.data[i].min_temp + minTemp;
      }
      avgTemp = Math.round(avgTemp / 16);
      maxTemp = Math.round(maxTemp / 16);
      minTemp = Math.round(minTemp / 16);

      const weatherbitInfo = {
        avgTemp: avgTemp,
        maxTemp: maxTemp,
        minTemp: minTemp,
        temp: temp,
        description: description,
        icon: icon,
        country: country,
      };
      return weatherbitInfo;
    });
};

const pixabayData = (passedData, destination) => {
  return fetch(
    `${pixabayURL}key=${pixabayKey}&q=${destination}&${pixabayParameters}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let ImageCity = 'No images were found!';
      if (data.total > 0) {
        ImageCity = data.hits[0].largeImageURL;
      }
      const finalInfo = {
        destination: destination,
        country: passedData.country,
        temp: passedData.temp,
        avgTemp: passedData.avgTemp,
        maxTemp: passedData.maxTemp,
        minTemp: passedData.minTemp,
        icon: passedData.icon,
        description: passedData.description,
        ImageCity: ImageCity,
      };
      console.log(finalInfo);

      return finalInfo;
    });
};

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

app.post('/results', (req, res) => {
  const data = req.body;


  //console.log(`${GeonamesURL}${destination}&username=${GeonamesKey}`);
  //parse destination from req.body on route /results
  let destination = data.destination;

  fetch(`${GeonamesURL}${destination}&username=${GeonamesKey}`)
    .then((res) => {
     // console.log(`${GeonamesURL}${destination}&username=${GeonamesKey}`);
      return res.json();
    })
    .then((data) => {
      return geonamesData(data);
    })
    .then((GNData) => {
      return weatherbitData(GNData);
    })
    .then((WBData) => {
      return pixabayData(WBData, destination);
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => console.log(error));
});

// To test server using jest and supertest
module.exports = app;