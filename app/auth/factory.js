module.exports = function(Auth, DB){
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
      }
    }, {
      scope: 'email,user_likes,user_events'
    });
  }

  function checkUserExistence(authData){
    return DB('users').child(authData.uid).once('value', function(snapshot){
      var exists = (snapshot.val() !== null);
      if (!exists) {
        createUser(authData);
      }
    })
  }

  function createUser(authData){
    DB().child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData),
      email: getEmail(authData)
    });
  }

  function getName(authData) {
    switch(authData.provider) {
     case 'facebook':
       return authData.facebook.displayName;
    }
  }

  function getEmail(authData) {
    switch(authData.provider) {
     case 'facebook':
       return authData.facebook.email;
    }
  }

  function logout(){
    Auth.$unauth();
  }

  function getUser(){
    return Auth.$getAuth();
  }

  Auth.$onAuth(function(authData){
    if (authData) {
      console.log("authData: ", authData);
      checkUserExistence(authData);
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