module.exports = function(Model, $firebaseObject, DB, authFactory, usersRepository){

  "ngInject";

  var currentUser = authFactory.getUser();

  var User = $firebaseObject.$extend({
    toJSON: function() {},

    $$defaults: {
      location: {
        city: null,
        state: null,
        longitude: null,
        latitude: null
      }
    },

    $$updated: function(){
      var self = this;
      var changed = $firebaseObject.prototype
      .$$updated.apply(this, arguments);

      if (changed){}

      return changed;
    }
  });

  return function(userId){
    var usersRef = DB('users');
    var userRef = usersRef.child(userId);

    return new User(userRef);
    // return user.$loaded().then(function(data){
    //   return data;
    // })
  }
}
