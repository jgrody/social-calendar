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
      event.startsAt = event.start_time || null;
      event.endsAt = event.end_time || null;
      event.title = event.name || null;

      data = Object.reject(event, '$$hashKey', 'start_time', 'end_time', 'name');

      return DB('events', event.id).update(data);
    },

    removeFromCalendar: function(event){
      return $q.all([
        DB('events', event.id, 'owners', currentUser.uid).set(null),
        DB('users', currentUser.uid, 'events', event.id).set(null)
      ])
    }
  }
}
