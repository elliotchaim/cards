'use strict';

angular.module('CardGameApp')
.controller('GameController', ['$scope',
    function ($scope) {
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

             $scope.Hand.length >= Configuration.maxCardsInHand
               ? $scope.DrawnCard = card
               : $scope.Hand.push(card);
          });
       });

       GameHubProxy.on('StartTurn', function () {
          $scope.$apply(function () {
             $scope.IsMyTurn = true;
          });
       });

       GameHubProxy.on('GameStarted', function () {
          $scope.IsASpectator = false;
          $scope.GameStarted = true;
       });

       GameHubProxy.on('AddToFaceUpPile', function (card, lastCardWasSwapped) {
          $scope.$apply(function () {
             //$scope.TopFaceUpCard = card;
             $scope.FaceUpPile.unshift(card);
          });
       });

       GameHubProxy.on('RemoveTopCardFromFaceUpPile', function () {
          $scope.$apply(function () {
             $scope.FaceUpPile.slice(0, $scope.FaceUpPile.length);
          });
       });

       $scope.$watchCollection('FaceUpPile', function () {
          $scope.TopFaceUpCard = $scope.FaceUpPile[0];
       });

       $scope.StartGame = function () {
          GameHubProxy.invoke('StartGame');
       }

       $scope.Swap = function () {
          var cardInHandIndex = $scope.Hand.findIndex(x => x.IsSelected);
          var cardInHand = $scope.Hand[cardInHandIndex];
          cardInHand.IsSelected = false;

          if ($scope.HasDrawn) {
             $scope.Hand[cardInHandIndex] = $scope.DrawnCard;
             $scope.DrawnCard = cardInHand;
          } else {
             $scope.Hand[cardInHandIndex] = $scope.TopFaceUpCard;
             $scope.TopFaceUpCard = cardInHand;
          }

          $scope.EndTurn(cardInHand, true);
       };

       $scope.EndTurn = function (newTopFaceUpCard, wasSwapped) {
          $scope.IsMyTurn = false;
          $scope.HasSelectedACard = false;
          if ($scope.HasDrawn) {
             var drawnCard = $scope.DrawnCard;
             $scope.FaceUpPile.unshift(drawnCard);
             $scope.DrawnCard = null;
             $scope.HasDrawn = false;
             if (newTopFaceUpCard === undefined) {
                console.log('here')
                GameHubProxy.invoke('EndTurn', drawnCard, false)
                return;
             }
          }
          GameHubProxy.invoke('EndTurn', newTopFaceUpCard, wasSwapped);
       };

       $scope.Draw = function () {
          GameHubProxy.invoke('Draw');
          $scope.HasDrawn = true;
       };

       $scope.ToggleCardSelected = function (card) {
          if ($scope.HasSelectedACard && !card.IsSelected)
             return;
          card.IsSelected = !card.IsSelected;
          $scope.HasSelectedACard = !$scope.HasSelectedACard;
       };

       $scope.Hand = [];
       $scope.FaceUpPile = [];
       $scope.TopFaceUpCard = null;
       $scope.DrawnCard = null;
       $scope.HasDrawn = false;
       $scope.HasSelectedACard = false;
       $scope.IsASpectator = true;
       $scope.IsMyTurn = false;
       $scope.GameStarted = false;
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