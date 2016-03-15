module.exports = angular.module('app.layout', [
]).controller('LayoutController', function($scope, authFactory, $location){
    $scope.links = [
      {title: 'Calendar', path: '/calendar'},
      {title: 'Home', path: '/home'},
      {title: 'Schedule', path: '/schedule'}
    ]

    $scope.login = function(authMethod){
      authFactory.login();
    }

    $scope.logout = function(){
      authFactory.logout();
    }
})