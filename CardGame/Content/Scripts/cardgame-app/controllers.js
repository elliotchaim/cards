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

     ChatHubProxy.on('ReceiveNewMessage', function (name, message) {
        $scope.$apply(function () {
           $scope.ChatHistory.push({
              Name: name,
              Message: message
           });
        });
     });

     $scope.SendMessage = function () {
        ChatHubProxy.invoke('Send', $scope.Username, $scope.NewChatMessage);
        $scope.NewChatMessage = '';
     };

     $scope.ToggleSettings = function () {
        $scope.IsSettingsHidden = !$scope.IsSettingsHidden;
     };

     $scope.Username = '';
     $scope.IsSettingsHidden = true;
     $scope.ChatHistory = [];
  }
]);