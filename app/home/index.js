module.exports = angular.module('app.home', [
  require('modules/sanitized').name,
  require('modules/truncate').name,
])
  .controller('HomeController', function($scope, user, facebookService, DB){
    $scope.options = {};
    var baseRef = DB();
    var eventsRef = DB('events');
    window.ref = eventsRef;

    // Result would look something like:
    // events: {
    //   "owners": {
    //     "facebook:1234": true
    //   }
    // }
    eventsRef.on('child_added', function(snapshot){
      // Example ref: 12345/owners/facebook:678910
      // Setting current user to be set as an owner of this event
      eventsRef.child(snapshot.key() + '/owners/' + user.uid).set(true);

      // eventsRef.child(snapshot.key()).
    })

    $scope.search = function(){
      $scope.fetching = facebookService.getEvents({
        query: $scope.options.search
      })
      .then(function(data){
        $scope.events = data.data;
      })
      .finally(function(){
        delete $scope.fetching;
      })
    }

    $scope.addToCalendar = function(event){
      saveEvent(event);
    }

    function saveEvent(event){
      eventsRef.child(event.id).update({
      // eventsRef.push({
        title: event.name,
        description: event.description,
        startsAt: moment(event.start_time).toDate()
      });
    }
  })
  .config(function($routeProvider){
    $routeProvider.when('/home', {
      templateUrl: 'home/template.html',
      controller: 'HomeController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  })
