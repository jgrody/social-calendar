module.exports = angular.module('app.factories', [
  require('./events').name,
  require('./users').name,
  require('modules/model').name
])
