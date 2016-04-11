module.exports = angular.module('app.home', [
  require('modules/sanitized').name,
  require('modules/truncate').name,
  require('factories').name,
])
  .controller('HomeController',
    function($scope, currentUser, facebookService, DB, eventsRepository, $mdToast, $timeout){
    "ngInject";

    window.db = DB;
    window.scope = $scope;

    $scope.options = {};

    DB('events').on('child_added', function(snapshot){
      var event = snapshot.val();
      setOwnership(event);
    })

    $scope.search = function(query){
      $scope.fetching = facebookService.getEvents({
        query: query || $scope.options.search
      })
      .then(function(response){
        console.log('resp:', response);
        $scope.events = response.map(mapEventModels);
      })
      .finally(function(){
        delete $scope.fetching;
      })
    }
    $scope.search();

    navigator.geolocation.getCurrentPosition(
      function(position) {
        DB('users', currentUser.uid, 'location').update({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      function(error){
        console.log(error.message);
      }, {
        enableHighAccuracy: true
        ,timeout : 5000
      }
    );

    $scope.addToCalendar = function(event){
      $timeout(function(){
        eventsRepository.addToCalendar(event)
          .then(function(){
            DB('events', event.eventId, 'owners', currentUser.uid).set(true);
            DB('users', currentUser.uid, 'events', event.eventId).set(true);
            event.belongsToCurrentUser = true;
          })
          .then(function(){
            $mdToast.show(
              $mdToast.simple()
              .textContent(event.name + ' has been added to your calendar')
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
              .textContent(event.name + ' has been removed from your calendar')
              .hideDelay(3000)
            );
          })
      })
    }

    function setOwnership(event){
      DB('users', currentUser.uid, 'events', event.eventId)
        .once('value', function(userIndexRef){
          if (userIndexRef.exists()) {
            event.belongsToCurrentUser = true;
          }
        })
    }

    function mapEventModels(event){
      setOwnership(event);
      return event;
    }

  })
  .config(function($routeProvider){
    $routeProvider.when('/home', {
      templateUrl: 'home/template.html',
      controller: 'HomeController',
      resolve: {
        currentUser: ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  })
