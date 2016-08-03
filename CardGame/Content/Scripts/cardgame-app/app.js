'use strict';

var hubConnection = $.hubConnection();
angular.module('CardGameApp', []).run(['$timeout',
   function ($timeout) {
      $timeout(function () {
         hubConnection.start().done(function() {});
      }, 0);
   }
]);