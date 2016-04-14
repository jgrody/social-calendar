module.exports = function($rootScope, Auth, $location, DB){
  "ngInject";

  Auth.$onAuth(function(user) {
    $rootScope.loggedInUser = user;

    if (!user){
      $location.path('/login');
    }

    if (user && $location.$$path == '/login') {
      $location.path('/home');
    }

  });
}
