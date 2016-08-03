using Owin;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(CardGame.Startup))]

namespace CardGame
{
   using Microsoft.AspNet.SignalR;

   public class Startup
    {
        public void Configuration(IAppBuilder app)
      {
         var hubConfiguration = new HubConfiguration
         {
            EnableDetailedErrors = true
         };
         app.MapSignalR( hubConfiguration );
      }
    }
}