//need to get the city id, then get the weather info 
// from https://openweathermap.org/current
const apikey = "9bb050786b8e516c44ea060ba91135cb";


const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

// arrow function, if you put brackets around the arrow function the local server cannot access the url... why?
const url = (city) => 
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;


async function getWeatherByLocation(city) {
    const resp = await fetch(url(city));
    const respData = await resp.json();

    console.log(respData); //this is a json OBJECT! chrome compiles it for u

    addWeatherToPage(respData); // pass json data into this function to use methods on
};

function addWeatherToPage(data) {
    const temp = KtoF(data.main.temp); //api methods

    const weather = document.createElement("div");
    weather.classList.add("weather");

    weather.innerHTML = `
    <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°F <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
    <small>${data.weather[0].main}</small>
    <div>${data.name}</div> 
    `;

    // clean up
    main.innerHTML = ""; //to clear the previous city's weather
    main.appendChild(weather);
    search.value = "";
}

function KtoF(K) {
    return Math.floor((K-273.15)*(9/5) + 32);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = search.value;

    if (city) {
        getWeatherByLocation(city);
    }
});

