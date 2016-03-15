module.exports = function($q, authFactory, ezfb){
  "ngInject";

  var user = authFactory.getUser();

  function extendParams(options){
    options = options || {};
    return angular.extend({}, options, {
      access_token: user.facebook.accessToken
    })
  }

  function request(){
    var deferred = $q.defer();
    var args = [].slice.call(arguments);

    // Vars set to retrieve position of params and the callback
    // function in the passed in arguments. Reason for this is that
    // passing the method is optional so there will either be 3 arguments
    // or there will be 4 to specify a method other than 'GET'
    var paramsIndex = (args.length > 3) ? 2 : 1;
    var callbackIndex = (args.length > 3) ? 3 : 2;

    // We are:
    // 1). extending params to include the access_token on every request
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
    getEvents: function(params) {
      return request('/search?', {
        q: params.location,
        type: 'event'
      }, function(res){
        console.log("res: ", res);
      });
    }
  }
}