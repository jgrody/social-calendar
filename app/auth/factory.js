module.exports = function(Auth){
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
}