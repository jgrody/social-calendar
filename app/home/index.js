module.exports = angular.module('app.home', [
  require('modules/sanitized').name
])
  .controller('HomeController', function($scope, user, facebookService){
    $scope.options = {};
    window.scope = $scope;

    $scope.search = function(){
      $scope.fetching = facebookService.getEvents({
        location: $scope.options.search
      })
      .then(function(data){
        $scope.events = data.data;
      })
      .finally(function(){
        delete $scope.fetching;
      })
    }
  })
  .config(function($routeProvider){
    $routeProvider.when('/home', {
      templateUrl: 'home/template.html',
      controller: 'HomeController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  })
