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
         //if( !Kernel.Instance.GameStarted )
         //{
         Kernel.Instance.Players.Add(new Player
         {
            ConnectionId = Context.ConnectionId
         });
         //}
         return base.OnConnected();
      }

      public override Task OnDisconnected( bool stopCalled )
      {
         Kernel.Instance.Players.Remove(new Player
         {
            ConnectionId = Context.ConnectionId
         });
         return base.OnDisconnected(stopCalled);
      }

      public void Draw()
      {
         Clients.Caller.ReceiveCard(Kernel.Instance.Deck.Draw());
      }

      public void AddToFaceUpPile( PlayingCard card )
      {
         Clients.All.AddToFaceUpPile(card);
      }

      public void RemoveTopCardFromFaceUpPile()
      {
         Clients.All.RemoveTopCardFromFaceUpPile();
      }

      public void StartGame()
      {
         //if( Kernel.Instance.Players.Count < 2 )
         //   return;

         Kernel.Instance.GameStarted = true;
         Clients.All.GameStarted();

         Kernel.Instance.Deck = new CardDeck();
         DealCards();
         AddToFaceUpPile(Kernel.Instance.Deck.Draw());

         Clients.Client(Kernel.Instance.Players[ Kernel.Instance.CurrentTurnPlayer ].ConnectionId).StartTurn();
      }

      public void EndTurn( PlayingCard newTopCard, bool LastCardWasSwapped )
      {
         if( LastCardWasSwapped )
            RemoveTopCardFromFaceUpPile();
         AddToFaceUpPile(newTopCard);
         Kernel.Instance.CurrentTurnPlayer = ( Kernel.Instance.CurrentTurnPlayer == Kernel.Instance.Players.Count - 1 )
             ? 0
             : Kernel.Instance.CurrentTurnPlayer + 1;
         Clients.Client(Kernel.Instance.Players[ Kernel.Instance.CurrentTurnPlayer ].ConnectionId).StartTurn();
      }

      private void DealCards()
      {
         foreach( var i in Enumerable.Range(1, 7) )
         {
            foreach( var player in Kernel.Instance.Players )
            {
               Clients.Client(player.ConnectionId).ReceiveCard(Kernel.Instance.Deck.Draw());
            }
         }
      }
   }
}