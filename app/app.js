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
  "ngRoute",
  require('./config').name,
  require('./login').name,
  require('./home').name,
  require('./calendar').name
])
  .controller('LayoutController', function($scope, $mdSidenav, loginFactory, $location){
    $scope.links = [
      {
        title: 'Calendar',
        path: '/calendar'
      },
      {
        title: 'Home',
        path: '/home'
      }
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
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider
      .hashPrefix('');

    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  })
  .run(function($rootScope, Auth) {
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  });
