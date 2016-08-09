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

         var sizeOfFirstMeld = function(hand) {
            if (hand[0].Rank === hand[2].Rank) {
               if (hand[3] && (hand[3].Rank === hand[0].Rank)) {
                  return 4;
               }
               return 3;
            }

            var baseRank = rankToOrder(hand[0].Rank);
            if ((hand[0].Suit === hand[1].Suit) && (hand[0].Suit === hand[2].Suit) && (rankToOrder(hand[1].Rank) === baseRank + 1) && (rankToOrder(hand[2].Rank) === baseRank + 2)) {
               if (hand[3] && (hand[3].Suit === hand[0].Suit) && (rankToOrder(hand[3].Rank) === baseRank + 3)) {
                  return 4;
               }
               return 3;
            }
            return 0;
         };

         var sizeOfRunStartingAt = function (hand, startIndex) {
            var count = 1;
            var i = startIndex + 1;
            while (hand[i] && hand[startIndex].Rank === hand[i].Rank) {
               if (!hand[i].Checked) {
                  count += 1;
               }
               i += 1;
            }
            return count;

            //if (hand[startIndex].Rank === hand[startIndex + 2].Rank) {
            //   if (hand[startIndex + 3] && (hand[startIndex + 3].Rank === hand[startIndex].Rank)) {
            //      return 4;
            //   }
            //   return 3;
            //}
            //return 0;
         };

         var sizeOfSetWithCardAtIndex = function (hand, startIndex) {

         };
            

         var setColourOfCardsInRange = function(hand, startIndex, lastIndex, colour) {
            for (var i = startIndex; i < lastIndex; i++) {
               hand[i].Colour = colour;
            }
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
               if (cards[i].Checked)
                  continue;

               var sizeOfRun = sizeOfRunStartingAt(cards, i);
               if (sizeOfRun > 2) {
                  //mark first (size) cards as checked
                  continue;
               } else {
                  var sizeOfSet = sizeOfSetWithCardAtIndex(cards, i);
                  if (sizeOfSet > 2) {
                     //mark those cards as checked 
                     continue;
                  }
               }

               return false;
            }
            return true;




            //var meldSize = sizeOfFirstMeld(hand);
            //if (meldSize > 0) {
            //   setColourOfCardsInRange(hand, 0, meldSize, 'lightgreen');
            //   if (sizeOfFirstMeld(hand.slice(meldSize, 7)) !== -1) {
            //      setColourOfCardsInRange(hand, meldSize, 7, 'lightsalmon');
            //      return true;
            //   }
            //}

            return false;
         };
         
         return {
            sort: sort,
            isWinningHand: isWinningHand
         }
      }
   );