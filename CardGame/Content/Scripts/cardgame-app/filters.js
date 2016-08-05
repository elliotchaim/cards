'use strict';

angular.module('CardGameApp')
   .filter('RenderCard', [
      '$document',
      function($document) {
         var newElement = function(element, newClass) {
            var result = angular.element('<' + element + '></' + element + '>');
            if (typeof (newClass) === 'string')
               result.addClass(newClass);
            return result;
         };

         var newDiv = function(newClass) {
            return newElement('div', newClass);
         };

         var newSpan = function(newClass) {
            return newElement('span', newClass);
         };

         var suitToCssClass = function(suit) {
            switch (suit.toLowerCase()) {
            case 'hearts':
               return 'heart';
            case 'diamonds':
               return 'diamond';
            case 'spades':
               return 'spade';
            case 'clubs':
               return 'club';
            default:
               return '';
            }
         };

         var suitToHtmlEntity = function(suit) {
            switch (suit.toLowerCase()) {
            case 'hearts':
               return '&hearts;';
            case 'diamonds':
               return '&diams;';
            case 'spades':
               return '&spades;';
            case 'clubs':
               return '&clubs;';
            default:
               return '';
            }
         };

         var rankToDisplayRank = function(rank) {
            switch (rank.toLowerCase()) {
            case 'ace':
               return 'A';
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
               return 'J';
            case 'queen':
               return 'Q';
            case 'king':
               return 'K';
            default:
               return '';
            }
         };

         var renderMiddle = function(card) {
            var suitPositions = [];
            var innerHtml = suitToHtmlEntity(card.Suit);
            var contentClass = 'suit';

            switch (card.Rank.toLowerCase()) {
            case 'jack':
            case 'queen':
            case 'king':
               contentClass = 'face';
               innerHtml = newElement('img').prop('src', '/Content/Images/cards/face-' + card.Rank.toLowerCase() + '-' + suitToCssClass(card.Suit) + '.png');
            case 'ace':
               suitPositions.push('middle_center');
               break;
            case 'ten':
               suitPositions.push('middle_top_right');
               suitPositions.push('middle_top_left');
               suitPositions.push('middle_bottom_right');
               suitPositions.push('middle_bottom_left');
               suitPositions.push('middle_top_center');
               suitPositions.push('middle_bottom_center');
               suitPositions.push('top_left');
               suitPositions.push('top_right');
               suitPositions.push('bottom_left');
               suitPositions.push('bottom_right');
               break;
            case 'nine':
               suitPositions.push('middle_top_right');
               suitPositions.push('middle_top_left');
               suitPositions.push('middle_bottom_right');
               suitPositions.push('middle_bottom_left');
               suitPositions.push('middle_center');
               suitPositions.push('top_left');
               suitPositions.push('top_right');
               suitPositions.push('bottom_left');
               suitPositions.push('bottom_right');
               break;
            case 'eight':
               suitPositions.push('middle_bottom');
            case 'seven':
               suitPositions.push('middle_top');
            case 'six':
               suitPositions.push('top_left');
               suitPositions.push('top_right');
               suitPositions.push('middle_left');
               suitPositions.push('middle_right');
               suitPositions.push('bottom_left');
               suitPositions.push('bottom_right');
               break;
            case 'five':
               suitPositions.push('middle_center');
            case 'four':
               suitPositions.push('top_left');
               suitPositions.push('top_right');
               suitPositions.push('bottom_left');
               suitPositions.push('bottom_right');
               break;
            case 'three':
               suitPositions.push('middle_center');
            case 'two':
               suitPositions.push('top_center');
               suitPositions.push('bottom_center');
               break;
            default:
               return newDiv();
            }

            var result = newDiv();
            suitPositions.forEach(function(position) {
               result = result.append(newSpan(contentClass + ' ' + position).html(innerHtml));
            });
            return result;
         };

         return function(card) {
            if (!card) return null;

            var spanRank = () => newSpan('number').html(rankToDisplayRank(card.Rank));
            var spanSuit = () => newSpan('span').html(suitToHtmlEntity(card.Suit));
            var topCorner = newDiv('corner top').append(spanRank()).append(spanSuit());
            var bottomCorner = newDiv('corner bottom').append(spanRank()).append(spanSuit());
            var middle = renderMiddle(card);

            var newCardInnerDiv = newDiv('card-' + card.Rank.toLowerCase() + ' ' + suitToCssClass(card.Suit))
               .append(topCorner)
               .append(middle)
               .append(bottomCorner);

            var newCard = newDiv('card').html(newCardInnerDiv);

            return newCard[0].outerHTML;
         }
      }
   ]);