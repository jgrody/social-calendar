require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material/angular-material');
require('angular-sanitize');
require('angular-route');
require('ng-annotate');
require('firebase');
require('angularfire/dist/angularfire');

angular.module("app", [
  "ng",
  "ngAria",
  "firebase",
  "ngMaterial",
  "ngRoute",
  require('./config').name,
  require('./login').name,
  require('./home').name
])
  .controller('LayoutController', function($scope, $mdSidenav, loginFactory){
    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.navigateTo = function(sref){
      $state.go(sref);
      $mdSidenav('left').toggle();
    }

    $scope.login = function(authMethod){
      loginFactory.login();
    }

    $scope.logout = function(){
      loginFactory.logout();
    }
  })
  .config(function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  })
  .run(function($rootScope, Auth) {
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  });
