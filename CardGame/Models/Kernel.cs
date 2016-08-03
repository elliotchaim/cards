namespace CardGame.Models
{
    public class Kernel
    {
        public static Kernel Instance { get; } = new Kernel();

        public Kernel()
        {
            Deck = new CardDeck();
        }

        public CardDeck Deck { get; set; }
    }
}