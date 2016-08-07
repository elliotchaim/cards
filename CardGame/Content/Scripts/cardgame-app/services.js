'use strict';

angular.module('CardGameApp')
   .factory('PlayingCardService',
      function() {
         var suitToOrder = function(suit) {
            switch (suit.toLowerCase()) {
               case 'hearts':
                  return 1;
               case 'diamonds':
                  return 2;
               case 'spades':
                  return 3;
               case 'clubs':
                  return 4;
               default:
                  return 0;
            }
         };

         var rankToOrder = function (rank) {
            if (typeof (rank) === 'number')
               return rank;

            switch (rank.toLowerCase()) {
               case 'ace':
                  return 1;
               case 'jack':
                  return 11;
               case 'queen':
                  return 12;
               case 'king':
                  return 13;
               default:
                  return 0;
            }
         };

         var sort = function (hand) {
            return hand.sort((a, b) => rankToOrder(a.Rank) - rankToOrder(b.Rank));
         };
         
         return {
            sort: sort
         }
      }
   );