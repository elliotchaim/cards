namespace CardGame
{
   using Infrastructure;
   using System.Web.Mvc;
   using System.Web.Routing;
   using Castle.Windsor;
   using Castle.Windsor.Installer;

   public class MvcApplication: System.Web.HttpApplication
   {
      private static IWindsorContainer container;

      protected void Application_Start()
      {
         AreaRegistration.RegisterAllAreas();
         RouteConfig.RegisterRoutes(RouteTable.Routes);

         BootstrapWindsorContainer();
      }

      protected void Application_End()
      {
         container.Dispose();
      }

      private static void BootstrapWindsorContainer()
      {
         container = new WindsorContainer().Install(FromAssembly.This());
         var controllerFactory = new WindsorControllerFactory(container.Kernel);
         ControllerBuilder.Current.SetControllerFactory(controllerFactory);
      }
   }
}