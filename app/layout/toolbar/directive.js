module.exports = function($parse){
  "ngInject";

  return {
    scope: true,
    templateUrl: 'layout/toolbar/template.html',
    link: function(scope, element, attrs){
      scope.options = {};
      scope.options.allowSearch = $parse(attrs.allowSearch)(scope);
    }
  }
}
