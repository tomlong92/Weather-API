// _____________________________________________________________________________
// Set up API requests

// Get the 15 day forecast for the location
var owmEndpoint = "http://api.openweathermap.org/data/2.5/forecast/daily";
var owmParameters = {
	"mode": "json",
	"units": "imperial",
	"cnt": "15",
	"appid": "a50c6ea2b89ef47f2b4da5cbb3c8b2ff"
}

// Search for photos from the location
var flickrEndpoint = "https://api.flickr.com/services/rest/";
var flickrParameters = {
	"method": "flickr.photos.search",
	"api_key": "0e9a3b35d1051515bd41a61b8250c175",
	"format": "json",
	"per_page": "20",
	"page": "1",
	"nojsoncallback": "1",
	"media": "photos",
	"sort": "interestingness-desc",
	"extras": "url_z"
};

// _____________________________________________________________________________
// Get elements from the DOM

var form = document.getElementById("city-search-form");
var wrapDiv = document.getElementById("wrap");
var weatherCard = document.querySelector(".weather-card");
var weatherCardWrap = document.getElementById("weather-cards-wrap");
var weatherBackground = document.getElementById("background");
weatherCardWrap.removeChild(weatherCard);

// _____________________________________________________________________________
// Set up the events so that the APIs are called when a query is entered 
// into the form

form.onsubmit = function (event) {
	event.preventDefault();
	var cityName = form.elements["city-name"].value;
	owmParameters.q = cityName;
	var owmApiCaller = new ApiCaller(owmEndpoint, owmParameters);
	owmApiCaller.getJson(processWeatherReport);
	flickrParameters.text = cityName;
	var flickrApiCaller = new ApiCaller(flickrEndpoint, flickrParameters);
	flickrApiCaller.getJson(processFlickr);
}

form.elements["city-name"].oninput = clearWeatherReport;
form.elements["city-name"].focus();

// _____________________________________________________________________________
// Weather Reporting Functions

function clearWeatherReport() {
	weatherCardWrap.innerHTML = "";
}

function processWeatherReport (jsonResponse) {
	// Clear the screen
	clearWeatherReport();
	// Loop through the daily reports
	var dailyReports = jsonResponse.list;
	var numDays = dailyReports.length;
	for (var i = 0; i < numDays; i += 1) {
		var dayReport = dailyReports[i];
		// Pull data from the daily report
		var highTemp = Math.round(dayReport.temp.max);
		var lowTemp = Math.round(dayReport.temp.min);
		var weatherId = dayReport.weather[0].id;
		var windSpeed = mphToBeaufort(dayReport.speed);
		var windDir = dayReport.deg;
		// Calculate the date
		var date = new Date(dayReport.dt * 1000);
		var day = dayNumToString(date.getDay());
		// Clone the template
		var clonedCard = weatherCard.cloneNode(true);
		// Fill out the clone
		clonedCard.querySelector(".day").textContent = day;
		clonedCard.querySelector(".max-temp").textContent = highTemp;
		clonedCard.querySelector(".min-temp").textContent = lowTemp;
		// Get the fontawesome icons
		var weatherIcon = clonedCard.querySelector(".weather");
		var windDirIcon = clonedCard.querySelector(".wind-dir");
		var windSpeedIcon = clonedCard.querySelector(".wind-speed");
		// Update the fontawesome icons
		weatherIcon.className = "weather wi wi-owm-" + weatherId;
		windDirIcon.className = "wind-dir wi wi-wind towards-" + windDir + "-deg";
		windSpeedIcon.className = "wind-speed wi wi-wind-beaufort-" + windSpeed;	
		// Add the clone to the page
		weatherCardWrap.appendChild(clonedCard);
	}
}

function dayNumToString(d) {
	if (d === 0) return "SUN";
	if (d === 1) return "MON";
	if (d === 2) return "TUE";
	if (d === 3) return "WED";
	if (d === 4) return "THU";
	if (d === 5) return "FRI";
	if (d === 6) return "SAT";
}

function mphToBeaufort(mph) {
	if (mph < 0.7) return 0;
	if (mph < 3.4) return 1;
	if (mph < 7.4) return 2;
	if (mph < 12.2) return 3;
	if (mph < 17.9) return 4;
	if (mph < 24.1) return 5;
	if (mph < 31) return 6;
	if (mph < 38.4) return 7;
	if (mph < 46.3) return 8;
	if (mph < 54.8) return 9;
	if (mph < 63.9) return 10;
	if (mph < 72.9) return 11;
	return 12;
}

// _____________________________________________________________________________
// Flickr Grabbing Functions

function processFlickr(jsonResponse) {
	var searchResults = jsonResponse.photos.photo;
	// Pick a random image
	var numResults = searchResults.length;
	var randomIndex = Math.floor(Math.random() * numResults);
	var randomResult = searchResults[randomIndex];
	var photoURL = randomResult.url_z;
	// Update the background image
	weatherBackground.style.backgroundImage = "url('" + photoURL + "')";
}
