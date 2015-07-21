module.exports = function(app) {
  app.service('LoginRegisterServ', [
    '$http',
    '$auth',
    '$rootScope',
    'ApiEndpoint',
    'LoginStoryboard',
    'ChatServ',
    LoginRegisterServ
  ]);
};

function LoginRegisterServ($http, $auth, $rootScope, ApiEndpoint, 
  LoginStoryboard, ChatServ) {

  // Inheritance so that we can overwrite CharServ's server communications.
  var loginRegisterServ = 
    angular.extend(LoginRegisterServ.prototype, ChatServ);

  // Methods.
  loginRegisterServ.requestNextCard = requestNextCard;
  loginRegisterServ.submitLogin = submitLogin;
  loginRegisterServ.submitRegister = submitRegister;

  // Data.
  loginRegisterServ.isLoggedIn = false;
  loginRegisterServ.msgStorage = LoginStoryboard.conversation;
  loginRegisterServ.dataStore = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  // METHODS ******************************************************************

  // Provide the next blurbs in the list depending on the input ID.
  function requestNextCard(card) {

    if (card === null || card === undefined) {
      console.log("Login conversation is over!");

      // Rudimentary login-register toggle.
      // TODO: Refactor into a more readable and clearcut format.
      if (loginRegisterServ.dataStore.confirmPassword !== "") {
        this.submitRegister();
        return;
      } else {
        this.submitLogin();
        return;
      }
    }
    
    // Capture requested data such as email and password.
    if (card.inputs) {
      var input = card.inputs[0];
      loginRegisterServ.dataStore[input] = card.message;
    }

    var currentCard = loginRegisterServ.msgStorage[card.cardID];
    var receivedCard = 
      loginRegisterServ.msgStorage[currentCard.childrenCardIDs[0]];

    receivedCard.childrenCards = [];
    for (var i in receivedCard.childrenCardIDs) {
      // TODO: Refactor to make more readable.
      // Populates the children IDs with actual children.
      receivedCard.childrenCards
        .push(loginRegisterServ.msgStorage[receivedCard.childrenCardIDs[i]]);
    }

    this.delegateNextCard(receivedCard);
  }

  function submitLogin() {
    var loginData = loginRegisterServ.dataStore;

    // FIXME: This part of the code is not DRY.
    if (loginData.email === undefined) {
      alert("Please enter your email.");
      return;
    }

    if (loginData.password.length === 0) {
      alert("Please enter your password.");
      return;
    }

    // Complete POST request and redirect.
    var route = ApiEndpoint.url + "/auth/sign_in/";

    $auth.submitLogin(loginData)
      .then(function(resp) {
        console.log("Logged in.");
        console.log(resp);
        $rootScope.$emit('converse:ready');
      })
      .catch(function(resp) {
        console.log("Failed logging in.");
        console.log(resp);
      });
  }

  function submitRegister() {
    // Validate all information.
    var registerData = loginRegisterServ.dataStore;

    if (registerData.name.length === 0) {
      alert("Please enter your name so we can start talking!");
      return;
    }

    if (registerData.email.length === 0) {
      alert("Please enter your email.");
      return;
    }

    if (registerData.password.length === 0) {
      alert("Please enter your password.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert("Please make sure your password is correct.");
      return;
    }

    // Complete POST request and redirect.
    var route = ApiEndpoint.url + "/auth/";
    registerData.confirm_success_url = "https://www.openpearl.org/";

    console.log("Posting info.");

    $http.post(route, registerData).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("Logging in successful.");
        console.log(data.message);
      }).
      error(function(data, status, headers, config) {
        console.error("Error sending login-signup.");
        console.log(registerData);
      });
  }

  // HELPERS ******************************************************************

  return loginRegisterServ;
}
