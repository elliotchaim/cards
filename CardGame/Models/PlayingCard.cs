namespace CardGame.Models
{
    using Infrastructure.Enums;

    public class PlayingCard
    {
        public Suit Suit { get; set; }
        public Rank Rank { get; set; }
    }
}