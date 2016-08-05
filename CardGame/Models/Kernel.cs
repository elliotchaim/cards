namespace CardGame.Models
{
   using System.Collections.Generic;

   public class Kernel
   {
      public static Kernel Instance { get; } = new Kernel();

      public Kernel()
      {
         Deck = new CardDeck();
         Players = new List< Player >();
      }

      public CardDeck Deck { get; set; }
      public List< Player > Players { get; set; }
      public bool GameStarted { get; set; } = false;
      public int CurrentTurnPlayer { get; set; } = 0;
   }
}