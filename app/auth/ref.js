module.exports = function($firebaseAuth, FBURL){
  "ngInject";

  var ref = new Firebase(FBURL);
  return $firebaseAuth(ref);
}