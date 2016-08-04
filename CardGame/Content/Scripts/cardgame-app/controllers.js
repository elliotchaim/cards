'use strict';

angular.module('CardGameApp')
.controller('GameController', ['$scope', '$sanitize',
    function ($scope, $sanitize) {
        var Configuration = {
            maxCardsInHand: 7
        };

       var CardToString = function (card) {
          return card.Rank + ' of ' + card.Suit;
       };

       var GameHubProxy = hubConnection.createHubProxy('gameHub');

       GameHubProxy.on('ReceiveCard', function (card) {
          $scope.$apply(function () {
             card.IsSelected = false;
             $scope.Hand.push(card);
          });
       });

       $scope.Draw = function () {
           if ($scope.Hand.length >= Configuration.maxCardsInHand)
               return;
          GameHubProxy.invoke('Draw');
       };

       $scope.ToggleCardSelected = function (card) {
           if ($scope.HasSelectedACard && !card.IsSelected)
               return;
           card.IsSelected = !card.IsSelected;
           $scope.HasSelectedACard = !$scope.HasSelectedACard;
       };

       $scope.Hand = [];
       $scope.HasSelectedACard = false;
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