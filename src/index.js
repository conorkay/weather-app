import './style.css';
import { displayController, apiController } from './appFunctions';

const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('submit', (event) => {
  let dataObj;
  event.preventDefault();

  apiController
    .getCurrWeather(event.currentTarget.locationInput.value)
    .then((data) => {
      if (!data.error) {
        dataObj = apiController.processCurrWeather(data);
        console.log(dataObj);
        displayController.populateDisplay(dataObj);
      }
    });
});
