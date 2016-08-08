namespace CardGame.Models
{
   using System.Collections.Generic;
   using System.Linq;

   public class Kernel
   {
      public static Kernel Instance { get; } = new Kernel();

      public Dictionary< string, Game > Games { get; set; } = new Dictionary< string, Game >();

      public List< Game > AvailableGames()
      {
         return Games.Where( x => !x.Value.Started ).Select( x => x.Value ).ToList();
      }

      public Game CreateGame( string name )
      {
         var game = new Game
                    {
                       Name = name
                    };
         Games.Add( game.Id, game );
         return game;
      }

      public void AddToGame( string gameId, string playerConnectionId )
      {
         Games[ gameId ].Players.Add( new Player { ConnectionId = playerConnectionId } );
      }
   }
}