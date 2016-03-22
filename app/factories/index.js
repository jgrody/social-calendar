module.exports = angular.module('app.factories', [
  require('modules/model').name
])
  .factory('EventCollection', require('./event_collection'))
  .factory('EventModel', require('./event_model'))
