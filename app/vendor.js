require('angular');
require('angular-aria');
require('angular-animate');
require('angular-sanitize');
require('angular-route');
require('ng-annotate');
require('firebase');
require('angularfire/dist/angularfire');
require('angular-easyfb/src/angular-easyfb');
require('sugar/release/sugar-full.development');

window.jQuery = require('jquery/dist/jquery.min');
require('bootstrap/dist/js/bootstrap.min');
require('bootstrap-material-design/dist/js/material.min');
require('bootstrap-material-design/dist/js/ripples.min');


// spin.js detects that it is required in a CommonJS environment
// and does not pollute the global namespace, which angular-spinner
// depends on
window.Spinner = require('spin/spin');
require('angular-spinner/angular-spinner.min');