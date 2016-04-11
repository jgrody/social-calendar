var palettes = function($mdThemingProvider){
  var customBlueMap = $mdThemingProvider
    .extendPalette('light-blue', {
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50'],
      '50': 'ffffff'
    });

  $mdThemingProvider.definePalette('customBlue', customBlueMap);

  $mdThemingProvider
  .theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    }).accentPalette('pink');

  $mdThemingProvider.theme('input', 'default').primaryPalette('grey')
}

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
  require('settings').name,
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
      console.log(error);
      if (error === "AUTH_REQUIRED") {
        $location.path("/login");
      }
    });
  })
  .config(palettes)
  .config(function($routeProvider){
    $routeProvider.otherwise('/home');
  })
