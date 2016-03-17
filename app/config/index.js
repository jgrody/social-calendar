'use strict';

// Declare app level module which depends on filters, and services
module.exports = angular.module('app.config', [])
  .constant('version', '1.0.0')

  // where to redirect users if they need to authenticate (see security.js)
  .constant('loginRedirectPath', '/login')

  // your Firebase data URL goes here, no trailing slash
  .constant('FBURL', 'https://resplendent-fire-4818.firebaseio.com')

  .constant('DB', function(path){
    var base = 'https://resplendent-fire-4818.firebaseio.com';
    var url = path ? (base + '/' + path) : base;

    return new Firebase(url);
  })