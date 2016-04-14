module.exports = angular.module('app.factories.users', [
  require('modules/model').name
])
  .factory('UserCollection', require('./collection'))
  .factory('UserModel', require('./model'))
  .factory('usersRepository', require('./repository'))
