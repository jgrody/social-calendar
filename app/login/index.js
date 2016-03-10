module.exports = angular.module('app.login', [
  require('../auth').name
])
  .factory('loginFactory', require('./factory'));