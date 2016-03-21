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

    // $scope.events = [
    //   {
    //     title: 'An event',
    //     type: 'warning',
    //     startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
    //     endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
    //     draggable: true,
    //     resizable: true
    //   }, {
    //     title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
    //     type: 'info',
    //     startsAt: moment().subtract(1, 'day').toDate(),
    //     endsAt: moment().add(5, 'days').toDate(),
    //     draggable: true,
    //     resizable: true
    //   }, {
    //     title: 'This is a really long event title that occurs on every year',
    //     type: 'important',
    //     startsAt: moment().startOf('day').add(7, 'hours').toDate(),
    //     endsAt: moment().startOf('day').add(19, 'hours').toDate(),
    //     recursOn: 'year',
    //     draggable: true,
    //     resizable: true
    //   }
    // ];

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
