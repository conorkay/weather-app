export const displayController = (function () {
  const locationName = document.getElementById('name');
  const region = document.getElementById('region');
  const localTime = document.getElementById('time');
  const condition = document.getElementById('condition');
  const tempC = document.getElementById('tempC');
  const tempF = document.getElementById('tempF');
  const windspeed = document.getElementById('windspeed');

  function populateDisplay(data) {
    locationName.innerText = data.name;
    region.innerText = data.region;
    localTime.innerText = data.time;
    condition.innerText = data.condition.text;
    tempF.innerText = data.tempF;
    tempC.innerText = data.tempC;
    windspeed.innerText = data.windspeedMPH;
  }

  return { populateDisplay };
})();

export const apiController = (function () {
  // Retrieves data from api based on user location input string searchParam,
  // returns promise containing data
  async function getCurrWeather(searchParam) {
    let weatherData;
    let url =
      'http://api.weatherapi.com/v1/current.json?key=822fa6b2bae040daa0502408242702&q=' +
      searchParam +
      '&aqi=yes';

    console.log(url);

    try {
      const response = await fetch(url, { mode: 'cors' });
      weatherData = await response.json();
      if (!response.ok) {
        console.log('Error code: ' + response.status);
        if (response.status === 400) {
          alert('No location found. Try again.');
        } else if (response.status === 403) {
          console.log('Key error');
        }
      }
    } catch (err) {
      console.log('There was an error', err);
    }
    return weatherData;
  }

  // Parses a data object for data relevant to app: location name, region,
  // local time, condition, feels like, humidity, temp in F/C, wind speed
  function processCurrWeather(data) {
    let name = data.location.name;
    let region = data.location.region;
    let condition = data.current.condition;
    let tempC = data.current.temp_c;
    let tempF = data.current.temp_f;
    let windspeedMPH = data.current.wind_mph;

    let date = data.location.localtime;
    const array = date.split(' ');
    let time = array[1];

    return { name, region, time, condition, tempC, tempF, windspeedMPH };
  }
  return { getCurrWeather, processCurrWeather };
})();
