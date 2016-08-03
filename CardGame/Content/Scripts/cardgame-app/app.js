'use strict';

var hubConnection = $.hubConnection();
angular.module('CardGameApp', ['ngSanitize']).run(['$timeout',
   function ($timeout) {
      $timeout(function () {
         hubConnection.start().done(function() {});
      }, 0);
   }
]);