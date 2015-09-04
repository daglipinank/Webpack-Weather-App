require("./style.css");
var $ = require("jquery");
var dayImg = require("./day.jpg");
var nightImg = require("./night.jpg");
$(document).ready(init);
var results;
var panelOpen = false;
function init() {
	$('body').css("background-img", "url("+dayImg+")");
	console.log("url("+dayImg+")");
	$('#go').click(goClicked);
	$('#goAuto').click(goClickedAuto);
	$('#zipSearch').click(goClickedZip);
	$('.btn1').click(showForecasts);
	$('.btn2').click(triggerImageDisplay);
	$('.btn3').click(showRadar);
}
function showRadar(){
	var promise = getAjaxWebcams(results.location.state + "/" + results.location.city);
	promise.success(onWebcamSuccess);
}
function onWebcamSuccess(data){
	console.log(data);
	
}
function showForecasts(){
	$('.outputweather').show();
	var forecast = results.forecast.simpleforecast.forecastday ;
	
	$('#0').text(forecast[1].date.weekday);
	$('#1').text(forecast[1].high.fahrenheit);
	$('#12').text(forecast[1].low.fahrenheit);
	$('#2').attr('src',forecast[1].icon_url);
	$('#3').text(forecast[1].icon);

	$('#4').text(forecast[2].date.weekday);
	$('#5').text(forecast[2].high.fahrenheit);
	$('#13').text(forecast[2].low.fahrenheit);
	$('#6').attr('src',forecast[2].icon_url);
	$('#7').text(forecast[2].icon);

	$('#8').text(forecast[3].date.weekday);
	$('#9').text(forecast[3].high.fahrenheit);
	$('#14').text(forecast[3].low.fahrenheit);
	$('#10').attr('src',forecast[3].icon_url);
	$('#11').text(forecast[3].icon);

	$('#forecastDay1').text(results.forecast.txt_forecast.forecastday[2].fcttext);
	$('#forecastDay2').text(results.forecast.txt_forecast.forecastday[4].fcttext);
	$('#forecastDay3').text(results.forecast.txt_forecast.forecastday[6].fcttext);
	
}
function goClickedZip() {
	var zip = $(".zip").val()
	var promise = callAjaxForecast(zip);
	$('.cont').hide();
	promise.success(ondataSuccess);
}
function goClickedAuto() {
	var promise = callAjaxForecast("autoip");
	$('.cont').hide();
	promise.success(ondataSuccess);
}
function goClicked(e) {
	var $state = $(".stateName").val();
	var $city = $(".cityName").val();
	var promise = callAjaxForecast($state+"/"+$city);
	$('.cont').hide();
	promise.success(ondataSuccess);
}
function ondataSuccess(data){ondataSuccess
	console.log('success data:', data);
	results = data;
	dispResults();
}
function callAjaxForecast(location){
	return $.getJSON("http://api.wunderground.com/api/d9e83152e7e5e110/geolookup/conditions/forecast/q/"+location+".json");
}
function getAjaxWebcams(location){
	return $.ajax("http://api.wunderground.com/api/d9e83152e7e5e110/radar/q/"+location+".gif?width=280&height=280&newmaps=1");
}
function dispResults() {
	$('.cont').show();
	$('.dispImages').empty();
	var hr = (new Date().getHours());
	console.log(hr);
	if(hr>12)
		{$('body').css("background-img", "url("+nightImg+")"); }
	var loc = results.current_observation.display_location;
	var loc2 = results.current_observation;
	$(".location").text(loc.full);
	$('.lat').text(loc.latitude);
	$('.long').text(loc.longitude);
	$('.elevation').text(loc.elevation);
	$(".dispTempF").text(loc2.temperature_string);
	$(".curricon").attr('src',loc2.icon_url);
	$('.curriconText').text(loc2.weather);
	$('.img4').attr('src',"http://api.wunderground.com/api/d9e83152e7e5e110/animatedradar/q/"+results.location.state + "/" + results.location.city+".gif?newmaps=1&timelabel=1&timelabel.y=10&num=5&delay=50");
	$('')
}
function triggerImageDisplay(){
	$('.dispImages').show();
	var flickrPromise = getFlickrJson(results.current_observation.display_location.full);
	var image = $('.dispImages');
	flickrPromise.success(function(data) {
		var imagesElements = data.items.map(function(o) { 
			return $("<img/>", { src: o.media.m,class:"img2" });
		});
		image.append(imagesElements);
	});
}
function getFlickrJson(location){
	return $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?&format=json&tags=" + encodeURI(location) + "&jsoncallback=?");
}