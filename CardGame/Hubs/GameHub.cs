namespace CardGame.Hubs
{
    using Microsoft.AspNet.SignalR;
    using Models;

    public class GameHub : Hub
    {
        public void Draw()
        {
            Clients.Caller.ReceiveCard(Kernel.Instance.Deck.Draw());
        }
    }
}