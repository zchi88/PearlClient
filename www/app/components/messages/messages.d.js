module.exports = function(app) {app
  .directive('prlMessages', [
    '$timeout',
    '$ionicScrollDelegate', 
    prlMessages
  ])
;};

function prlMessages($timeout, $ionicScrollDelegate) {
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: "_templates/messages.t.html",
    replace: true,
    controller: MessagesCtrl,
    controllerAs: 'messagesCtrl',
    bindToController: true,
    link: MessagesLink
  };

  function MessagesLink(scope, element, attrs) {
    
    scope.$watch('messagesCtrl.CS.chatMessages', function(newValue, oldValue) {
      if (newValue) {
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('messagesScroll')
            .scrollBottom(true);
        }, 200);
      }
    }, true);
  }
}

MessagesCtrl.$inject = ['$http', '$scope', 'ChatServ', 'Error404Interceptor'];

function MessagesCtrl($http, $scope, ChatServ, Error404Interceptor) {
  var vm = this;
  vm.CS = ChatServ;
  vm.E404 = Error404Interceptor;
  vm.checkLoading = checkLoading;
  vm.stillLoading = false;

  function checkLoading() {
    // console.log("Pending requests:");
    // console.log($http.pendingRequests);

    var _pendingRequests = $http.pendingRequests.filter(
      function(element, index, array) {
      var re = /\/(converse|context)/;
      regexConverse = re.exec(element.url);
      re.lastIndex = 0;
      // console.log(regexConverse);
      if (regexConverse !== null) {
        return true;        
      }

      return false;
    });

    return _pendingRequests.length > 0;
  }

  $scope.$watch(vm.checkLoading, function(v) {
    if (v) {
      vm.stillLoading = true;
    } else {
      vm.stillLoading = false;
    }
  });
}
