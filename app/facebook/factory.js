module.exports = function($q, loginFactory, ezfb){
  "ngInject";

  var user = loginFactory.getUser();

  function extendParams(options){
    options = options || {};
    return angular.extend({}, options, {
      access_token: user.facebook.accessToken
    })
  }

  function request(){
    var deferred = $q.defer();
    var args = [].slice.call(arguments);
    // If 4 arguments are passed, the params will be
    // in the 2nd position in the array, otherwise, we
    // assume 3 arguments were passed, in which case, the params
    // are in the 2nd position in the array
    var paramsIndex = (args.length > 3) ? 2 : 1;
    var callbackIndex = (args.length > 3) ? 3 : 2;

    // We are:
    // 1). resetting the params object within args
    //     to include the access_token on every request
    // 2). modifying the callback to utilize our deferred object

    args[paramsIndex] = extendParams(args[paramsIndex]);
    args[callbackIndex] = function(res){
      if (!res || res.error) {
        deferred.reject('Error occured');
      } else {
        deferred.resolve(res);
      }
    }

    ezfb.api.apply(null, args);
    return deferred.promise;
  }

  return {
    getMyLastName: function() {
      return request('/me/likes', {}, function(res){
        console.log("res: ", res);
      });
    }
  }
}