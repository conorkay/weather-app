export const displayController = (function () {})();

export const apiController = (function () {
  // Retrieves data from api based on user location input string,
  // returns promise containing data
  async function getWeatherData(searchParam) {
    let weatherData;
    let url =
      'http://api.weatherapi.com/v1/current.json?key=822fa6b2bae040daa0502408242702&q=' +
      searchParam +
      '&aqi=yes';

    console.log(url);

    try {
      const response = await fetch(url, { mode: 'cors' });
      weatherData = await response.json();
    } catch (err) {
      console.log(err);
      throw err;
    }

    return weatherData;
  }

  return { getWeatherData };
})();

apiController.getWeatherData('amherst').then((data) => {
  console.log(data);
});
