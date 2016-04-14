module.exports = function($firebaseArray, DB){
  "ngInject";

  var ref = DB('users');

  var List = $firebaseArray.$extend({
    $added: function(){
      var added = $firebaseArray.prototype
      .$$added.apply(this, arguments);

      console.log('added: ', added);
    },
    $$updated: function(){
      var changed = $firebaseArray.prototype
      .$$updated.apply(this, arguments);
    }
  })

  return function(){
    return new List(ref);
  }
}
