var city_weather_details = document.getElementById('city_weather_details');
var search_container = document.querySelector("#search_container");

/**
 * Updates the weather dashboard page
 * 
 * @param {*} city_name 
 */
function updateWeatherDashboard(city_name) {

  city_weather_details.replaceChildren();
  updateLocalStorage(city_name);
  var fetchLatLongUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city_name + '&APPID=10471b7d9ad846493625be9742901755';

  fetch(fetchLatLongUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data.coord.lat;
      var long = data.coord.lon;
      updateWeather(lat, long, city_name);
    });
}

/**
 * Updates the local storage with the searched city name
 * @param {*} city_name 
 */
function updateLocalStorage(city_name) {

  var cityArray = JSON.parse(localStorage.getItem('cityArray'));
  if (!cityArray) {
    cityArray = [city_name];
    var button = document.createElement('button');
    button.textContent = city_name;
    button.setAttribute("id", "searched_city");
    search_container.appendChild(button);
  } else if (cityArray.includes(city_name) == false) {
    cityArray.push(city_name);
    var button = document.createElement('button');
    button.textContent = city_name;
    button.setAttribute("id", "searched_city");
    search_container.appendChild(button);
  }
  localStorage.setItem('cityArray', JSON.stringify(cityArray));
}


/**
 * 
 * Updates current and future weather forecast based on the passed in latitude, longitude and city
 * @param {*} lat 
 * @param {*} long 
 * @param {*} city_name 
 */
function updateWeather(lat, long, city_name) {

  var requestUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + long + '&exclude=minutely,hourly,alerts&units=imperial&appid=10471b7d9ad846493625be9742901755';
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var currrentForecast = document.createElement('section');
      currrentForecast.setAttribute("id", "curent_day_forecast");



      var cityName = document.createElement('h2');
      cityName.setAttribute("id", "curentDay");
      var date = new Date(data.current.dt * 1000);
      var img = document.createElement('img');

      var imgSrc = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
      img.src = imgSrc;

      cityName.textContent = city_name + " (" + date.toLocaleDateString("default") + ")";
      var br = document.createElement('br');
      cityName.append(br);
      cityName.append(img);

      var temp = document.createElement('p');
      temp.textContent = "Temp: " + data.current.temp + '\xB0F';

      var wind = document.createElement('p');
      wind.textContent = "Wind: " + data.current.wind_speed + " MPH";

      var humidity = document.createElement('p');
      humidity.textContent = "Humidity: " + data.current.humidity + " %";

      var uvi = document.createElement('p');
      uvi.textContent = "UV Index: ";

      updateUvi(data, uvi);

      currrentForecast.appendChild(cityName);
      currrentForecast.appendChild(temp);
      currrentForecast.appendChild(wind);
      currrentForecast.appendChild(humidity);
      currrentForecast.appendChild(uvi);
      city_weather_details.appendChild(currrentForecast);

      updateFiveDayForecast(data, city_name);

    });

    /**
     * Updates the page with the next five day weather forecast
     * 
     * @param {*} data 
     */
  function updateFiveDayForecast(data) {
    var fiveDayForecast = document.createElement('section');
    fiveDayForecast.setAttribute("id", "five_day_forecast");

    var five_day_txt = document.createElement('h2');
    five_day_txt.textContent = "5-Day Forecast:";

    fiveDayForecast.appendChild(five_day_txt);
    console.log(data);

    for (var i = 1; i < 6; i++) {

      var future_forecast = document.createElement('section');
      future_forecast.setAttribute("id", "future_forecast");

      var date = new Date(data.daily[i].dt * 1000);
      var datetxt = document.createElement('h2');
      datetxt.textContent = date.toLocaleDateString("default");

      var img = document.createElement('img');
      var imgSrc = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
      img.src = imgSrc;


      var temp = document.createElement('p');
      temp.textContent = "Temp: " + data.daily[i].temp.day + '\xB0F';

      var wind = document.createElement('p');
      wind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";

      var humidity = document.createElement('p');
      humidity.textContent = "Humidity: " + data.daily[i].humidity + " %";

      future_forecast.appendChild(datetxt);
      future_forecast.append(img);
      future_forecast.appendChild(temp);
      future_forecast.appendChild(wind);
      future_forecast.appendChild(humidity);

      fiveDayForecast.appendChild(future_forecast);
    }
    city_weather_details.appendChild(fiveDayForecast);
  }

  /**
   * Updates UV index with color code 
   * @param {*} data 
   * @param {*} uvi 
   */
  function updateUvi(data, uvi) {
    var spant = document.createElement('span');
    spant.textContent = " " + data.current.uvi + " ";

    uvi.appendChild(spant);

    var uviNum = Number(data.current.uvi);
    console.log(uviNum)
    if (uviNum <= 2) {
      spant.setAttribute("style", "background-color: green; padding: 5px");
    } else if (uviNum > 2 && uviNum < 5) {
      spant.setAttribute("style", "background-color: yellow; padding: 5px");
    } else if (uviNum > 5 && uviNum <= 7) {
      spant.setAttribute("style", "background-color: orange; padding: 5px");
    } else if (uviNum > 7) {
      spant.setAttribute("style", "background-color: red; padding: 5px");
    }

  }

}

/**
 * An EventListener to execute if either search button or 
 * previously searched cities button are clicked
 */
search_container.addEventListener("click", function (event) {
  var element = event.target;
  var city_name = document.getElementById('c_name').value;

  var selectedOption = element.textContent;

  if (element.matches("button") && city_name !== "Search") {

    if (selectedOption == "Search") {
      document.getElementById('c_name').value = city_name;
      if (city_name) {
        updateWeatherDashboard(city_name);
      }
    } else {
      console.log(searched_city.textContent);
      document.getElementById('c_name').value = selectedOption;
      updateWeatherDashboard(selectedOption);
    }

  }
});

searchedCities();


/**
 * Update the searched cities from local storage
 */
function searchedCities() {

  var cityArray = JSON.parse(localStorage.getItem('cityArray'));

  console.log(cityArray);
  if (cityArray) {
    for (var i = 0; i < cityArray.length; i++) {
      var button = document.createElement('button');
      button.textContent = cityArray[i];
      button.setAttribute("id", "searched_city");
      search_container.appendChild(button);
    }
  }
}
