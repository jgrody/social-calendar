module.exports = angular.module('app.factories.events', [
  require('modules/model').name
])
  .factory('EventCollection', require('./collection'))
  .factory('EventModel', require('./model'))
  .factory('eventsRepository', require('./repository'))
