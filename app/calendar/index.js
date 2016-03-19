require('angular-ui-bootstrap');
require('angular-bootstrap-calendar');

module.exports = angular.module('app.calendar', [
  'ui.bootstrap',
  'mwl.calendar'
])
  .controller('CalendarController', function($scope, user){
    window.scope = $scope;
    $scope.calendarView = 'month';
    $scope.calendarDate = new Date();
    // $scope.calendarTitle = 'Title, son!';

    $scope.toggleView = function(type){
      $scope.calendarView = type;
    }

    $scope.calendarViewOptions = ['year', 'month', 'week', 'day'];

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
