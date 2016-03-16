module.exports = angular.module('app.login', [
  require('modules/sanitized').name
])
  .controller('LoginController', function($scope){
  })
  .config(function($routeProvider){
    $routeProvider.when('/login', {
      templateUrl: 'login/template.html',
      controller: 'LoginController',
      // resolve: {
      //   user: ['Auth', function (Auth) {
      //     return Auth.$waitForAuth();
      //   }]
      // }
    });
  })
