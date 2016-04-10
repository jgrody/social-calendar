module.exports = function($firebaseArray, DB){
  "ngInject";

  var ref = DB('events');

  var List = $firebaseArray.$extend({
    $added: function(){
      var added = $firebaseArray.prototype
      .$$added.apply(this, arguments);

      console.log('added: ', added);
    },
    $$updated: function(){
      var changed = $firebaseArray.prototype
      .$$updated.apply(this, arguments);
      console.log('changed: ', changed);
    },
    getTotal: function (){
      console.log('this.$list: ', this.$list);
    }
  })

  return function(){
    return new List(ref);
  }
}
