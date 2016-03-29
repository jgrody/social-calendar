module.exports = function($scope, $mdDialog, event, MyDialog){
  "ngInject";
  
  $scope.close = MyDialog.hide;
  
  $scope.event = event;
}