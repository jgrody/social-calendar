require('angular-ui-bootstrap');
require('angular-bootstrap-calendar');
window.moment = require('moment/min/moment.min');

module.exports = angular.module('app.calendar', [
  'ui.bootstrap',
  'mwl.calendar'
])
  .controller('CalendarController', function($scope, user, DB, EventCollection){
    window.db = DB;
    window.scope = $scope;

    EventCollection.$loaded().then(mapDates);

    $scope.calendarViewOptions = ['year', 'month', 'week', 'day'];
    $scope.calendarView = 'month';
    $scope.calendarDate = new Date();

    $scope.toggleView = function(type){
      $scope.calendarView = type;
    }

    $scope.eventClicked = function(event){
      console.log("event: ", event);
    }

    $scope.eventDeleted = function(event){
      console.log("event: ", event);
    }

    $scope.eventEdited = function(event){
      console.log("event: ", event);
    }

    function mapDates(data){
      $scope.events = data.map(function(e){
        e.startsAt = moment(e.startsAt).toDate();
        return e;
      });
    }
  })
  .config(function($routeProvider){
    $routeProvider.when('/calendar', {
      templateUrl: 'calendar/template.html',
      controller: 'CalendarController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  })
