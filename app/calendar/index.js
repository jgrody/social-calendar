module.exports = angular.module('app.calendar', [
])
  .controller('CalendarController', function($scope, user){
    // console.log("user: ", user);
  })
  .config(function($routeProvider){
    $routeProvider.when('/calendar', {
      templateUrl: 'calendar/template.html',
      controller: 'CalendarController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  })
