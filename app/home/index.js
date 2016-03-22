module.exports = angular.module('app.home', [
  require('modules/sanitized').name,
  require('modules/truncate').name,
  require('factories').name,
])
  .controller('HomeController', function($scope, currentUser, facebookService, DB, EventModel){
    "ngInject";

    window.scope = $scope;
    $scope.options = {};

    // Result would look something like:
    // events: {
    //   "owners": {
    //     "facebook:1234": true
    //   }
    // }
    var eventsRef = DB('events');
    eventsRef.on('child_added', setOwner);


    // ###################
    // SCOPE FUNCTIONS
    // ###################
    $scope.search = function(){
      $scope.fetching = facebookService.getEvents({
        query: $scope.options.search
      })
      .then(function(response){
        $scope.events = response.data.map(mapEventModels);
      })
      .finally(function(){
        delete $scope.fetching;
      })
    }

    $scope.addToCalendar = function(event){
      saveEvent(event);
    }

    // ###################
    // ANONYMOUS FUNCTIONS
    // ###################

    // Example ref: 1234/owners/facebook:5678
    // Setting currentUser to be set as an owner of this event
    function setOwner(snapshot){
      eventsRef.child(snapshot.key() + '/owners/' + currentUser.uid).set(true);
    }

    function saveEvent(event){
      return eventsRef.child(event.attrs.id).update({
        title: event.attrs.name,
        description: event.attrs.description,
        startsAt: moment(event.attrs.start_time).toDate()
      }).then(function(){
        // Flip switch to show view link
        event.belongsToCurrentUser = true;
        $scope.$apply();
      })
    }

    function mapEventModels(event){
      return new EventModel(event);
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
