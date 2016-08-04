namespace CardGame.Hubs
{
    using Microsoft.AspNet.SignalR;
    using System;

    public class ChatHub : Hub
   {
      public void Send( string name, string message )
      {
         if( string.IsNullOrWhiteSpace( message ) )
            return;
         if( string.IsNullOrWhiteSpace( name ) )
            name = "Anonymous User";

         Clients.All.ReceiveNewMessage( name, message, DateTime.Now.TimeOfDay );
      }
   }
}