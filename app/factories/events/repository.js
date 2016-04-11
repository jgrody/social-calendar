module.exports = function(DB, authFactory, $q){
  "ngInject";

  // events: {
  //   "1234": {
  //     ...
  //     "owners": {
  //       "facebook:1234": true
  //     }
  //   }
  // }
  // users: {
  //   "facebook:1234": {
  //     "events": {
  //       "1234": true
  //     }
  //   }
  // }

  var currentUser = authFactory.getUser();

  return {
    addToCalendar: function(event){
      data = Object.reject(event, '$$hashKey');

      return DB('events', event.eventId).update(data);
    },

    removeFromCalendar: function(event){
      return $q.all([
        DB('events', event.eventId, 'owners', currentUser.uid).set(null),
        DB('users', currentUser.uid, 'events', event.eventId).set(null)
      ])
    }
  }
}
