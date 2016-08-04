'use strict';

angular.module('CardGameApp')
.controller('GameController', ['$scope', '$sanitize', 'cardService',
    function ($scope, $sanitize, cardService) {
       var CardToString = function (card) {
          return card.Rank + ' of ' + card.Suit;
       };

       var GameHubProxy = hubConnection.createHubProxy('gameHub');

       GameHubProxy.on('ReceiveCard', function (card) {
          $scope.$apply(function () {
             $scope.Output = CardToString(card);
             $scope.Hand.push(card);
             cardService.renderCard(card);
          });
       });

       $scope.RenderCard = function(card) {
          return cardService.renderCard(card);
       };

       $scope.Draw = function () {
          GameHubProxy.invoke('Draw');
       };

       $scope.Output = '';
       $scope.Hand = [];
    }
])
.controller('ChatController', ['$scope',
  function ($scope) {
     var ChatHubProxy = hubConnection.createHubProxy('chatHub');

     ChatHubProxy.on('ReceiveNewMessage', function (name, message, time) {
         $scope.$apply(function () {
           AddMessageToChatHistory({
              Name: name,
              Message: message,
              Time: time.substring(0, 5)
           });
        });
     });

     var AddMessageToChatHistory = function (message) {
         var lastMessage = $scope.ChatHistory[$scope.ChatHistory.length - 1];
         if (lastMessage && lastMessage.Name === message.Name && lastMessage.Time === message.Time)
             lastMessage.Message += ('<br />' + message.Message)
         else
             $scope.ChatHistory.push(message);
     };

     $scope.SendMessage = function () {
        ChatHubProxy.invoke('Send', $scope.Username, $scope.NewChatMessage);
        $scope.NewChatMessage = '';
     };

     $scope.ToggleSettings = function () {
        if (!$scope.HasUsername)
            return;
        $scope.IsSettingsHidden = !$scope.IsSettingsHidden;
     };

     $scope.$watch('Username', function (newUsername) {
         $scope.HasUsername = newUsername && newUsername !== '';
     });

     $scope.Username = '';
     $scope.HasUsername = false;
     $scope.IsSettingsHidden = false;
     $scope.ChatHistory = [];
  }
]);