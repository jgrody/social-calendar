require('angular-ui-bootstrap');
require('angular-bootstrap-calendar');
window.moment = require('moment/min/moment.min');

module.exports = angular.module('app.home', [
  require('modules/sanitized').name,
  require('modules/truncate').name,
  require('factories').name,
  'mwl.calendar'
]).controller('HomeController', function($scope, currentUser, facebookService,
              DB, eventsRepository, $mdToast, $timeout, calendarConfig){
    "ngInject";

    $scope.options = {};
    $scope.options.hasFetched = false;

    $scope.calendarViewOptions = ['day'];
    $scope.calendarView = 'day';
    $scope.calendarDate = new Date();

    $scope.search = function(query){
      $scope.options.fetching = true;
      $scope.events = [];

      facebookService.getEvents({
        query: query || $scope.options.search,
        location: currentUser.location
      })
      .then(function(events){
        $scope.events = [];

        events.each(function(event){
          if (event.startsAt) {
            event.startsAt = moment(event.startsAt).toDate()
          }
          if (event.endsAt) {
            event.endsAt = moment(event.endsAt).toDate()
          }

          $scope.events.push(event)
          $scope.events.map(mapEventModels)
        })
      })
      .finally(function(){
        $scope.options.hasFetched = true;
        delete $scope.options.fetching;
      })
    }

    currentUser.$loaded().then(function(){
      $scope.search();
    })

    $scope.addToCalendar = function(event){
      $timeout(function(){
        eventsRepository.addToCalendar(event)
          .then(function(){
            DB('events', event.eventId, 'owners', currentUser.$id).set(true);
            DB('users', currentUser.$id, 'events', event.eventId).set(true);
            event.belongsToCurrentUser = true;
          })
          .then(function(){
            $mdToast.show(
              $mdToast.simple()
              .textContent('Event added.')
              .hideDelay(3000)
            );
          })
      }, 0)
    }

    $scope.removeFromCalendar = function(event){
      $timeout(function(){
        eventsRepository.removeFromCalendar(event)
          .then(function(){
            delete event.belongsToCurrentUser;
          })
          .then(function(){
            $mdToast.show(
              $mdToast.simple()
              .textContent('Event removed.')
              .hideDelay(3000)
            );
          })
      })
    }
    $scope.eventClicked = function(event){
      if (event.belongsToCurrentUser){
        $scope.removeFromCalendar(event);
      } else {
        $scope.addToCalendar(event);
      }
    }

    function mapEventModels(event){
      // Determines if user owns event or not
      DB('users', currentUser.$id, 'events', event.eventId)
        .once('value', function(userIndexRef){
          if (userIndexRef.exists()) {
            $timeout(function () {
              event.belongsToCurrentUser = true;
            });
          }
        })

      return event;
    }
  })
  .config(function($provide){
    function attachBindings(directive){
      directive.$$isolateBindings['fetching'] = {
        attrName: 'fetching',
        mode: '=',
        optional: true
      };

      directive.$$isolateBindings['hasFetched'] = {
        attrName: 'hasFetched',
        mode: '=',
        optional: true
      };

      return directive;
    }

    $provide.decorator('mwlCalendarDirective', function($delegate) {
      var directive = $delegate[0];
      directive.templateUrl = 'calendar/templates/calendar.html';
      attachBindings(directive);
      return $delegate;
    });

    $provide.decorator('mwlCalendarDayDirective', function($delegate) {
      var directive = $delegate[0];
      directive.templateUrl = 'calendar/templates/day-view.html';
      attachBindings(directive);
      return $delegate;
    });
  })
  .config(function($routeProvider){
    $routeProvider.when('/home', {
      templateUrl: 'home/template.html',
      controller: 'HomeController',
      resolve: {
        currentUser: ['Auth', 'UserModel', function (Auth, UserModel) {
          var auth = Auth.$getAuth();
          return Auth.$requireAuth() && new UserModel(auth.uid);
        }],
      }
    });
  })
