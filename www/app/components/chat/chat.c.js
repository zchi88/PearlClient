module.exports = function(app) {
  app.controller('ChatController', [
    '$http',
    '$ionicPlatform',
    '$ionicScrollDelegate', 
    '$cordovaHealthKit',
    ChatController
  ]);
}

function ChatController(
    $http, 
    $ionicPlatform, 
    $ionicScrollDelegate, 
    $cordovaHealthKit
  ) {

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

  var vm = this;

  vm.getStepCount = getStepCount;

  vm.message = "";
  vm.sendInformation = sendInformation;
  vm.chatMessages = [];

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
      console.log("HealthKit Step Count Success (Changed): " + steps + " steps.");

      // Perform basic calculations to get time exercised.
      var milesWalked = steps / 2000.0;

      // http://en.wikipedia.org/wiki/Preferred_walking_speed
      var timeTaken = Math.round((milesWalked / 3.1) * 60);

      vm.chatMessages.push({
        username: "ai",
        message: "Duration of exercise today: " + timeTaken + " minutes."
      });

    }, function () {
      console.log("HealthKit Step Count Query unsuccessful.");
    });
  }

  function sendInformation(){
    vm.getStepCount();

    console.log(vm.message);

    // TODO: Add data to speech bubble.
    // TODO: Move this either to a factory or a service.
    vm.chatMessages.push({
      username: 'client',
      message: vm.message
    });

    // $ionicScrollDelegate.scrollBottom(true);

    // TODO: Implement POST request.
    var url = "https://odmmjjialz.localtunnel.me/api/v1/tests/";
    var msg = vm.message;

    $http.post(url, {message: msg}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data.message);

        vm.chatMessages.push({
          userame: 'ai',
          message: data.message
        });

      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    vm.message = "";
  }
}
