const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.listen(4000, () => {
    console.log("listening at 4000");
});

app.use(express.static('public'));




// Headlines
app.get('/headline', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=b5575722efe64b47a9ec33ce07370f25`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});



// Sports
app.get('/sports', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=b5575722efe64b47a9ec33ce07370f25`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});


// Business
app.get('/business', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=b5575722efe64b47a9ec33ce07370f25`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});
// // Entertainment
app.get('/entertainment', async (request, response) => {
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=b5575722efe64b47a9ec33ce07370f25`;
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