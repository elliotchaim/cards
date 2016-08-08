namespace CardGame.Models
{
   using System;
   using System.Collections.Generic;

   public class Game
   {
      public string Id { get; set; } = Guid.NewGuid().ToString();
      public string Name { get; set; }
      public List< Player > Players { get; set; } = new List<Player>();
      public CardDeck Deck { get; set; } = new CardDeck();
      public bool Started { get; set; } = false;
      public int CurrentTurnPlayer { get; set; } = 0;
   }
}