const express = require('express');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();
// console.log(process.env);

app.listen(4000, () => {
    console.log("listening at 4000");
});

app.use(express.static('public'));


// api key from .env file
const api_key = process.env.NEWS_API_KEY;
const weather_api_key = process.env.WEATHER_API_KEY;
const image_api_key = process.env.IMAGE_API_KEY;
const air_quality_api_key = process.env.AIR_QUALITY_API_KEY;

// Background Image with location
app.get('/image/:country', async (request, response) => {
    const country = request.params.country;
    let api_url = `https://api.unsplash.com/photos/random/?client_id=${image_api_key}&query=${country}&featured=true`;
    const fetch_response = await fetch(api_url);
    const image_response = await fetch_response.json();
    response.json(image_response);
})
// Background Image without Location
app.get('/image', async (request, response) => {
    let api_url = `https://api.unsplash.com/photos/random/?client_id=${image_api_key}&query=capital&featured=true`;
    const fetch_response = await fetch(api_url);
    const image_response = await fetch_response.json();
    response.json(image_response);
})


// Weather
app.get('/location/:latlong', async (request, response) => {
    // console.log(request.params);
    const latlong = request.params.latlong.split(",");
    // console.log(latlong)
    const lat = latlong[0];
    const long = latlong[1];
    // console.log(lat, long);
    let api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&APPID=${weather_api_key}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json)
})

// Weather Quality
// air_quality_api_key
app.get('/airquality/:latlong', async (request, response) => {
    const latlong = request.params.latlong.split(",");
    const lat = latlong[0];
    const long = latlong[1]
    let api_url = `https://api.waqi.info/feed/geo:${lat};${long}/?token=${air_quality_api_key}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
})




// Headlines
app.get('/headline', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${api_key}`
    console.log(api_url);
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});



// Sports
app.get('/sports', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${api_key}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});


// // Business
app.get('/business', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${api_key}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});
// // // Entertainment
app.get('/entertainment', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=${api_key}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});

// On-This-Day
app.get('/on-this-day', async (request, response) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let api_url = `http://history.muffinlabs.com/date/${month}/${day}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});


app.get('/quote', async (request, response) => {
    let api_url = `https://zenquotes.io/api/today`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})