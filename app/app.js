require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material/angular-material');
require('angular-sanitize');
require('angular-route');
require('ng-annotate');
require('firebase');
require('angularfire/dist/angularfire');
require('angular-easyfb/src/angular-easyfb');
require('sugar/release/sugar-full.development');

angular.module('app', [
  'ng',
  'ngAria',
  'firebase',
  'ngRoute',
  'ezfb',
  require('./config').name,
  require('./layout').name,
  require('./login').name,
  require('./facebook').name,
  require('./home').name,
  require('./calendar').name,
  require('./schedule').name
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
