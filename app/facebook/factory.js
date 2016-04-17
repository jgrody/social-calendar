module.exports = function($q, authFactory, ezfb, DB){
  "ngInject";

  var user = authFactory.getUser();

  function extendParams(options){
    options = options || {};
    return angular.extend({}, options, {
      access_token: user.facebook.accessToken
    })
  }

  function request(){
    var deferred = $q.defer();
    var args = [].slice.call(arguments);

    // Vars set to retrieve position of params and the callback
    // function in the passed in arguments. Reason for this is that
    // passing the method is optional so there will either be 3 arguments
    // or there will be 4 to specify a method other than 'GET'
    var paramsIndex = (args.length > 3) ? 2 : 1;
    var callbackIndex = (args.length > 3) ? 3 : 2;

    // We are:
    // 1). extending params to include the access_token on every request
    // 2). modifying the callback to utilize our deferred object
    args[paramsIndex] = extendParams(args[paramsIndex]);
    args[callbackIndex] = function(res){
      if (!res || res.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(res);
      }
    }

    ezfb.api.apply(null, args);
    return deferred.promise;
  }

  function calculateStarttimeDifference(currentTime, dataString) {
    return (new Date(dataString).getTime()-(currentTime*1000))/1000;
  }

  function compareVenue(a,b) {
    if (a.venueName < b.venueName) {
      return -1;
    }
    if (a.venueName > b.venueName) {
      return 1;
    }
    return 0;
  }

  function compareTimeFromNow(a,b) {
    if (a.eventTimeFromNow < b.eventTimeFromNow) {
      return -1;
    }
    if (a.eventTimeFromNow > b.eventTimeFromNow) {
      return 1;
    }
    return 0;
  }

  function compareDistance(a,b) {
    var aEventDistInt = parseInt(a.eventDistance, 10);
    var bEventDistInt = parseInt(b.eventDistance, 10);

    if (aEventDistInt < bEventDistInt) {
      return -1;
    }
    if (aEventDistInt > bEventDistInt) {
      return 1;
    }
    return 0;
  }

  function comparePopularity(a,b) {
    if ((a.eventStats.attendingCount + (a.eventStats.maybeCount / 2)) < (b.eventStats.attendingCount + (b.eventStats.maybeCount / 2))) {
      return 1;
    }
    if ((a.eventStats.attendingCount + (a.eventStats.maybeCount / 2)) > (b.eventStats.attendingCount + (b.eventStats.maybeCount / 2))) {
      return -1;
    }
    return 0;
  }

  function haversineDistance(coords1, coords2, isMiles) {
    //coordinate is [latitude, longitude]
    function toRad(x) {
      return x * Math.PI / 180;
    }

    var lon1 = coords1[1];
    var lat1 = coords1[0];

    var lon2 = coords2[1];
    var lat2 = coords2[0];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if(isMiles) d /= 1.60934;

    return d;
  }


  return {
    getEvents: function(params) {
      // Help from https://github.com/tobilg/facebook-events-by-location

      var idLimit = 50; //FB only allows 50 ids per /?ids= call
      var currentTimestamp = (new Date().getTime()/1000).toFixed();
      var venuesCount = 0;
      var venuesWithEvents = 0;
      var eventsCount = 0;

      var eventFields = [
        "id",
        "name",
        "cover.fields(id,source)",
        "picture.type(large)",
        "location",
        "events.fields(id,name,cover.fields(id,source),picture.type(large),description,start_time,attending_count,declined_count,maybe_count,noreply_count).since("+currentTimestamp+")"
      ]

      return request('/search?', {
        q: params.query || "",
        center: [
          params.location.latitude,
          params.location.longitude
        ].join(','),
        type: 'place',
        distance: 25000,
        limit: 1000,
        fields: 'id'
      }).then(function(response){
        var ids = [];
        var tempArray = [];
        var data = response.data;

        //Create array of 50 places each
        angular.forEach(data, function(idObject, key){
          tempArray.push(idObject.id);
          if (tempArray.length >= idLimit) {
            ids.push(tempArray);
            tempArray = [];
          }
        })

        // Push the remaining places
        if (tempArray.length > 0) {
          ids.push(tempArray);
        }

        return ids;
      }).then(function(ids){
        var urls = [];

        //Create a Graph API request array (promisified)
        angular.forEach(ids, function(idArray){
          urls.push(
            request("/?ids=" + idArray.join(",") + "&fields=" + eventFields.join(","))
          )
        })

        return urls;

      }).then(function(requests){
        return $q.all(requests)
      }).then(function(results){
        var events = [];

        results.forEach(function(result, index, arr) {
          Object.getOwnPropertyNames(result).forEach(function(venueId, index, array) {
            var venue = result[venueId];
            if (venue.events && venue.events.data.length > 0) {
              venuesWithEvents++;
              angular.forEach(venue.events.data, function(event){
                var eventResultObj = {};
                eventResultObj.venueId = venueId;
                eventResultObj.venueName = venue.name;
                eventResultObj.venueCoverPicture = (venue.cover ? venue.cover.source : null);
                eventResultObj.venueProfilePicture = (venue.picture ? venue.picture.data.url : null);
                eventResultObj.venueLocation = (venue.location ? venue.location : null);
                eventResultObj.eventId = event.id;
                eventResultObj.name = event.name;
                eventResultObj.coverPicture = (event.cover ? event.cover.source : null);
                eventResultObj.profilePicture = (event.picture ? event.picture.data.url : null);
                eventResultObj.description = (event.description ? event.description : null);
                eventResultObj.startsAt = (event.start_time ? event.start_time : null);

                // Passing true converts units to miles, pass false for km
                eventResultObj.distance = (venue.location ? (haversineDistance([
                  venue.location.latitude, venue.location.longitude
                ], [ params.location.latitude, params.location.longitude ], true)*1000).toFixed() : null);

                eventResultObj.timeFromNow = calculateStarttimeDifference(currentTimestamp, event.start_time);
                eventResultObj.stats = {
                  attendingCount: event.attending_count,
                  declinedCount: event.declined_count,
                  maybeCount: event.maybe_count,
                  noreplyCount: event.noreply_count
                };
                events.push(eventResultObj);
                eventsCount++;
              })
            }
          })
        })

        return events;
      });
    }
  }
}
