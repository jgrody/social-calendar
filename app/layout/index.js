module.exports = angular.module('app.layout', [
]).controller('LayoutController', function($scope, $mdSidenav, authFactory, $location){
    $scope.links = [
      {title: 'Home', path: '/home', icon: 'home'},
      {title: 'Calendar', path: '/calendar', icon: 'event'},
      {title: 'Schedule', path: '/schedule'}
    ]

    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function(link){
      $location.path(link.path);
      $mdSidenav('left').toggle();
    }

    $scope.login = function(authMethod){
      authFactory.login();
    }

    $scope.logout = function(){
      authFactory.logout();
    }
})