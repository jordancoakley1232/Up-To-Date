
// Check if location is available, set the lat and lon(Global Variables).
const clock = () => {

    // Get Hours, Minutes and Seconds
    let rtClock = new Date();

    // Date
    let date = rtClock.toDateString();

    // Hours
    let hours = rtClock.getHours();
    hours = ("0" + hours).slice(-2)
    // Minutes
    let minutes = rtClock.getMinutes();
    minutes = ("0" + minutes).slice(-2)

    // Am and Pm
    let amPm = (hours < 12) ? "AM" : "PM";


    document.getElementById('time').innerHTML = `-${date} / ${hours}:${minutes} ${amPm}`;

    let time = setTimeout(clock, 1000 * 60);

    return hours;
};

// Set Loader Effect
const loader = document.querySelector('.loading-page');
const loaderGreeting = document.querySelector('.loading-greeting')
const display = document.querySelector('.display');

const loadingScreen = () => {
    let hour = clock();
    if (hour >= 0 && hour < 12) {
        loaderGreeting.innerHTML = `Good Morning`
    } else if (hour >= 12 && hour < 18) {
        loaderGreeting.innerHTML = `Good Afternoon`
    } else {
        loaderGreeting.innerHTML = `Good Evening`
    }
    setTimeout(() => {
        loader.style.opacity = 0;
        loader.style.display = 'none';

        display.style.display = 'flex';
        setTimeout(() => (display.style.opacity = 1), 100);

    }, 5000)
}
loadingScreen();


if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        let long = position.coords.longitude;
        let lat = position.coords.latitude
        let hour = clock();
        let timeOfDay;
        if (hour >= 0 && hour < 6) {
            timeOfDay = "night"
        }

        // Get City and Weather Location from Api
        const body = document.getElementsByTagName('body')[0];
        const location_api_url = `location/${lat},${long}`
        const response = await fetch(location_api_url);
        const location = await response.json();

        let countryCode = location.sys.country;
        let image;
        if (countryList[countryCode]) {
            const image_api_url = `image/${countryList[countryCode]}`;
            const response = await fetch(image_api_url);
            image = await response.json();
        } else {
            const image_api_url = `/iamge`;
            const response = await fetch(image_api_url);
            image = await response.json();
        }

        body.style.backgroundImage = `url(${image.urls.full})`;

        // Fetch Air Quality
        const air_quality_api_url = `airquality/${lat},${long}`;
        const air_quality_response = await fetch(air_quality_api_url);
        const airQualityObject = await air_quality_response.json();
        let airQuality = airQualityObject.data.aqi;



        let city = location.name;
        // Set Greeting
        let greeting = document.getElementById('greeting')
        if (hour >= 0 && hour < 12) {
            greeting.innerHTML = `Good Morning from ${city}`
        } else if (hour >= 12 && hour < 18) {
            greeting.innerHTML = `Good Afternoon from ${city}`
        } else {
            greeting.innerHTML = `Good Evening from ${city}`
        }

        // Set Weather
        // 1) Description
        let description = document.querySelector('.weather-description');
        description.innerHTML = location.weather[0].main;
        // 2) Temp
        let temp = document.querySelector('.temp');
        temp.innerHTML = `${Math.floor(location.main.temp)}&deg`;
        // 3) Low Temp
        let lowTemp = document.querySelector('.low-temp');
        lowTemp.innerHTML = `${Math.floor(location.main.temp_min)}&deg`;
        // 3) Low Temp
        let highTemp = document.querySelector('.high-temp');
        highTemp.innerHTML = `${Math.ceil(location.main.temp_max)}&deg`;
        // Set Icon
        let currentIcon = document.querySelector('.current-icon');
        const { icon } = location.weather[0];
        currentIcon.innerHTML = `<img id="importedIcon" src="./icons/${icon}.png">`;

        // Set Air Quality
        // Grab Elements
        const airLevel = document.querySelector(".air-level");
        const circle = document.querySelector(".circle");
        const airDescription = document.querySelector('.air-description');
        airLevel.innerHTML = airQuality;
        // Adjust circle color
        if (airQuality <= 50) {
            circle.style.background = "#40ff00";
            airDescription.innerHTML = "(Good)"
        } else if (airQuality <= 100) {
            circle.style.background = "#ffff1a";
            airDescription.innerHTML = "(Moderate)"
        } else if (airQuality <= 150) {
            circle.style.background = "#ff6600";
            airDescription.innerHTML = "(Caution)"
        } else if (airQuality <= 200) {
            circle.style.background = "#ff0000";
            airDescription.innerHTML = "(Unhealth)"
        } else if (airQuality <= 300) {
            circle.style.background = "#993399";
            airDescription.innerHTML = "(Very Unhealthy)"
        } else {
            circle.style.background = "#990033";
            airDescription.innerHTML = "(Hazardous)"
        }





    }, () => {
        alert("You need to accept geolocation in order to use this app. Please enabel and refresh the page. Thank you :)")
    });
} else {

}


// FETCH DAILY QUOTE
const getQuote = async () => {
    // Quote
    const serverPoint = '../quote';
    const quoteResponse = await (await fetch(serverPoint)).json();
    // Extract Data
    let quote = quoteResponse[0].q;
    let author = quoteResponse[0].a;
    // Grab HTML Elements
    const quoteField = document.querySelector('.quote-words');
    const authorField = document.querySelector('.author');
    // Input Data;
    quoteField.innerHTML = `"${quote}"`;
    authorField.innerHTML = `-${author}`;
}
getQuote();




// Fetch All data for all fields
// We can fetch all data with one function, passing in the specific topic as an argument
const updateHeadline = async (category) => {
    // Headline--------
    const endPoint = `/${category}`;
    const headlineResponse = await (await fetch(`${endPoint}`)).json();
    const articles = headlineResponse.articles.filter(article => {
        if (article.title && article.url && article.urlToImage) {
            return article;
        }
    })
    // Title
    const title = articles[0].title;
    const titleLink = articles[0].url;

    // Image
    const imageUrl = articles[0].urlToImage;

    // // Grab Elements
    const headline = document.querySelector(`.${category}-title`);
    const image = document.querySelector(`.${category}-img`);
    const imageLink = document.querySelector(`.${category}-image-link`)
    imageLink.href = `${titleLink}`;
    imageLink.setAttribute('target', '_blank');

    headline.innerHTML = title.link(titleLink);
    image.style.backgroundImage = `url('${imageUrl}')`;

};
updateHeadline("headline");
updateHeadline("sports");
updateHeadline("business");
updateHeadline("entertainment");



// FETCH ON THIS DAY EVENT

const onThisDay = async () => {
    // End Point
    const endPoint = `./on-this-day`;
    const onThisDayData = await (await fetch(endPoint)).json();
    //Array of events. Filtered to only return objects that have a shorter text length
    let eventsArray = onThisDayData.data.Events.filter(events => {
        return events.text.length <= 120;
    });
    let randomEvent = eventsArray[Math.floor(Math.random() * eventsArray.length)];
    // Grab Event Text
    const eventText = randomEvent.text;
    const eventYear = randomEvent.year;

    // Grab and Input text into Dom elements;
    document.querySelector('.on-this-day-text').innerHTML = eventText;
    document.querySelector('.on-this-date').innerHTML = `(${eventYear})`;
}

onThisDay();










