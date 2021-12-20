var city = document.querySelector("#input");
var historyContainer = document.querySelector("#history");
var weatherToday = document.querySelector("#weatherToday");
var forecast = document.querySelector("#forecast");
var form = document.querySelector(".form")
var searchHistory = []

function handlefFormSubmit(event) {
    event.preventDefault()
    var search = city.value.trim();

    firstFetch(search)

}

function historyClick(event){
    var btn = event.target;
    var search = btn.getAttribute('data-search')
    firstFetch(search)
}


function firstFetch(search) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=8e36cc3b758712e25d49cd55df172ced`)
        .then(function (response) {
            return response.json()
        }).then(
            function (data) {
                secondFetch(data)
                createHistory(search)
                // city.value = ""
                // console.log(data)

            }
        )
}

function createHistory(city) {
    searchHistory.push(city)

    localStorage.setItem('search-history', JSON.stringify(searchHistory))
    renderHistoryButtons()
}

function init() {
    var stored = localStorage.getItem('search-history');

    if (stored) {
        searchHistory = JSON.parse(stored)
    }
    renderHistoryButtons()
}
init()

function renderHistoryButtons() {
    historyContainer.innerHTML = ""
    for (let i = 0; i < searchHistory.length; i++) {
        var btn = document.createElement("button")
        btn.setAttribute("type", "button")
        btn.setAttribute('class', 'history-btn')
        btn.setAttribute('data-search', searchHistory[i])

        btn.textContent = searchHistory[i]

        historyContainer.append(btn)

    }

}

// converts lat and lon to a city
function secondFetch(locationData) {
    var lat = locationData.city.coord.lat
    var lon = locationData.city.coord.lon
    var cityName = locationData.city.name
    // console.log(lat)

    // fetching weather api
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=8e36cc3b758712e25d49cd55df172ced`
    )
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            renderCurrentWeather(data.current, cityName)
            renderForecast(data.daily)
        });

}

function renderCurrentWeather(current, city) {
    console.log(current)
    //we need to show the current date and city
    var responseContainerEl = document.querySelector("#currentCity");
    var date = new Date(current.dt * 1000).toLocaleDateString("en-US");
    var weatherIcon = current.weather[0].icon
    var iconurl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
    var headerText = `${city}, ${date}`
    var cityDateEl = document.createElement("h1");
    var weatherIconImgEl = document.createElement("img")
    weatherIconImgEl.setAttribute('src', iconurl)

    cityDateEl.textContent = headerText;
    cityDateEl.append(weatherIconImgEl)

    // responseContainerEl.append(cityDateEl);


    //we need to create variables that will hold the temp, wind, humidity, weatherIcon, 
    var temp = current.temp
    var wind = current.wind_speed
    var humidity = current.humidity
    var uvIndex = current.uvi
    //create elements thatwill render on the page

    //we need to set attributes to those elements based on bootstrap

    //we need to append the elemts to the weatherToday container. 
    var weatherToday = document.querySelector("#weatherToday")
    var tempEl = document.createElement('p')
    var windEl = document.createElement('p')
    var humidityEl = document.createElement('p')
    var uviEl = document.createElement('p')


    tempEl.textContent = "Temp: " + temp + " °F"
    windEl.textContent = "Wind: " + wind + " mph"
    humidityEl.textContent = "Humidity: " + humidity + "%"
    uviEl.textContent = "UV Index: " + uvIndex

    weatherToday.append(cityDateEl, tempEl, windEl, humidityEl, uviEl)


}

function renderForecast(daily) {
    console.log(daily)
    //we need to create variables that will hold the temp, wind, humidity, weatherIcon, 
    var forecastEl = document.querySelector("#forecast");
    //create elements thatwill render on the page use a for loop to create all the elements
    for (var i = 1; i <= 5; i++) {
        var dailyForecastEl = document.createElement("ul");

        var date = new Date(daily[i].dt * 1000).toLocaleDateString("en-US");

        var temp = daily[i].temp.max
        var wind = daily[i].wind_speed
        var humidity = daily[i].humidity
        var weatherIcon = daily[i].weather[0].icon
        var iconurl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";

        var forecastCard = document.createElement('div')
        var dateListEl = document.createElement("li")
        dateListEl.setAttribute("class", "h5")
        var tempListEl = document.createElement("li")
        var windListEl = document.createElement("li")
        var humidityListEl = document.createElement("li")
        var weatherIconImgEl = document.createElement("img")

        forecastCard.setAttribute('class', "card col-md")
        dateListEl.append(date)
        tempListEl.append("Temp: " + temp + " °F")
        windListEl.append("Wind: " + wind + " mph")
        humidityListEl.append("Humidity: " + humidity + "%")
        weatherIconImgEl.setAttribute('src', iconurl)

        dailyForecastEl.append(dateListEl, tempListEl, windListEl, humidityListEl, weatherIconImgEl)
        forecastCard.append(dailyForecastEl)
        forecastEl.append(forecastCard);
    }
    //we need to set attributes to those elements based on bootstrap

    //we need to append the elemts to the forecast container. 


}

form.addEventListener("submit", handlefFormSubmit)
historyContainer.addEventListener('click', historyClick)