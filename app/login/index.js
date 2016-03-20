module.exports = angular.module('app.login', [
  require('modules/sanitized').name
])
  .controller('LoginController', function($scope){
  })
  .config(function($routeProvider){
    $routeProvider.when('/login', {
      templateUrl: 'login/template.html',
      controller: 'LoginController'
    });
  })
  .run(function(Auth, $location){
    Auth.$onAuth(function(user) {
      if (user){
        $location.path('/home');
      }
    });
  })

