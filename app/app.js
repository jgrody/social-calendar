angular.module('app', [
  'ng',
  'ngAria',
  'firebase',
  'ngRoute',
  'ezfb',
  'ngMaterial',
  require('modules/filters').name,
  require('modules/progress').name,
  require('modules/dialog').name,
  require('config').name,
  require('layout').name,
  require('auth').name,
  require('facebook').name,
  require('home').name,
  require('calendar').name,
  require('login').name,
  require('factories').name
])
  .run(require('ezfb'))
  .run(require('current_user'))
  .run(function($rootScope, Auth, $location) {
    $rootScope.goTo = function(path){
      $location.path(path);
    }

    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $location.path("/login");
      }
    });
  })
  .config(function($routeProvider){
    $routeProvider.otherwise('/home');
  })
