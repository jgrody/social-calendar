module.exports = function($firebaseArray, DB){
  "ngInject";

  var ref = DB('events').orderByChild('title');

  return $firebaseArray(ref)
}