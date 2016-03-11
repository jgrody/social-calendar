module.exports = angular.module('app.schedule', [
])
  .controller('ScheduleController', function($scope, user){
    console.log("user: ", user);
  })
  .config(function($routeProvider){
    $routeProvider.when('/schedule', {
      templateUrl: 'schedule/template.html',
      controller: 'ScheduleController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  })
