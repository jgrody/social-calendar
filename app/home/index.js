module.exports = angular.module('app.home', [
])
  .controller('HomeController', function($scope, user, facebookService){
    window.user = user;
    facebookService.getMyLastName(user)
      .then(function(data){
        console.log("data: ", data);

      })
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
