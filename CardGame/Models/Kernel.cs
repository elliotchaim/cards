namespace CardGame.Models
{
    using System.Collections.Generic;

    public class Kernel
    {
        public static Kernel Instance { get; } = new Kernel();

        public Kernel()
        {
            Deck = new CardDeck();
            Players = new List<Player>();
        }

        public CardDeck Deck { get; set; }
        public List<Player> Players { get; set; }
    }
}