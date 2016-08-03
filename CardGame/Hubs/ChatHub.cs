namespace CardGame.Hubs
{
   using Microsoft.AspNet.SignalR;

   public class ChatHub : Hub
   {
      public void Send( string name, string message )
      {
         if( string.IsNullOrWhiteSpace( message ) )
            return;
         if( string.IsNullOrWhiteSpace( name ) )
            name = "Anonymous User";

         Clients.All.ReceiveNewMessage( name, message );
      }
   }
}