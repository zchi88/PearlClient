var utils = require("./utils/LocalStorageFactory");

module.exports = angular.module('pearl-client.controllers', [])
  .controller('PearlCtrl', PearlCtrl);

PearlCtrl.$inject = ["$http", utils.name, 'ngCordova'];

function PearlCtrl($http, $localstorage, $cordovaHealthKit) {
  console.log("Am I even running?");
  console.log($cordovaHealthKit);

  $cordovaHealthKit.isAvailable().then(function(yes){
    var permissions = ['HKQuantityTypeIdentifierHeight'];
    console.log(permissions);

    $cordovaHealthKit.requestAuthorization(
      permissions,
      permissions
    ).then(function(success){

    });
  }, function() {

  });


  var vm = this;

  vm.message = "";
  vm.sendInformation = sendInformation;

  function sendInformation(){
    console.log(vm.message);
    console.log($cordovaHealthKit);

    // TODO: Add data to speech bubble.

    // TODO: Implement POST request.
    var url = "http://localhost:3000/test";
    var msg = vm.message;

    // $http.post(url, {msg:msg}).
    //   success(function(data, status, headers, config) {
    //     // this callback will be called asynchronously
    //     // when the response is available
    //   }).
    //   error(function(data, status, headers, config) {
    //     // called asynchronously if an error occurs
    //     // or server returns response with an error status.
    //   });

    vm.message = "";
  }
}
