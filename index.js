const apiUrl = "https://api.open-meteo.com/v1/forecast";
const forecastAmounDays = 3;

var latitude;
var longitude;

function getDescriptionWeatherCode(weatherCode) {
  
  switch (weatherCode) {
    case 0:
      return 'Sunny'; //'Clear sky'
    case 1:
      return 'Mostly Sunny';//'Mainly clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Cloudly';//Overcast
    case 80:
    case 81:
    case 82:
    case 83:
      return 'Rainy';
    case 71:
    case 72:
    case 73:
      return 'Snowy';
    default:
      return 'Unknown code';
  }
  
}

function getImageWeatherCode(weatherCode){
  switch (weatherCode) {
    case 0:
      return '../img/sunny.png'; 
    case 1:
      return '../img/mostly_sunny.png';;
    case 2:
      return '../img/partly_cloudy.png';
    case 3:
      return '../img/cloudly.png';
    case 80:
    case 81:
    case 82:
    case 83:
      return '../img/rainy.png';
    case 71:
    case 72:
    case 73:
      return '../img/snowy.png';
    default:
      return 'Unknown code';
  }
}

function getDayWeekStr(date){
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dayOfWeek = date.getDay(); // 0-based

  return daysOfWeek[dayOfWeek];
}

function formatDate(date) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const month = date.getMonth(); // 0-based index
  const year = date.getFullYear();

  // Format the date as "January, 1"
  return `${months[month]},${day} ${year}`;
}

function shortFormatDate(date) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = date.getMonth(); // 0-based index

  // Format the date as "Jan, 1"
  return `${months[month]},${day}`;
}

function getCityByCoord(latitude, longitude){
 
}

function clearFetchedFata(){

  const fetchedElements = document.getElementsByClassName('fetched');

  for (let i = 0; i < fetchedElements.length; i++) {
    fetchedElements[i].innerHTML = "";
  }

}

function getLocalDate(date){
    // Get the time zone offset in minutes
    //negative value because getTimezoneOffset returns the offset to UTC
    const offsetInMinutes = -new Date().getTimezoneOffset();
    var local = new Date(date.getTime() + offsetInMinutes * 60000);

    return local;
}

function isSunny(weatherCode) {
  return weatherCode === 0;
}

function formatDateToYYYYMMDD(date) {

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function getFormattedForecastDate(amountDays) {

  var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  var day = currentDate.getDate() + amountDays;
  var month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  var year = String(currentDate.getFullYear()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function displayLocation(latitude, longitude){

  clearFetchedFata();

  let startDate = getFormattedForecastDate(1);
  let endDate = getFormattedForecastDate(forecastAmounDays);

  console.log(startDate, endDate);

  const urlCurrentData = `${apiUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weathercode,relative_humidity_2m`;
  const urlForecastData = `${apiUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${startDate}&end_date=${endDate}`;

  getAllData(urlCurrentData, urlForecastData);

}


function getAllData(urlCurrentData, urlForecast) {

  document.getElementById('spinner').style.display = 'block';

  Promise.all([fetch(urlCurrentData), fetch(urlForecast)])
    .then(responses => {
 
      if (!responses[0].ok || !responses[1].ok) {
        throw new Error('One or more requests failed');
      }

      return Promise.all([responses[0].json(), responses[1].json()]);

    })
    .then(data => {

      const dataCurrent = data[0];
      const dataDaily = data[1];

      //console.log('Current data:', dataCurrent);
      console.log('Daily data:', dataDaily);

      getFetchCurrentWeather(dataCurrent);
      getFetchDailyWeather(dataDaily);

    })
    .catch(error => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      document.getElementById('spinner').style.display = 'none';
    });
}

function getFetchDailyWeather(data){

  const nextDays = data.daily.time;
  const codes = data.daily.weathercode;
  const minTemps = data.daily.temperature_2m_min;
  const maxTemps = data.daily.temperature_2m_max;
  const unitTemps = data.daily_units.temperature_2m_min;


  let ulItem  = document.getElementById("forecast_nextdays").querySelector("ul");

  for (let i = 0; i < nextDays.length; i++) {

      let date =  getLocalDate(new Date(nextDays[i]));

      const imgUrl = getImageWeatherCode(codes[i]); 
      const descImg = getDescriptionWeatherCode(codes[i]); 

      let titleItem = document.createElement("li");
      titleItem.classList.add("centered_text");
      titleItem.innerHTML = `<img src="${imgUrl}" alt="${descImg}"/>`; 
      titleItem.innerHTML += `${getDayWeekStr(date)}  ${shortFormatDate(date)} <br> ${minTemps[i]}/${maxTemps[i]} ${unitTemps}`; 
      ulItem.append(titleItem);
  } 


}

function getFetchCurrentWeather(data){

    const today = new Date(data.current.time);
    
    const weatherCode = data.current.weathercode;
    const temperature = Math.floor(parseInt(data.current.temperature_2m));
    const windSpeed = data.current.wind_speed_10m;
    
    const temperatureUnit = data.current_units.temperature_2m;
    const windSpeedUnit = data.current_units.wind_speed_10m;

    //-------------Current Date-------------------
    const local = getLocalDate(today);
    let currWeatherDateContainer  = document.getElementById("current_weather_date");
    let item = document.createElement("div");
    item.classList.add("big_font");
    const dayOfWeek = getDayWeekStr(local);
    item.innerHTML = `<p>${dayOfWeek}</p>`;
    currWeatherDateContainer.append(item);
    
    item = document.createElement("div");
    const dateFormatted = formatDate(local);
    item.innerHTML = `<p>${dateFormatted}</p>`;
    currWeatherDateContainer.append(item);
    //-------------End Current Date----------------
    
    //-------------Temperature---------------------
    let currentTemperature = document.getElementById("current_temperature");
    let temperatureItem = document.createElement("p");
    temperatureItem.classList.add("super_big_font");
    temperatureItem.innerText = `${temperature} ${temperatureUnit}`;
    currentTemperature.append(temperatureItem);
    //-------------End Temperature---------------------
    
    //-------------Start Weather Code------------------
    let currentWeather = document.getElementById("current_weather_code");
    let imgItem = document.createElement("p");
    const imgUrl = getImageWeatherCode(weatherCode); 
    const descImg = getDescriptionWeatherCode(weatherCode); 
    imgItem.innerHTML = `<img src="${imgUrl}" alt="${descImg}"/>`;
    currentWeather.append(imgItem);

    let descWeather = document.createElement("p");
    descWeather.innerText = descImg;
    currentWeather.append(descWeather);
    //-------------End Weather Code------------------

}

function convertToCelsius(){

  clearFetchedFata();
  displayLocation(latitude, longitude);

}

function convertToFahrenheit(){

  clearFetchedFata();

  let startDate = getFormattedForecastDate(1);
  let endDate = getFormattedForecastDate(forecastAmounDays);

  const urlCurrentData =  `${apiUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weathercode&temperature_unit=fahrenheit`;
  const urlForecastData = `${apiUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${startDate}&end_date=${endDate}&temperature_unit=fahrenheit`;

  getAllData(urlCurrentData, urlForecastData);

}


function successCallback(position){

  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  displayLocation(latitude, longitude);
}

function errorsCallBack(err){
    console.error(`ERROR(${err.code}): ${err.message}`);
}

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(successCallback, errorsCallBack);
}else{
  console.error("Your browser does not support geolocation.");
}
