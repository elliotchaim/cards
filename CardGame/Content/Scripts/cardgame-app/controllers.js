'use strict';

angular.module('CardGameApp')
.controller('GameController', ['$scope', 'PlayingCardService',
    function ($scope, PlayingCardService) {
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
          $scope.GameStarted = true;
       });

       GameHubProxy.on('AddToFaceUpPile', function (card) {
          $scope.$apply(function () {
             $scope.FaceUpPile.unshift(card);
          });
       });

       GameHubProxy.on('RemoveTopCardFromFaceUpPile', function () {
          $scope.$apply(function () {
             $scope.FaceUpPile.slice(0, $scope.FaceUpPile.length);
          });
       });

       GameHubProxy.on('AddToAvailableGames', function (games) {
          $scope.$apply(function () {
             Array.prototype.push.apply($scope.AvailableGames, games);
          });
       });

       GameHubProxy.on('AddToGame', function (gameId) {
          $scope.$apply(function () {
             $scope.CurrentGameId = gameId;
          });
       });

       $scope.$watchCollection('FaceUpPile', function () {
          $scope.TopFaceUpCard = $scope.FaceUpPile[0];
       });

       $scope.$watchCollection('Hand', function () {
          console.log(angular.toJson($scope.Hand));
          if (PlayingCardService.isWinningHand($scope.Hand)) {
             console.log('BOO YA - I WIN!');
          }
       });

       var setColours = function() {
          angular.forEach($scope.Hand, function (card, cardIndex, hand) {
             card.Colour = Math.floor(Math.random() * 2) ? 'lightgreen' : 'lightsalmon';
          });
       }

       $scope.SortHand = function() {
          PlayingCardService.sort($scope.Hand);
       };

       $scope.StartGame = function () {
          GameHubProxy.invoke('StartGame', $scope.CurrentGameId);
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
                GameHubProxy.invoke('EndTurn', $scope.CurrentGameId, drawnCard, false);
                return;
             }
          }
          GameHubProxy.invoke('EndTurn', $scope.CurrentGameId, newTopFaceUpCard, wasSwapped);
       };

       $scope.Draw = function () {
          GameHubProxy.invoke('Draw', $scope.CurrentGameId);
          $scope.HasDrawn = true;
       };

       $scope.ToggleCardSelected = function (card) {
          if (!$scope.IsMyTurn || ($scope.HasSelectedACard && !card.IsSelected))
             return;
          card.IsSelected = !card.IsSelected;
          $scope.HasSelectedACard = !$scope.HasSelectedACard;
       };

       $scope.CreateGame = function () {
          if ($scope.NewGameName && $scope.NewGameName !== '') {
             GameHubProxy.invoke('CreateGame', $scope.NewGameName);
             $scope.NewGameName = '';
          }
       };

       $scope.JoinGame = function (id) {
          GameHubProxy.invoke('JoinGame', id);
       };

       $scope.CurrentGameId = null;
       $scope.AvailableGames = [];

       $scope.Hand = [];
       $scope.FaceUpPile = [];
       $scope.TopFaceUpCard = null;
       $scope.DrawnCard = null;
       $scope.HasDrawn = false;
       $scope.HasSelectedACard = false;
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