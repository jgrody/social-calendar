require('angular-ui-bootstrap');
require('angular-bootstrap-calendar');

module.exports = angular.module('app.calendar', [
  'ui.bootstrap',
  'mwl.calendar',
  require('factories').name,
  require('calendar/events/show').name
])
  .controller('CalendarController',
    function($scope, currentUser, DB, calendarConfig,
             MyDialog, EventModel, $timeout){

    window.scope = $scope;

    calendarConfig.templates.calendarSlideBox = 'calendar/templates/slidebox.html';

    $scope.calendarViewOptions = ['month', 'day'];
    $scope.calendarView = 'month';
    $scope.calendarDate = new Date();

    DB('users', currentUser.uid, 'events').on('value', function(userSnapshot){
      $scope.collection = [];

      angular.forEach(userSnapshot.val(), function(value, key){
        DB('events', key).once('value', function(eventSnapshot){
          new EventModel(eventSnapshot.val().eventId).then(function(event){
            $scope.collection.push(event);
          })
        })
      })
    })

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
      event.removeFromCalendar()
    }

    $scope.eventEdited = function(event){
      console.log("event: ", event);
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
