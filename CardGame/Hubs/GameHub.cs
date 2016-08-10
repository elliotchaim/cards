namespace CardGame.Hubs
{
   using System.Threading.Tasks;
   using Microsoft.AspNet.SignalR;
   using Models;
   using System.Linq;

   public class GameHub: Hub
   {
      public override Task OnConnected()
      {
         Clients.Caller.UpdateGamesDirectory( Kernel.Instance.AllGames() );
         return base.OnConnected();
      }

      public override Task OnDisconnected(bool stopCalled)
      {
         RemovePlayerFromGame();
         UpdateGamesDirectory();
         return base.OnDisconnected( stopCalled);
      }

      private void RemovePlayerFromGame()
      {
         var playerId = Context.ConnectionId;

         if( !Kernel.Instance.PlayersGameId.Keys.Contains( playerId ) )
            return;

         var gameId = Kernel.Instance.PlayersGameId[ playerId ];
         Groups.Remove( playerId, gameId );
         Kernel.Instance.RemovePlayer( playerId, gameId );

         if( Kernel.Instance.Games.Keys.Contains( gameId ) && Kernel.Instance.Games[gameId].Abandoned )
         {
            Clients.OthersInGroup( gameId ).AbandonGame( "A player has left the game." );
         }
      }

      public void CreateGame( string name )
      {
         Kernel.Instance.CreateGame( name );
         UpdateGamesDirectory();
      }

      private void UpdateGamesDirectory()
      {
         Clients.All.UpdateGamesDirectory( Kernel.Instance.AllGames() );
      }

      public void JoinGame( string gameId, string playerName )
      {
         Kernel.Instance.AddToGame( gameId, Context.ConnectionId, playerName );
         Groups.Add( Context.ConnectionId, gameId );
         Clients.Caller.AddToGame( gameId );
         UpdateGamesDirectory();
      }

      public void Draw( string gameId )
      {
         Clients.Caller.ReceiveCard( Kernel.Instance.Games[ gameId ].Deck.Draw() );
      }

      public void StartGame( string gameId )
      {
         if( Kernel.Instance.Games[ gameId ].Players.Count < 2 )
            return;

         Kernel.Instance.Games[ gameId ].Started = true;
         Clients.Group( gameId ).GameStarted();
         UpdateGamesDirectory();

         DealCards( gameId );
         AddToFaceUpPile( gameId, Kernel.Instance.Games[ gameId ].Deck.Draw() );

         Clients.Client( Kernel.Instance.Games[ gameId ].Players[ Kernel.Instance.Games[ gameId ].CurrentTurnPlayer ].ConnectionId ).StartTurn();
      }

      public void EndTurn( string gameId, PlayingCard newTopCard, bool LastCardWasSwapped )
      {
         if( LastCardWasSwapped )
            RemoveTopCardFromFaceUpPile( gameId );
         AddToFaceUpPile( gameId, newTopCard );
         Kernel.Instance.Games[ gameId ].CurrentTurnPlayer = ( Kernel.Instance.Games[ gameId ].CurrentTurnPlayer == Kernel.Instance.Games[ gameId ].Players.Count - 1 )
                                                                ? 0
                                                                : Kernel.Instance.Games[ gameId ].CurrentTurnPlayer + 1;
         Clients.Client( Kernel.Instance.Games[ gameId ].Players[ Kernel.Instance.Games[ gameId ].CurrentTurnPlayer ].ConnectionId ).StartTurn();
      }

      private void AddToFaceUpPile( string gameId, PlayingCard card )
      {
         Clients.Group( gameId ).AddToFaceUpPile( card );
      }

      private void RemoveTopCardFromFaceUpPile( string gameId )
      {
         Clients.Group( gameId ).RemoveTopCardFromFaceUpPile();
      }

      private void DealCards( string gameId )
      {
         foreach( var i in Enumerable.Range( 1, 7 ) )
         {
            foreach( var player in Kernel.Instance.Games[ gameId ].Players )
            {
               Clients.Client( player.ConnectionId ).ReceiveCard( Kernel.Instance.Games[ gameId ].Deck.Draw() );
            }
         }
      }
   }
}