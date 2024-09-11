

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
    case 51:
    case 52:
    case 53:
      return 'Rainy';
    case 71:
    case 72:
    case 73:
      return 'Snowy';
    default:
      return 'Unknown weather code';
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
    case 51:
    case 52:
    case 53:
      return '../img/rainy.png';
    case 71:
    case 72:
    case 73:
      return '../img/snowy.png';
    default:
      return 'Unknown weather code';
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

  // Format the date as "January, 1 2024"
  return `${months[month]},${day} ${year}`;
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

function displayLocation(latitude, longitude){

  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weathercode&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode`;
  fetchData(url);
}

function fetchData(url){
 
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json(); 
  })
  .then(data => {

    document.getElementById('spinner').style.display = 'block';

    console.log(data);

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

    //-------------Weather Variables------------------
    // let ulItem  = document.getElementById("weather_variables").querySelector("ul");
    // ulItem.style.listStyle = "none";
    // const itemLi = document.createElement("li");
    // // const windUrl = '../img/wind.png';
    // // itemLi.innerHTML = `<img src="${windUrl}" alt="wind logo"/>`; 
    // itemLi.innerText = `Wind: ${windSpeed} ${windSpeedUnit}`;
    // ulItem.append(itemLi);

    //-------------End Weather Variables--------------
  
    // titleItem.innerHTML = `<p>Today is ${local.toLocaleDateString()}.</p>`+
    // `<p>Temperature is ${temperature} ${temperatureUnit}.</p>` + 
    // `<p>Wind speed is ${windSpeed} ${windSpeedUnit}</p>`; 
     


  })
  .catch(error => {
    console.error('An error occurred:', error);
  })
  .finally(() => {
    document.getElementById('spinner').style.display = 'none';
  });
}

function convertToCelsius(){
  clearFetchedFata();
  displayLocation(latitude, longitude);
}

function convertToFahrenheit(){
  clearFetchedFata();
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weathercode&temperature_unit=fahrenheit&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode`;
  fetchData(url);
}

function successCallback(position){

  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  displayLocation(latitude, longitude);
}

function errorsCallBack(err){
    console.error(`ERROR(${err.code}): ${err.message}`);
}

var latitude;
var longitude;

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(successCallback, errorsCallBack);
}else{
  console.error("Your browser does not support geolocation.");
}
