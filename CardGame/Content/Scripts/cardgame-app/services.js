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
               case 'two':
                  return 2;
               case 'three':
                  return 3;
               case 'four':
                  return 4;
               case 'five':
                  return 5;
               case 'six':
                  return 6;
               case 'seven':
                  return 7;
               case 'eight':
                  return 8;
               case 'nine':
                  return 9;
               case 'ten':
                  return 10;
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

         var markAnySetWithCardAtIndex = function (hand, startIndex) {
            var count = 1;
            var i = startIndex + 1;
            while (hand[i] && hand[startIndex].Rank === hand[i].Rank) {
               if (!hand[i].Checked) {
                  count += 1;
               }
               i += 1;
            }

            if (count < 3)
               return false;

            for (var j = startIndex; j < startIndex + count; j++) {
               hand[j].Checked = true;
               hand[j].Colour = getSetColour(startIndex);
            }

            return true;
         };
         
         var cardsAreConsecutive = function (run) {
            return ((rankToOrder(run[0].Rank) === rankToOrder(run[1].Rank) - 1)
                 && (rankToOrder(run[1].Rank) === rankToOrder(run[2].Rank) - 1)
                 && (!run[3] || (rankToOrder(run[2].Rank) === rankToOrder(run[3].Rank) - 1)));
         };

         var markAnyRunWithCardStartingAt = function (hand, index) {
            var run = hand.filter(x => !x.Checked && x.Suit === hand[index].Suit);
            if (run.length < 3)
               return false;
            sort(run);

            if (!cardsAreConsecutive(run))
               return false;

            run.forEach(function (card) {
               card.Checked = true;
               card.Colour = getSetColour(index);
            });
            return true;
         };

         var getSetColour = function(index) {
            return index < 3 ? 'lightsalmon' : 'lightgreen';
         };

         /**
          The basic goal in any form of rummy is to build melds which consists of
            - sets, three or four of a kind of the same rank; or
            - runs, three or more cards in sequence, of the same suit.
          */
         var isWinningHand = function (input) {
            if (input.length !== 7)
               return false;

            var cards = sort(input);

            for (var i = 0; i < 7; i++) {
               if (cards[i].Checked || markAnyRunWithCardStartingAt(cards, i) || markAnySetWithCardAtIndex(cards, i))
                  continue;
               return false;
            }

            return true;
         };
         
         return {
            sort: sort,
            isWinningHand: isWinningHand
         }
      }
   );