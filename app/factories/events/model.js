// To be used for events coming back from the Facebook API

window.moment = require('moment/min/moment.min');

module.exports = function(Model, $firebaseObject, DB, authFactory, eventsRepository){
  "ngInject";

  var currentUser = authFactory.getUser();

  var Event = $firebaseObject.$extend({
    toJSON: function() {},

    $$updated: function(){
      var self = this;
      var changed = $firebaseObject.prototype
      .$$updated.apply(this, arguments);

      if (changed){}

      return changed;
    },

    removeFromCalendar: function(){
      return eventsRepository.removeFromCalendar(this);
    }
  });

  return function(eventId){
    var eventsRef = DB('events');
    var eventRef = eventsRef.child(eventId);

    var event = new Event(eventRef);
    return event.$loaded().then(function(data){
      if (data.startsAt) {
        data.startsAt = moment(data.startsAt).toDate()
      }
      if (data.endsAt) {
        data.endsAt = moment(data.endsAt).toDate()
      }

      return data;
    })
  }
}
