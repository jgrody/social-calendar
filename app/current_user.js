module.exports = function($rootScope, Auth, $location){
  "ngInject";

  Auth.$onAuth(function(user) {
    $rootScope.currentUser = user;

    if (!user){
      $location.path('/login');
    }

    if (user && $location.$$path == '/login') {
      $location.path('/home');
    }

  });
}
