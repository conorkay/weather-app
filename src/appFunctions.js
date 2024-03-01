export const displayController = (function () {
  const locationName = document.getElementById('name');
  const region = document.getElementById('region');
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
    currWeatherIcon.src = 'http:' + data.condition.icon;
    humidity.innerText = 'Humidity: ' + data.humidity + '%';
    feelsLike.innerText =
      'Feels like: ' + data.feelsLikeF + '/' + data.feelsLikeC;
    percentRain.innerText = 'Chance of Rain: ' + data.percentRain + '%';

    let date = new Date();
    dateSpan.innerText = date.toDateString();
    console.log('Is day: ' + data.isDay);
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

    console.log(url);

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
    let region = data.location.region;
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
