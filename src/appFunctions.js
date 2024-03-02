import dayImage from './assets/day-image.jpg';
import nightImage from './assets/night-image.jpg';
import sunIcon from './assets/weatherIcons/sun-icon.png';
import moonIcon from './assets/weatherIcons/moon-icon.png';
import cloudIcon from './assets/weatherIcons/cloud.png';
import partlyCloudyDay from './assets/weatherIcons/partly-cloudy-day.png';
import partlyCloudyNight from './assets/weatherIcons/partly-cloudy-night.png';
import rainIcon from './assets/weatherIcons/rain.png';
import snowIcon from './assets/weatherIcons/snow.png';
import thunderIcon from './assets/weatherIcons/thunder.png';

export const displayController = (function () {
  const locationName = document.getElementById('name');
  const localTime = document.getElementById('time');
  const condition = document.getElementById('condition');
  const temp = document.getElementById('temp');
  const windspeed = document.getElementById('windspeed');
  const currWeatherIcon = document.getElementById('currWeatherIcon');
  const dateSpan = document.getElementById('date');
  const feelsLike = document.getElementById('feelsLike');
  const humidity = document.getElementById('humidity');
  const percentRain = document.getElementById('percentRain');

  function populateDisplay(data) {
    locationName.innerText = data.name + ', ' + data.region;
    localTime.innerText = data.time;
    condition.innerText = data.condition.text;
    temp.innerText = data.tempF + '/' + data.tempC;
    windspeed.innerText = 'Windspeed: ' + data.windspeedMPH + ' MPH';
    humidity.innerText = 'Humidity: ' + data.humidity + '%';
    feelsLike.innerText =
      'Feels like: ' + data.feelsLikeF + '/' + data.feelsLikeC;
    percentRain.innerText = 'Chance of Rain: ' + data.percentRain + '%';

    let date = new Date();
    dateSpan.innerText = date.toDateString();
    currWeatherIcon.src = getWeatherIcon(data.condition.code, data.isDay);
    setBackground(data.isDay);
  }

  function setBackground(isDay) {
    if (isDay) {
      document.body.style.backgroundImage = "url('" + dayImage + "')";
    } else {
      document.body.style.backgroundImage = "url('" + nightImage + "')";
    }
  }

  // Returns a weather icon based on the condition code and isDay boolean
  function getWeatherIcon(code, isDay) {
    if (code === 1000) {
      if (isDay) {
        return sunIcon;
      } else {
        return moonIcon;
      }
    } else if (code === 1003) {
      if (isDay) {
        return partlyCloudyDay;
      } else {
        return partlyCloudyNight;
      }
    } else if (
      code === 1006 ||
      code === 1009 ||
      code === 1030 ||
      code === 1135 ||
      code === 1147
    ) {
      return cloudIcon;
    } else if (
      code === 1063 ||
      code === 1069 ||
      code === 1072 ||
      (code > 1149 && code < 1209) ||
      (code > 1239 && code < 1254)
    ) {
      return rainIcon;
    } else if (
      (code > 1209 && code < 1239) ||
      (code > 1254 && code < 1265) ||
      code > 1277
    ) {
      return snowIcon;
    } else if (code > 1265 && code < 1277) {
      return thunderIcon;
    }
  }

  return { populateDisplay };
})();

export const apiController = (function () {
  // Retrieves data from api based on user location input string searchParam,
  // returns promise containing data
  async function getCurrWeather(searchParam) {
    let weatherData;
    let url =
      'http://api.weatherapi.com/v1/forecast.json?key=822fa6b2bae040daa0502408242702&q=' +
      searchParam +
      '&days=3&aqi=no&alerts=yes';

    try {
      const response = await fetch(url, { mode: 'cors' });
      weatherData = await response.json();
      if (!response.ok) {
        console.error('Error code: ' + response.status);
        if (response.status === 400) {
          alert('No location found. Try again.');
        } else if (response.status === 403) {
          console.error('Key error');
        }
      }
    } catch (err) {
      console.log('There was an error', err);
    }
    console.log(weatherData);
    return weatherData;
  }

  // Parses a data object for data relevant to app: location name, region,
  // local time, condition, feels like, humidity, temp in F/C, wind speed
  function processCurrWeather(data) {
    // Current data
    let name = data.location.name;
    let region;

    if (
      data.location.country === 'United States of America' ||
      data.location.country === 'USA' ||
      data.location.country === 'USA United States of America'
    ) {
      region = data.location.region;
    } else {
      region = data.location.country;
    }

    let condition = data.current.condition;
    let tempC = data.current.temp_c + '\u00B0C';
    let tempF = data.current.temp_f + '\u00B0F';
    let windspeedMPH = data.current.wind_mph;
    let humidity = data.current.humidity;
    let feelsLikeF = data.current.feelslike_f + '\u00B0F';
    let feelsLikeC = data.current.feelslike_c + '\u00B0C';
    let percentRain = data.forecast.forecastday[0].day.daily_chance_of_rain;
    let isDay = data.current.is_day;

    let date = data.location.localtime;
    const array = date.split(' ');
    let time = array[1];

    return {
      name,
      region,
      time,
      condition,
      tempC,
      tempF,
      windspeedMPH,
      humidity,
      feelsLikeC,
      feelsLikeF,
      percentRain,
      isDay,
    };
  }
  return { getCurrWeather, processCurrWeather };
})();
