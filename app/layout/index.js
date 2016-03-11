module.exports = angular.module('app.layout', [
]).controller('LayoutController', function($scope, $mdSidenav, loginFactory, $location){
    $scope.links = [
      {title: 'Calendar', path: '/calendar'},
      {title: 'Home', path: '/home'},
      {title: 'Schedule', path: '/schedule'}
    ]

    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function(path){
      $location.path(path);
      $mdSidenav('left').toggle();
    }

    $scope.login = function(authMethod){
      loginFactory.login();
    }

    $scope.logout = function(){
      loginFactory.logout();
    }
})