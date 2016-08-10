namespace CardGame.Models
{
   using System.Collections.Generic;
   using System.Linq;

   public class Kernel
   {
      public static Kernel Instance { get; } = new Kernel();

      public Dictionary< string, Game > Games { get; set; } = new Dictionary< string, Game >();
      public Dictionary< string, string > PlayersGameId { get; set; } = new Dictionary< string, string >();

      public List< Game > AllGames()
      {
         return Games.Select( x => x.Value ).OrderBy( x => x.Name ).ToList();
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

      public void AddToGame( string gameId, string playerConnectionId, string playerName )
      {
         PlayersGameId[ playerConnectionId ] = gameId;
         Games[ gameId ].Players.Add( new Player { ConnectionId = playerConnectionId, Name = playerName } );
      }

      public void RemovePlayer( string playerConnectionId, string gameId )
      {
         if( !Games.Keys.Contains( gameId ) )
            return;
         var game = Games[ gameId ];
         game.Players.RemoveAll( x => x.ConnectionId == playerConnectionId );
         if( game.Started )
         {
            game.Abandoned = true;
         }
         if( game.Players.Count == 0 )
         {
            Games.Remove( gameId );
         }
      }
   }
}