// To be used for events coming back from the Facebook API

module.exports = function(Model, DB, authFactory){
  "ngInject";

  var currentUser = authFactory.getUser();

  return Model.extend({
    set: function(data, options){
      data = data || {}

      var self = this;

      Model.prototype.set.call(this, data, options);

      this.ref = DB('events/' + this.attrs.id + '/owners/'+ currentUser.uid);
      this.ref.once('value', function(snapshot){
        if (snapshot.val() != null) {
          self.belongsToCurrentUser = true;
        }
      })
    }
  })
}