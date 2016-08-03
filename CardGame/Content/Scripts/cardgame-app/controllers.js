cardGameApp.controller('GameController', ['$scope',
    function ($scope) {
        var CardToString = function (card) {
            return card.Rank + ' of ' + card.Suit;
        };

        var hubConnection = $.hubConnection();
        var GameHubProxy = hubConnection.createHubProxy('gameHub');

        GameHubProxy.on('ReceiveCard', function (card) {
            $scope.Output = CardToString(card);
        });

        hubConnection.start().done(function () {
            $scope.Draw = function () {
                GameHubProxy.invoke('Draw');
            };
        });

        $scope.Output = '';
    }
]);