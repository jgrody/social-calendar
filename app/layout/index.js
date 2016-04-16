module.exports = angular.module('app.layout', [
  require('layout/toolbar').name,
  require('layout/sidenav').name,
])
.controller('LayoutController', function($scope, $mdSidenav, authFactory, $location){

  $scope.links = [
    {title: 'Home', path: '/home', icon: 'home'},
    {title: 'Calendar', path: '/calendar', icon: 'event'}
  ]

  $scope.optionLinks = [
    {title: 'Login', fn: authFactory.login},
    {title: 'Logout', fn: authFactory.logout}
  ]

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.navigateTo = function(link){
    $location.path(link.path);
    $mdSidenav('left').toggle();
  }
})
