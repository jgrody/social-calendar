(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = ["$filter", function($filter){
  "ngInject";
  return function(date, format) {
    if (format === "dateOnly") {
      return $filter('date')(date, "MMM d, yyyy");
    } else {
      return $filter('date')(date, "MMM d, yyyy 'at' h:mm a");
    }
  };
}]
},{}],2:[function(require,module,exports){
module.exports = angular.module('modules.filters', [
  'ngSanitize'
])
  .filter('dateFilter', require('./date'))
},{"./date":1}],3:[function(require,module,exports){
module.exports = ["$scope", "$sce", function($scope, $sce){
  "ngInject";

  $scope.html = $sce.trustAsHtml($scope.sanitized);

  // Once a value goes through the sanitizer it stops updating the DOM.
  // This allows values to be dynamically updated.
  $scope.$watch("sanitized", function(newContent){
    $scope.html = $sce.trustAsHtml(newContent);
  });
}]

},{}],4:[function(require,module,exports){
module.exports = function() {
  "ngInject";

  return {
    templateUrl: '/angular-modules/sanitized/template.html',
    scope: { sanitized: '=' },
    controller: 'SanitizedController'
  }
}
},{}],5:[function(require,module,exports){
module.exports = angular.module('modules.sanitize', [
  'ngSanitize'
])
  .directive("sanitized", require('./directive'))
  .controller("SanitizedController", require('./controller'))

},{"./controller":3,"./directive":4}],6:[function(require,module,exports){
angular.module('app', [
  'ng',
  'ngAria',
  'firebase',
  'ngRoute',
  'ezfb',
  require('angular-modules/filters').name,
  require('config').name,
  require('layout').name,
  require('auth').name,
  require('facebook').name,
  require('home').name,
  require('calendar').name,
  require('schedule').name,
])
  .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  }])
  .run(["$rootScope", "Auth", "ezfb", function($rootScope, Auth, ezfb) {
    window.rootScope = $rootScope;

    ezfb.init({
      appId: '1274974405853101',
      // status: true,
      // cookie: true,
      xfbml: true,
      version: 'v2.5'
    }); 

    Auth.$onAuth(function(user) {
      $rootScope.user = user;
    });
  }]);

},{"angular-modules/filters":2,"auth":8,"calendar":10,"config":11,"facebook":13,"home":14,"layout":15,"schedule":16}],7:[function(require,module,exports){
module.exports = ["Auth", function(Auth){
  "ngInject";

  function login(provider){
    provider = provider || 'facebook';

    Auth.$authWithOAuthPopup(provider, function(error, authData) {
      if (error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          // fall-back to browser redirects, and pick up the session
          // automatically when we come back to the origin page
          Auth.$authWithOAuthRedirect(provider, function(error) { / */ });
        }
      } else if (authData) {
        console.log("authData: ", authData);
      }
    }, {
      scope: 'email,user_likes,user_events'
    });
  }

  function logout(){
    Auth.$unauth();
  }

  function getUser(){
    return Auth.$getAuth();
  }

  Auth.$onAuth(function(authData){
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
      console.log("User is logged out");
    }
  })

  return {
    login: login,
    logout: logout,
    getUser: getUser
  }
}]
},{}],8:[function(require,module,exports){
module.exports = angular.module('app.auth', [
  require('config').name
])
  .factory('Auth', require('./ref'))
  .factory('authFactory', require('./factory'))

},{"./factory":7,"./ref":9,"config":11}],9:[function(require,module,exports){
module.exports = ["$firebaseAuth", "FBURL", function($firebaseAuth, FBURL){
  "ngInject";

  var ref = new Firebase(FBURL);
  return $firebaseAuth(ref);
}]
},{}],10:[function(require,module,exports){
module.exports = angular.module('app.calendar', [
])
  .controller('CalendarController', ["$scope", "user", function($scope, user){
    // console.log("user: ", user);
  }])
  .config(["$routeProvider", function($routeProvider){
    $routeProvider.when('/calendar', {
      templateUrl: 'calendar/template.html',
      controller: 'CalendarController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }])

},{}],11:[function(require,module,exports){
'use strict';

// Declare app level module which depends on filters, and services
module.exports = angular.module('app.config', [])
  .constant('version', '1.0.0')

  // where to redirect users if they need to authenticate (see security.js)
  .constant('loginRedirectPath', '/login')

  // your Firebase data URL goes here, no trailing slash
  .constant('FBURL', 'https://resplendent-fire-4818.firebaseio.com')
},{}],12:[function(require,module,exports){
module.exports = ["$q", "authFactory", "ezfb", function($q, authFactory, ezfb){
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
}]
},{}],13:[function(require,module,exports){
module.exports = angular.module('app.facebook', [
])
  .factory('facebookService', require('./factory'))

},{"./factory":12}],14:[function(require,module,exports){
module.exports = angular.module('app.home', [
  require('angular-modules/sanitized').name
])
  .controller('HomeController', ["$scope", "user", "facebookService", function($scope, user, facebookService){
    $scope.options = {};
    window.scope = $scope;

    $scope.search = function(){
      facebookService.getEvents({
        location: $scope.options.search
      })
      .then(function(data){
        $scope.events = data.data;
      })
    }
  }])
  .config(["$routeProvider", function($routeProvider){
    $routeProvider.when('/home', {
      templateUrl: 'home/template.html',
      controller: 'HomeController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }])

},{"angular-modules/sanitized":5}],15:[function(require,module,exports){
module.exports = angular.module('app.layout', [
]).controller('LayoutController', ["$scope", "authFactory", "$location", function($scope, authFactory, $location){
    $scope.links = [
      {title: 'Calendar', path: '/calendar'},
      {title: 'Home', path: '/home'},
      {title: 'Schedule', path: '/schedule'}
    ]

    $scope.login = function(authMethod){
      authFactory.login();
    }

    $scope.logout = function(){
      authFactory.logout();
    }
}])
},{}],16:[function(require,module,exports){
module.exports = angular.module('app.schedule', [
])
  .controller('ScheduleController', ["$scope", "user", function($scope, user){
    console.log("user: ", user);
  }])
  .config(["$routeProvider", function($routeProvider){
    $routeProvider.when('/schedule', {
      templateUrl: 'schedule/template.html',
      controller: 'ScheduleController',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }])

},{}]},{},[6]);
