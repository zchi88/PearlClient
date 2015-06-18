module.exports = function(app) {
  app.controller('ChatController', [
    '$scope',
    '$http',
    '$ionicPlatform',
    '$ionicScrollDelegate', 
    // '$ionicView',
    '$cordovaHealthKit',
    ChatController
  ]);
}

function ChatController(
    $scope,
    $http, 
    $ionicPlatform, 
    $ionicScrollDelegate, 
    // $ionicView,
    $cordovaHealthKit
  ) {

  var vm = this;

  vm.message = "";
  vm.chatMessages = [];

  // TODO: Change this to correspond to what the server returns.
  vm.inputOptions = ["Hello", "cats", "Another choice", "keep adding", "more"];

  vm.doRefresh = doRefresh;
  vm.getStepCount = getStepCount;
  vm.sendClientContext = sendClientContext;

  vm.enterClientInput = enterClientInput;
  vm.haveConversation = haveConversation;

  // TODO: Test this when Healthkit entitlement becomes possible.
  $ionicPlatform.ready(function() {
    console.log("Platform is ready here.");
    $cordovaHealthKit.isAvailable().then(
      function(yes) {
        
        var readPermissions = [
          'HKQuantityTypeIdentifierDistanceWalkingRunning',
          'HKQuantityTypeIdentifierDistanceCycling',
          'HKQuantityTypeIdentifierStepCount',
        ];

        var writePermissions = [];
        console.log(readPermissions);      
        
        $cordovaHealthKit.requestAuthorization(
          readPermissions,
          writePermissions
        ).then(function(success){
          console.log("Requested permissions to read and write health information.");
         });
      },

      function(no) {

      });
  });

  // FIXME: Can this be 'vm'. If so, or if not, why?
  $scope.$on('$ionicView.enter', function() {
    console.log("I have entered the app.");

    // TODO: This is where you can send the context of the walking steps.
  });

  function doRefresh() {
    console.log("Refreshing the conversation!");
    vm.sendClientContext();
    $scope.$broadcast('scroll.refreshComplete');
  }

  function getStepCount(){
    console.log("Getting step count.");

    var m = moment().startOf('day');  
    var startDate = m.toDate();  
    var endDate = moment(m).add(1, 'd').toDate(); 
    
    console.log(startDate);
    console.log(endDate); 

    window.plugins.healthkit.sumQuantityType({
      'startDate': startDate,
      'endDate': endDate,
      'distanceUnit': 'mileUnit',
      // 'sampleType': 'HKQuantityTypeIdentifierDistanceWalkingRunning'
      'sampleType': 'HKQuantityTypeIdentifierStepCount'
    }, function(steps) {
      console.log("HealthKit Step Count Success (Changed): " 
        + steps + " steps.");

      // TODO: Change this to the correct route.
      var route = CURRENT_HOST + "/api/v1/tests/";
      var clientContext = {
        // TODO: Change user_id.
        userId: "test",
        stepCount: steps
      }

      $http.post(route, clientContext).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(data.message);

          // TODO: Populate messages with the next message.
          // Call method to populate messages and commands.

        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert("An error happened sending the message.");
        });

      // TODO: Move this logic into the server.
      // // Perform basic calculations to get time exercised.
      // var milesWalked = steps / 2000.0;

      // // http://en.wikipedia.org/wiki/Preferred_walking_speed
      // var timeTaken = Math.round((milesWalked / 3.1) * 60);

      // vm.chatMessages.push({
      //   speaker: "ai",
      //   message: "Duration of exercise today: " + timeTaken + " minutes."
      // });

    }, function () {
      console.log("HealthKit Step Count Query unsuccessful.");
    });
  }

  function sendClientContext() {
    console.log("I am now going to send client context."); 
  }

  function enterClientInput($index) {
    console.log("Entering the client input.");

    console.log($index);
    console.log(vm.inputOptions[$index]);

    vm.message = vm.inputOptions[$index];
    console.log(vm.message);
  }

  function haveConversation(){

    // TODO: Add data to speech bubble.
    // TODO: Move this either to a factory or a service.
    vm.chatMessages.push({
      speaker: 'client',
      message: vm.message
    });

    // TODO: Implement POST request.
    var route = CURRENT_HOST + "/api/v1/tests/";
    var commRequest = {
      // TODO: Populate this information properly.
      commId: "",
      message: vm.message
    }

    $http.post(route, commRequest).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data.message);

        vm.chatMessages.push({
          speaker: 'ai',
          message: data.message
        });

        // TODO: Continue logic here or create new helper method.

      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    vm.message = "";
  }
}
