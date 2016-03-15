module.exports = angular.module('app.auth', [
  require('config').name
])
  .factory('Auth', require('./ref'))
  .factory('authFactory', require('./factory'))
