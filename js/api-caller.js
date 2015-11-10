/*
	ApiCaller Constructor
*/

function ApiCaller(endpoint, parameters) {
	this.requestUrl = this.buildRequestUrl(endpoint, parameters);
}

ApiCaller.prototype.buildRequestUrl = function (endpoint, parameters) {
	// Loop through the key and values to construct the URL
	var queries = "";
	var parameterArray = Object.keys(parameters);
	for (i = 0; i < parameterArray.length; i += 1) {
		var parameterName = parameterArray[i];
		var parameterValue = parameters[parameterName];
		// Encode the key and values
		var encodeParameterValue = encodeURIComponent(parameterValue);
		var query = (parameterName + "=" + encodeParameterValue);
		if (i === parameterArray.length - 1) {
			var queries = (queries + query);
		}
		else {
			var queries = (queries + query + "&");
		}
		var url = (endpoint + "?" + queries);
	}
	return url;
}

ApiCaller.prototype.getJson = function (callback) {
	
	var myRequest = new XMLHttpRequest();
	myRequest.open("GET", this.requestUrl, true);
	myRequest.onreadystatechange = function() {
	if (this.readyState === 4 && this.status === 200) {
		var jsonResponse = JSON.parse(this.responseText);
		callback(jsonResponse);
	}
};

myRequest.send();
	
}
