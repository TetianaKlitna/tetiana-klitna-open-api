function displayLocation(latitude, longitude){

  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json(); 
  })
  .then(data => {

    console.log(data);
    
    let ulItem  = document.getElementById("weather_hourly").querySelector("ul");
    ulItem.style.listStyle = "none";

    const today = new Date(data.current.time);
    const temperature = data.current.temperature_2m;
    const windSpeed = data.current.wind_speed_10m;
    
    const temperatureUnit = data.current_units.temperature_2m;
    const windSpeedUnit = data.current_units.wind_speed_10m;

    // Get the time zone offset in minutes
    //negative value because getTimezoneOffset returns the offset to UTC
    const offsetInMinutes = -new Date().getTimezoneOffset();
    var local = new Date(today.getTime() + offsetInMinutes * 60000);
  
    const titleItem = document.createElement("li");
    titleItem.innerHTML = `<p>Today is ${local.toLocaleDateString()}.</p>`+
    `<p>Temperature is ${temperature} ${temperatureUnit}.</p>` + 
    `<p>Wind speed is ${windSpeed} ${windSpeedUnit}</p>`; 
     
    ulItem.append(titleItem);


  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
}

function successCallback(position){

  var lat = position.coords.latitude;
  var long = position.coords.longitude;

  displayLocation(lat, long);
}

function errorsCallBack(err){
    console.error(`ERROR(${err.code}): ${err.message}`);
}

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(successCallback, errorsCallBack);
}else{
  console.error("Your browser does not support geolocation.");
}
