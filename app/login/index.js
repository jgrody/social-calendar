module.exports = angular.module('app.login', [
  require('modules/sanitized').name
])
  .controller('LoginController', function($scope, authFactory){
    $scope.login = function(){
      authFactory.login();
    }
  })
  .config(function($routeProvider){
    $routeProvider.when('/login', {
      templateUrl: 'login/template.html',
      controller: 'LoginController'
    });
  })
