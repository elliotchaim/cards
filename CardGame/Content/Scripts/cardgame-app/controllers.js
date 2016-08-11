'use strict';

angular.module('CardGameApp')
.controller('UserController', ['$scope', '$rootScope',
   function($scope, $rootScope) {
      $rootScope.Name = null;

      $scope.SubmitName = function(input) {
         if (input) {
            $rootScope.Name = input;
         }
      };
   }
])
.controller('GameController', ['$scope', '$rootScope', 'PlayingCardService',
    function ($scope, $rootScope, PlayingCardService) {
       var Configuration = {
          maxCardsInHand: 7
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

       GameHubProxy.on('GameStarted', function (opponents) {
          $scope.GameStarted = true;
          $scope.Opponents = opponents.filter( x => x.Name != $rootScope.Name );
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

       GameHubProxy.on('UpdateGamesDirectory', function (availableGames) {
          $scope.$apply(function () {
             $scope.AvailableGames = availableGames;
          });
       });

       GameHubProxy.on('AddToGame', function (gameId) {
          $scope.$apply(function () {
             $scope.CurrentGameId = gameId;
          });
       });

       GameHubProxy.on('AbandonGame', function (message) {
          $scope.$apply(function () {
             $scope.GameAbandoned = true;
             $scope.Notifications.push(message);
          });
       });

       $scope.$watchCollection('FaceUpPile', function () {
          $scope.TopFaceUpCard = $scope.FaceUpPile[0];
       });

       $scope.$watchCollection('Hand', function () {
          if (PlayingCardService.isWinningHand($scope.Hand)) {
             $scope.GameEnded = true;
             $scope.HasWon = true;
          }
       });

       $scope.SortHand = function() {
          PlayingCardService.sort($scope.Hand);
       };

       $scope.StartGame = function() {
          GameHubProxy.invoke('StartGame', $scope.CurrentGameId);
       };

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
          GameHubProxy.invoke('JoinGame', id, $rootScope.Name);
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
       $scope.GameEnded = false;
       $scope.GameAbandoned = false;
       $scope.Notifications = [];
       $scope.Opponents = [];
       $scope.HasWon = false;
    }
])
.controller('ChatController', ['$scope', '$rootScope',
  function ($scope, $rootScope) {
     var AddMessageToChatHistory = function (message) {
        var lastMessage = $scope.ChatHistory[$scope.ChatHistory.length - 1];
        if (lastMessage && lastMessage.Name === message.Name && lastMessage.Time === message.Time)
           lastMessage.Message += ('<br />' + message.Message);
        else
           $scope.ChatHistory.push(message);
     };

     var adjustScroll = function () {
        //console.log('adj')
        //var chatHistory = document.getElementById('chat-history');
        //var isScrolledToBottom = chatHistory.scrollHeight - chatHistory.clientHeight <= chatHistory.scrollTop + 100;

        //console.log(isScrolledToBottom);
        //console.log({
        //   scrollHeight: chatHistory.scrollHeight,
        //   clientHeight: chatHistory.clientHeight,
        //   scrollTop: chatHistory.scrollTop
        //});

        //if (isScrolledToBottom)
        //   chatHistory.scrollTop = chatHistory.scrollHeight - chatHistory.clientHeight;
     };

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

     $scope.SendMessage = function () {
        ChatHubProxy.invoke('Send', $rootScope.Name, $scope.NewChatMessage);
        $scope.NewChatMessage = '';
        adjustScroll();
     };

     $scope.ToggleChatClosed = function() {
        $scope.ChatClosed = !$scope.ChatClosed;
     };

     $scope.ChatHistory = [];
     $scope.ChatClosed = false;
  }
]);