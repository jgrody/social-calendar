module.exports = angular.module('app.auth', [
  require('../config').name
])
  .factory('Auth', require('./factory'));