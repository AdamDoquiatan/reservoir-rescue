var weather = 20;
var weatherInitialized = false;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success);			// if geolocation supported, call function
} else {
  weather = 20;
  weatherInitialized = true;
};

// function to get lat/long and plot on a google map
function success(position) {
  var lat = position.coords.latitude;							// set latitude variable
  var lng	= position.coords.longitude;						// set longitude variable

  getWeather(lat,lng);											      // get weather for the lat/long
};

// Key code for the weather API
var key = "d168d702f072e23805f64c65b6c88b9f";

function getWeather(lat,lng) {
  if(lat != '' && lng != '') {
    $.getJSON( "https://api.openweathermap.org/data/2.5/weather?id=524901&APPID="+key+"&lat="+lat+"&lon="+lng+"&units=metric", function(data) {	// add '&units=imperial' to get U.S. measurements
    console.log(data);
    weather = Math.round(data.main.temp);
    weatherInitialized = true;
    });
  } else {
    weather = 20;
    weatherInitialized = true;
  }
}