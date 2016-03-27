module.exports = angular.module('app.home', [
  require('modules/sanitized').name,
  require('modules/truncate').name,
  require('factories').name,
])
  .controller('HomeController',
    function($scope, currentUser, facebookService, DB, EventModel, $mdToast){
    "ngInject";

    window.scope = $scope;
    $scope.options = {};

    $scope.search = function(){
      $scope.fetching = facebookService.getEvents({
        query: $scope.options.search
        // query: 'hoboken'
      })
      .then(function(response){
        $scope.events = response.data.map(mapEventModels);
      })
      .finally(function(){
        delete $scope.fetching;
      })
    }
    $scope.search();

    $scope.addToCalendar = function(event){
      event.addToCalendar()
        .then(function(){
          $scope.$apply();
        })
        .then(function(){
           $mdToast.show(
            $mdToast.simple()
            .textContent(event.attrs.name + ' has been added to your calendar')
            .hideDelay(3000)
            ); 
        })
    }

    $scope.removeFromCalendar = function(event){
      event.removeFromCalendar(event)
        .then(function(){
          $scope.$apply();
        })
        .then(function(){
           $mdToast.show(
            $mdToast.simple()
            .textContent(event.attrs.name + ' has been removed from your calendar')
            .hideDelay(3000)
            ); 
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
