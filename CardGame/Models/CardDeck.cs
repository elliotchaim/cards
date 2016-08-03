namespace CardGame.Models
{
    using System.Collections.Generic;
    using Infrastructure.Enums;
    using System;
    using Infrastructure.Extensions;
    using System.Linq;
    public class CardDeck
    {
        private IList<PlayingCard> Cards { get; set; }

        public CardDeck()
        {
            Cards = NewDeck().Shuffle();
        }

        public PlayingCard Draw()
        {
            PlayingCard result = Cards.First();
            Cards.RemoveAt(0);
            return result;
        }

        public void Shuffle()
        {
            Cards = Cards.Shuffle();
        }

        private static IList<PlayingCard> NewDeck()
        {
            var deck = new List<PlayingCard>();
            foreach(Suit suit in Enum.GetValues(typeof(Suit)))
            {
                foreach(Rank rank in Enum.GetValues(typeof(Rank)))
                {
                    deck.Add(new PlayingCard
                    {
                        Suit = suit,
                        Rank = rank
                    });
                }
            }
            return deck;
        }
    }
}