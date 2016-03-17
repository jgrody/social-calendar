angular.module('app', [
  'ng',
  'ngAria',
  'firebase',
  'ngRoute',
  'ezfb',
  'ngMaterial',
  require('modules/filters').name,
  require('modules/progress').name,
  require('config').name,
  require('layout').name,
  require('auth').name,
  require('facebook').name,
  require('home').name,
  require('calendar').name,
  require('schedule').name,
  require('login').name,
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  })
  .run(function($rootScope, Auth, ezfb, $location) {
    window.rootScope = $rootScope;

    ezfb.init({
      appId: '1274974405853101',
      // status: true,
      // cookie: true,
      xfbml: true,
      version: 'v2.5'
    }); 

    Auth.$onAuth(function(user) {
      $rootScope.user = user;

      if (user){
        $location.path("/home")
      } else {
        $location.path("/login")
      }
    });
  });
