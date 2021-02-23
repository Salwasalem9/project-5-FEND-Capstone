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

// Geonames URL+KEY
const Geonames_URL = 'http://api.geonames.org/searchJSON?q=';
const Geonames_Key = process.env.GEONAMES_USERNAME;
console.log(`Geonames API Key is ${Geonames_Key}`);

// Weatherbit URL+KEY
const weatherbit_URL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbit_Key = process.env.WEATHERBIT_KEY;
console.log(`Weatherbit API Key is ${weatherbit_Key}`);

// Pixabay URL+KEY
const pixabay_URL = 'https://pixabay.com/api/?';
const pixabay_Key = process.env.PIXABAY_KEY;
const pixabayParameters = 'image_type=photo&safesearch=true';
console.log(`Pixabay API Key is ${pixabay_Key}`);

const geonames_Data = (data) => {
  const lon = data.geonames[0].lng;
  const lat = data.geonames[0].lat;
  const country = data.geonames[0].countryName;
  const geonames_information = {
    lon: lon,
    lat: lat,
    country: country,
  };

  console.log(geonames_information);
  return geonames_information;
};

const weatherbit_Data = (data) => {
  const lon = data.lon;
  const lat = data.lat;
  const country = data.country;
  return fetch(
    `${weatherbit_URL}&lat=${lat}&lon=${lon}&days=16&key=${weatherbit_Key}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const temp = Math.round(data.data[0].temp);
      const icon = data.data[0].weather.icon;
      const description = data.data[0].weather.description;

      // high and low weather temp for 15 days 
      
      let high = 0;
      let low = 0;

      let i = 0;
      while ( i < 15) {
        high = data.data[i].high_temp + high;
        low = data.data[i].low_temp + low;
        i++
      }
      high = Math.round(high / 15);
      low = Math.round(low / 15);

      const weatherbitInfo = {
        country: country,
        temp: temp,
        description: description,
        icon: icon,
        high: high,
        low: low,
      };
      return weatherbitInfo;
    });
};

const pixabay_Data = (passedData, destination) => {
  return fetch(
    `${pixabay_URL}key=${pixabay_Key}&q=${destination}&${pixabayParameters}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let ImageCity = 'No images found!';
      if (data.total > 0) {
        ImageCity = data.hits[0].largeImageURL;
      }
      const all_Info = {
        destination: destination,
        country: passedData.country,
        temp: passedData.temp,
        icon: passedData.icon,
        description: passedData.description,
        high: passedData.high,
        low: passedData.low,
        ImageCity: ImageCity,
      };
      console.log(all_Info);

      return all_Info;
    });
};

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

app.post('/results', (req, res) => {
  const data = req.body;


 
  //parse destination from req.body on route /results
  let destination = data.destination;

  fetch(`${Geonames_URL}${destination}&username=${Geonames_Key}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return geonames_Data(data);
    })
    .then((GNData) => {
      return weatherbit_Data(GNData);
    })
    .then((WBData) => {
      return pixabay_Data(WBData, destination);
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => console.log(error));
});

// test server 
module.exports = app;