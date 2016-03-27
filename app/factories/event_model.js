// To be used for events coming back from the Facebook API

module.exports = function(Model, DB, authFactory){
  "ngInject";

  var currentUser = authFactory.getUser();

  return Model.extend({
    set: function(data, options){
      data = data || {}

      var self = this;

      Model.prototype.set.call(this, data, options);

      this.ref = DB('events');
      this.ownerIndexRef = this.ref
        .child(this.attrs.id)
        .child('owners')
        .child(currentUser.uid)

      this.userIndexRef = DB('users')
        .child(currentUser.uid)
        .child('events')
        .child(this.attrs.id)

      this.ref.on('child_added', function(eventSnapshot){
        // Example ref: 1234/owners/facebook:5678
        // Setting currentUser to be set as an owner of this event
        self.userIndexRef.once('value', function(indexSnapshot){
          if (indexSnapshot.exists()) {
            self.ownerIndexRef.set(true);
          }
        })
      })

      self.ownerIndexRef.on('value', function(snapshot){
        if (snapshot.exists()) {
          self.belongsToCurrentUser = true;
        }
      })
    },

    // Result would look something like:
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
    addToCalendar: function(){
      var self = this;

      return this.ref.child(this.attrs.id).update({
        title: this.attrs.name,
        description: this.attrs.description,
        startsAt: moment(this.attrs.start_time).toDate()
      }).then(function(){
        // Doing this here, rather than on 'child_changed' because it clashes
        // on remove, when trying to set to null, setOwner reverts it right back to true
        self.ownerIndexRef.set(true);
        self.userIndexRef.set(true);

        // Flip switch to show view link
        self.belongsToCurrentUser = true;
      })
    },

    removeFromCalendar: function(){
      var self = this;
      
      return this.ownerIndexRef.set(null)
        .then(function(){
          self.userIndexRef.set(null);
          self.belongsToCurrentUser = false;
        })
    }
  })
}