'use strict';

// Declare app level module which depends on filters, and services
module.exports = angular.module('app.config', [])
  .constant('version', '1.0.0')

  // where to redirect users if they need to authenticate (see security.js)
  .constant('loginRedirectPath', '/login')

  // your Firebase data URL goes here, no trailing slash
  .constant('FBURL', 'https://resplendent-fire-4818.firebaseio.com')

  // double check that the app has been configured before running it and blowing up space and time
  .run(['FBURL', '$timeout', function(FBURL, $timeout) {
    // if( FBURL.match('//instance.firebaseio.com') ) {
    //   angular.element(document.body).html('<h1>Please configure app/config.js before running!</h1>');
    //   $timeout(function() {
    //     angular.element(document.body).removeClass('hide');
    //   }, 250);
    // }
  }]);
