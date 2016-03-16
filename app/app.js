angular.module('app', [
  'ng',
  'ngAria',
  'firebase',
  'ngRoute',
  'ezfb',
  require('modules/filters').name,
  require('modules/spinners').name,
  require('config').name,
  require('layout').name,
  require('auth').name,
  require('facebook').name,
  require('home').name,
  require('calendar').name,
  require('schedule').name,
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  })
  .run(function($rootScope, Auth, ezfb) {
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
    });
  });
