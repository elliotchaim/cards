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
         if( !Kernel.Instance.GameStarted )
         {
            Kernel.Instance.Players.Add( new Player
            {
               ConnectionId = Context.ConnectionId
            } );
         }
         return base.OnConnected();
      }

      public void Draw()
      {
         Clients.Caller.ReceiveCard( Kernel.Instance.Deck.Draw() );
      }

      public void AddToFaceUpPile(PlayingCard card)
      {
         Clients.All.AddToFaceUpPile( card );
      }

      public void StartGame()
      {
         if( Kernel.Instance.Players.Count < 2 )
            return;

         Kernel.Instance.GameStarted = true;
         Clients.All.GameStarted();

         Kernel.Instance.Deck = new CardDeck();
         DealCards();
         AddToFaceUpPile( Kernel.Instance.Deck.Draw() );

         Clients.Client( Kernel.Instance.Players[ Kernel.Instance.CurrentTurnPlayer ].ConnectionId ).StartTurn();
      }

      private void DealCards()
      {
         foreach( var i in Enumerable.Range( 1, 7 ) )
         {
            foreach( var player in Kernel.Instance.Players )
            {
               Clients.Client( player.ConnectionId ).ReceiveCard( Kernel.Instance.Deck.Draw() );
            }
         }
      }
   }
}