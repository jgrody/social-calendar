require('angular-ui-bootstrap');
require('angular-bootstrap-calendar');
window.moment = require('moment/min/moment.min');

module.exports = angular.module('app.calendar', [
  'ui.bootstrap',
  'mwl.calendar',
  require('factories').name
])
  .controller('CalendarController', function($scope, currentUser, DB, EventCollection){
    window.db = DB;
    window.scope = $scope;

    EventCollection.$loaded().then(mapEvents);

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

    function mapEvents(data){
      $scope.events = data.map(function(e){
        if (e.owners && e.owners[currentUser.uid]) {
          e.startsAt = moment(e.startsAt).toDate();
          return e;
        }
      }).compact();
    }
  })
  .config(function($routeProvider){
    $routeProvider.when('/calendar', {
      templateUrl: 'calendar/template.html',
      controller: 'CalendarController',
      resolve: {
        currentUser: ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  })
