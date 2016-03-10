module.exports = angular.module('app.home', [
])
  .controller('HomeController', function($scope, user){
    // console.log("user: ", user);
  })
  .config(function($routeProvider){
    $routeProvider.when('/home', {
      templateUrl: 'home/template.html',
      controller: 'HomeController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  })
