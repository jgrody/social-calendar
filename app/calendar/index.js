require('angular-material-calendar/dist/angular-material-calendar.min');

module.exports = angular.module('app.calendar', [
  "ngMaterial",
  "materialCalendar"
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
