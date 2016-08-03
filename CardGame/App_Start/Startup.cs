using Owin;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(CardGame.Startup))]

namespace CardGame
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}