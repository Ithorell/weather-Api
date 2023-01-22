var search_Button = document.querySelector("#searchBtn")
var search_Input = document.querySelector("#search")
var listEl = document.querySelector("#historyList")
var currentWeatherEl = document.querySelector("#todaysWeather")
var forecastEl = document.querySelector("#forecast")

// Api information
const apiKey = "42fc530a37708c39a7c80de69d7cd1ed";

// local storage
var searchHistory = JSON.parse(localStorage.getItem("storedCities")) || [];


// Event listener for history list
listEl.addEventListener("click", function (event) {
    var searchValue = event.target.textContent;
    getWeather(searchValue);
});

// Functions for Api calls
function latlonWeather(city){
    return `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
};

function getWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`};

function apiCall (city) {
    fetch(latlonWeather(city))
    .then (response => response.json())
    .then (data => {
        var lat = data[0].lat;
        var lon = data[0].lon;

        fetch(getWeather(lat, lon))
        .then (response => response.json())
        .then (data =>{
            renderCurrentWeather(data);
        }); });
};

// Function to render search history
function renderSearchHistory() {
    listEl.innerHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        var historyItem = document.createElement("li");
        historyItem.textContent = searchHistory[i];
        listEl.appendChild(historyItem);
    }
};

// Function to render current weather
function renderCurrentWeather(data) {
    var today = data.list[0];
    currentWeatherEl.innerHTML = "";

    var cityName = document.createElement("h2");
    var cityTemp = document.createElement("p");
    var cityHumidity = document.createElement("p");
    var cityWind = document.createElement("p");

    cityName.textContent = `${data.city.name} - ${moment.unix(today.dt).format("MM Do, YYYY")}`;
    cityTemp.textContent = `Temperature: ${today.temp.day} °F`;
    cityHumidity.textContent = `Humidity: ${today.humidity}%`;
    cityWind.textContent = `Wind Speed: ${today.wind_speed} MPH`;

    currentWeatherEl.appendChild(cityName);
    currentWeatherEl.appendChild(cityTemp);
    currentWeatherEl.appendChild(cityHumidity);
    currentWeatherEl.appendChild(cityWind);

    forecastEl.innerHTML ="";

    for (var i = 7; i < data.daily.length; i+= 8) {
        let day = data.list[i];

        let figure = document.createElement("figure");
        let date = document.createElement("h3");
        let temp = document.createElement("p");
        let humidity = document.createElement("p");
        let wind = document.createElement("p");

        date.textContent = moment.unix(day.dt).format("MM Do, YYYY");
        temp.textContent = `Temp: ${day.main.temp} °F`;
        humidity.textContent = `Humidity: ${day.main.humidity}%`;
        wind.textContent = `Wind Speed: ${day.wind.speed} MPH`;

        forecastEl.appendChild(figure);
        figure.appendChild(date);
        figure.appendChild(temp);
        figure.appendChild(humidity);
        figure.appendChild(wind);
    }
};

search_Button.addEventListener("click", function (event) {
    event.preventDefault();
    var searchValue = search_Input.value.trim();

    if (searchValue) {
        getWeather(searchValue);
        apiCall(searchValue);
        searchHistory.push(searchValue);
        localStorage.setItem("storedCities", JSON.stringify(searchHistory));
        renderSearchHistory();
    }
    else {
        alert("Please enter a valid city name");
    };
});