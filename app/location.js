var $ = require('jquery');

module.exports = angular.module('app.location', [
])
  .run(function(DB, authFactory, $timeout){
    "ngInject"

    var currentUser = authFactory.getUser();

    var cache = null;

    function geoLocationError(error){
      if (error){
        jQfallback();
      }
    }

    function saveLocation(options){
      $timeout(function(){
        DB('users', currentUser.uid, 'location').update(options)
      })
    }

    var geoLocationOptions = {
      enableHighAccuracy: true,
      timeout : 5000,
      maximumAge: 5 * 60 * 1000
    }

    // https://gist.github.com/yckart/3719451
    function jQfallback(position){
      $.ajax({
        url: '//geoplugin.net/json.gp',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        error: function(){
          console.log('Error calling location callback');
        },
        success: function (data) {
          cache = {};
          cache.coords = {};
          var lat = cache.coords.latitude = data.geoplugin_latitude;
          var long = cache.coords.longitude = data.geoplugin_longitude;
          var city = cache.city = data.geoplugin_city;
          var state = cache.state = data.geoplugin_regionCode;

          saveLocation({
            latitude: lat,
            longitude: long,
            city: city,
            state: state
          });
        }
      });
    }


    if (navigator.geolocation){
      function save(position){
        saveLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      }

      navigator.geolocation
        .getCurrentPosition(save, geoLocationError, geoLocationOptions)

      navigator.geolocation.watchPosition(save)

    } else {
      navigator.geolocation = {
        getCurrentPosition: jQfallback,
        watchPosition: jQfallback,
        clearWatch: function(){
          cache = null;
        }
      }
    }
  })
