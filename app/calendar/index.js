require('angular-ui-bootstrap');
require('angular-bootstrap-calendar');
window.moment = require('moment/min/moment.min');

module.exports = angular.module('app.calendar', [
  'ui.bootstrap',
  'mwl.calendar',
  require('factories').name,
  require('calendar/events/show').name
])
  .controller('CalendarController',
    function($scope, currentUser, DB, EventCollection, calendarConfig, MyDialog, EventModel){

    calendarConfig.templates.calendarSlideBox = 'calendar/templates/slidebox.html';

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
      return MyDialog.show({
        controller: 'CalendarEventsShowModalController',
        templateUrl: 'calendar/events/show/template.html',
        parent: angular.element(document.body),
        locals: {
          event: event
        }
      })
    }

    $scope.eventDeleted = function(event){
      var event = new EventModel(event);
      event.removeFromCalendar();
    }

    $scope.eventEdited = function(event){
      console.log("event: ", event);
    }

    function mapEvents(data){
      $scope.events = data.map(function(e){
        if (e.owners && e.owners[currentUser.uid]) {
          e.startsAt = moment(e.startsAt).toDate();
          e.endsAt = moment(e.endsAt).toDate();
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
