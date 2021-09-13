var city = document.querySelector("#input");
var history = document.querySelector("#history");
var weatherToday = document.querySelector("#weatherToday");
var forecast = document.querySelector("#forecast");
var form = document.querySelector(".form")

function handlefFormSubmit(event) {
    event.preventDefault()
    var search = city.value.trim();


    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=8e36cc3b758712e25d49cd55df172ced`)
        .then(function (response) {
            return response.json()
        }).then(
            function (data) {
                secondFetch(data)
                // city.value = ""
                // console.log(data)

            }
        )
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
    var date = new Date(current.dt).toLocaleDateString("en-US");
    var headerText = `${city}, ${date}`
    var cityDateEl = document.createElement("h1");

    cityDateEl.innerHTML = headerText;

    responseContainerEl.append(cityDateEl);


    //we need to create variables that will hold the temp, wind, humidity, weatherIcon, 
    var temp = current.temp
    var wind = current.wind_speed
    var humidity = current.humidity
    var weatherIcon = current.weather[0].icon
    var uvIndex = current.uvi
    //create elements thatwill render on the page

    //we need to set attributes to those elements based on bootstrap

    //we need to append the elemts to the weatherToday container. 
    var weatherToday = document.querySelector("#weatherToday")

    weatherToday.append("Temp: " + temp + " °F")
    weatherToday.append("Wind: " + wind + " mph")
    weatherToday.append("Humidity: " + humidity + "%")
    weatherToday.append(weatherIcon)
    weatherToday.append("UV Index: " + uvIndex)

}

function renderForecast(daily) {
    console.log(daily)
    //we need to create variables that will hold the temp, wind, humidity, weatherIcon, 
    var forecastEl = document.querySelector("#forecast");
    //create elements thatwill render on the page use a for loop to create all the elements
    for (var i = 0; i < 5; i++) {
        var dailyForecastEl = document.createElement("div");

        var temp = daily[i].temp.max
        var wind = daily[i].wind_speed
        var humidity = daily[i].humidity
        var weatherIcon = daily[i].weather[0].icon

        dailyForecastEl.append("Temp: " + temp + " °F")
        dailyForecastEl.append("Wind: " + wind + " mph")
        dailyForecastEl.append("Humidity: " + humidity + "%")
        dailyForecastEl.append(weatherIcon)

        forecastEl.append(dailyForecastEl);
    }
    //we need to set attributes to those elements based on bootstrap

    //we need to append the elemts to the forecast container. 


}

form.addEventListener("submit", handlefFormSubmit)