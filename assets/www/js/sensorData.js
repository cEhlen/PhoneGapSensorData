(function(window) {
	"use strict";

	/**
	 * A little helper function to shorten document.getElementById
	 * @param  {string} id The element id
	 * @return {DOM Element}    The dom element with the given Id
	 */
	var get = function (id) {
		return document.getElementById(id);
	};

	// ###################################### COMPAS ######################################

	var compassWatchId = null;

	/**
	 * Initialize the compass watch so we get the degree
	 * @param  {int} freq The update frequency in ms
	 */
	var initCompass = function (freq) {
		freq = freq || 100;
		var options = { frequency: freq };
		if(!compassWatchId) {
			compassWatchId = navigator.compass.watchHeading(onSuccessClosure(), onError, options);
		} else {
			alert("Error!");
		}
	};

	/**
	 * Creates the closure for the success function and retruns given function
	 * @return {Function} The onSuccess function
	 */
	var onSuccessClosure = function () {
		var lastTime = Date.now();
		return function (heading) {
			get("magneticHeading").innerHTML = heading.magneticHeading;
			get("trueHeading").innerHTML = heading.trueHeading;
			get("headingAccuracy").innerHTML = heading.headingAccuracy;
			var dt = heading.timestamp - lastTime;
			if(dt !== 0) {
				get("timestampCompass").innerHTML = dt;
			}
			lastTime = heading.timestamp;
		};
	};

	/**
	 * Compass error handler
	 * @param  {compassError} compassError Passed by PhoneGap
	 */
	var onError = function (compassError) {
		get("magneticHeading").innerHTML = "Error! " + compassError.code;	
	};

	// ###################################### ACCELEROMETER ######################################
	
	var accWatchId = null;

	var initAcc = function (freq) {
		freq = freq || 10000;
		var options = { frequency: freq }
		if(!accWatchId) {
			accWatchId = navigator.accelerometer.watchAcceleration(onSuccessClosureAcc(), onErrorAcc, options);
		}
	};

	var onSuccessClosureAcc = function () {
		var lastTime = Date.now();
		return function (acceleration) {
			get("accX").innerHTML = acceleration.x;
			get("accY").innerHTML = acceleration.y;
			get("accZ").innerHTML = acceleration.z;
			var dt = acceleration.timestamp - lastTime;
			if(dt !== 0) {
				get("timestampAcc").innerHTML = dt;
			}
			lastTime = acceleration.timestamp;
		};
	};

	var onErrorAcc = function () {
		alert("Error! ACCELEROMETER!")	
	};

	// ###################################### GEOLOCATION ######################################
	
	var geoWatchId = null;

	var initGeo = function () {
		var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
		if(!geoWatchId) {
			geoWatchId = navigator.geolocation.watchPosition(onSuccessClosureGeo(), onErrorGeo, options);
		}
	};

	var onSuccessClosureGeo = function () {
		var lastTime = Date.now();
		return function (position) {
			get("latitude").innerHTML = position.coords.latitude;
			get("longitude").innerHTML = position.coords.longitude;
			get("altitude").innerHTML = position.coords.altitude;
			get("accuracy").innerHTML = position.coords.accuracy;
			get("altitudeAccuracy").innerHTML = position.coords.altitudeAccuracy;
			get("heading").innerHTML = position.coords.heading;
			get("speed").innerHTML = position.coords.speed;
			var dt = position.timestamp - lastTime;
			if(dt !== 0) {
				get("timestampGeo").innerHTML = dt;
			}
			lastTime = acceleration.timestamp;
		};
	};

	var onErrorGeo = function () {
		alert("Error! GEOLOCATION!")	
	};

	// ###################################### CONNECTION ######################################

	/**
	 * Initializes the connection checker.
	 * @param  {Integer} interval The check interval in ms
	 */
	var initCheckConnection = function (interval) {
		interval = interval || 1000;
		var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        var lastTime = Date.now();
        var checkConnection = function () {
			var networkState = navigator.connection.type;
			get("connectionStatus").innerHTML = states[networkState];
			var now = Date.now();
			var dt = now - lastTime;
			get("timestampConnection").innerHTML = dt;
			lastTime = now;
			setTimeout(checkConnection, interval)
		}
		checkConnection();
	};

	// ###################################### DEVICE ######################################
	
	var initDevice = function () {
		get("deviceName").innerHTML = window.device.name;
		get("cordVer").innerHTML = window.device.cordova;
		get("platform").innerHTML = window.device.platform;
		get("uuid").innerHTML = window.device.uuid;
		get("ver").innerHTML = window.device.version;
		get("model").innerHTML = window.device.model;
	};

	window.sensorData = {
		initCompass: initCompass,
		initCheckConnection: initCheckConnection,
		initAcc: initAcc,
		initDevice: initDevice,
		initGeo: initGeo
	};

})(window);