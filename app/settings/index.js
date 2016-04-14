module.exports = angular.module('app.settings', [
  'firebase',
  require('factories/users').name
])
  .controller('SettingsController', function($scope, currentUser, DB, UserModel){

    "ngInject";

    var user = new UserModel(currentUser.uid);

    $scope.loadingUser = user.$loaded().finally(function(){
      delete $scope.loadingUser;
    })

    user.$bindTo($scope, 'user');

    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });
  })
  .config(function($routeProvider){
    $routeProvider.when('/settings', {
      templateUrl: 'settings/template.html',
      controller: 'SettingsController',
      resolve: {
        currentUser: ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  })
