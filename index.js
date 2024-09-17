const apiUrl = "https://api.open-meteo.com/v1/forecast";
const current = 'temperature_2m,wind_speed_10m,wind_direction_10m,weathercode,relative_humidity_2m';
const daily = 'temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,weathercode,relative_humidity_2m_max,relative_humidity_2m_min';
const forecastAmounDays = 5;

var latitude;
var longitude;

const directions = [
  { name: 'North', min: 0, max: 22.5, arrow: '↑' },
  { name: 'North-Northeast', min: 22.5, max: 45, arrow: '↗'},
  { name: 'Northeast', min: 45, max: 67.5, arrow: '↗'},
  { name: 'East-Northeast', min: 67.5, max: 90, arrow: '↗'},
  { name: 'East', min: 90, max: 112.5, arrow: '→'},
  { name: 'East-Southeast', min: 112.5, max: 135, arrow: '↘'},
  { name: 'Southeast', min: 135, max: 157.5, arrow: '↘'},
  { name: 'South-Southeast', min: 157.5, max: 180, arrow: '↘'},
  { name: 'South', min: 180, max: 202.5, arrow: '↓'},
  { name: 'South-Southwest', min: 202.5, max: 225, arrow: '↙'},
  { name: 'Southwest', min: 225, max: 247.5, arrow: '↙'},
  { name: 'West-Southwest', min: 247.5, max: 270, arrow: '↙'},
  { name: 'West', min: 270, max: 292.5, arrow: '←'},
  { name: 'West-Northwest', min: 292.5, max: 315, arrow: '↖'},
  { name: 'Northwest', min: 315, max: 337.5, arrow: '↖'},
  { name: 'North-Northwest', min: 337.5, max: 360, arrow: '↖'}
];

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
      return '../img/no_image_icon.png';
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

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "inline";
  evt.currentTarget.className += " active";
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

function getDirectionWind(degrees){

  for (const item of directions) {
    if (degrees >= item.min && degrees < item.max) {
        return `${item.arrow} ${item.name}`;
    }
  }

  return 'Unknown';

}

function displayLocation(latitude, longitude){

  clearFetchedFata();

  let startDate = getFormattedForecastDate(1);
  let endDate = getFormattedForecastDate(forecastAmounDays);

  console.log(startDate, endDate);
  const urlCurrentData = `${apiUrl}?latitude=${latitude}&longitude=${longitude}&current=${current}`;
  const urlForecastData = `${apiUrl}?latitude=${latitude}&longitude=${longitude}&daily=${daily}&start_date=${startDate}&end_date=${endDate}`;

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

  const maxWindSpeed = data.daily.wind_speed_10m_max;
  const unitWindSpeed = data.daily_units.wind_speed_10m_max;
  const windDirectionDominant = data.daily.wind_direction_10m_dominant;

  const minHumidity = data.daily.relative_humidity_2m_min;
  const maxHumidity = data.daily.relative_humidity_2m_max;
  const unitMinHumidity = data.daily_units.relative_humidity_2m_min;
  //const unitMzxHumidity = data.daily_units.relative_humidity_2m_max;

  //-------------Temperature Tab-------------------------------------------
  let ulItem  = document.getElementById("temperature").querySelector("ul");
  for (let i = 0; i < nextDays.length; i++) {

      let date =  getLocalDate(new Date(nextDays[i]));

      const imgUrl = getImageWeatherCode(codes[i]); 
      const descImg = getDescriptionWeatherCode(codes[i]); 

      let titleItem = document.createElement("li");
      titleItem.innerHTML = `<img src="${imgUrl}" alt="${descImg}"/>`; 
      titleItem.innerHTML += `<br> ${getDayWeekStr(date)} ${shortFormatDate(date)} <br> t\u00B0: ${Math.floor(minTemps[i])}/${Math.floor(maxTemps[i])} ${unitTemps}`; 
      ulItem.append(titleItem);
  } 
  //-------------Wind Tab-------------------------------------------
  ulItem  = document.getElementById("wind").querySelector("ul");
  for (let i = 0; i < nextDays.length; i++) {

    let date =  getLocalDate(new Date(nextDays[i]));

    let titleItem = document.createElement("li");
    const windDirectionStr = getDirectionWind(windDirectionDominant[i]);
    titleItem.innerHTML += `${getDayWeekStr(date)} ${shortFormatDate(date)} <br>${windDirectionStr} <br> ${maxWindSpeed[i]} ${unitWindSpeed}`; 
    ulItem.append(titleItem);
  } 
  //-------------Precipitation Probability Tab-------------------------------------------
  ulItem  = document.getElementById("humidity").querySelector("ul");
  for (let i = 0; i < nextDays.length; i++) {

    let date =  getLocalDate(new Date(nextDays[i]));
    let titleItem = document.createElement("li");
    titleItem.innerHTML += `${getDayWeekStr(date)} ${shortFormatDate(date)} <br>💧: ${minHumidity[i]}/${maxHumidity[i]}${unitMinHumidity}`; 
    ulItem.append(titleItem);
  } 
}

function getFetchCurrentWeather(data){

    const today = new Date(data.current.time);
    
    const weatherCode = data.current.weathercode;
    const temperature = Math.floor(parseInt(data.current.temperature_2m));
    const windSpeed = data.current.wind_speed_10m;
    const windDirection = data.current.wind_direction_10m;
    const humidity = data.current.relative_humidity_2m;
    
    const temperatureUnit = data.current_units.temperature_2m;
    const windSpeedUnit = data.current_units.wind_speed_10m;
    const humidityUnit = data.current_units.relative_humidity_2m;

    //-------------Current Date-------------------
    const local = getLocalDate(today);
    let currWeatherDateContainer  = document.getElementById("current_weather_date");
    let item = document.createElement("div");
    item.classList.add("big_font");
    const dayOfWeek = getDayWeekStr(local);
    const dateFormatted = formatDate(local);
    item.innerHTML = `${dayOfWeek} <br> ${dateFormatted}`;
    currWeatherDateContainer.append(item);
    //-------------End Current Date----------------
    
    //-------------Temperature---------------------
    let currentTemperature = document.getElementById("current_temperature");
    let temperatureItem = document.createElement("p");
    temperatureItem.classList.add("big_font");
    temperatureItem.classList.add("centered-text");
    const windDirectionStr = getDirectionWind(windDirection);
    temperatureItem.innerHTML= `t\u00B0: ${temperature} ${temperatureUnit} <br> ${windDirectionStr} ${windSpeed} ${windSpeedUnit} <br>💧: ${humidity}${humidityUnit}`;
    currentTemperature.append(temperatureItem);
    //-------------End Temperature---------------------
    
    //-------------Start Weather Code------------------
    let currentWeather = document.getElementById("current_weather_code");
    let imgItem = document.createElement("p");
    imgItem.classList.add("centered-text");
    imgItem.classList.add("big_font");
    const imgUrl = getImageWeatherCode(weatherCode); 
    const descImg = getDescriptionWeatherCode(weatherCode); 
    imgItem.innerHTML = `<img src="${imgUrl}" alt="${descImg}"/>`;
    imgItem.innerHTML += `<br> <p>${descImg}</p>`;
    currentWeather.append(imgItem);
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

  const urlCurrentData =  `${apiUrl}?latitude=${latitude}&longitude=${longitude}&current=${current}&temperature_unit=fahrenheit`;
  const urlForecastData = `${apiUrl}?latitude=${latitude}&longitude=${longitude}&daily=${daily}&start_date=${startDate}&end_date=${endDate}&temperature_unit=fahrenheit`;

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

