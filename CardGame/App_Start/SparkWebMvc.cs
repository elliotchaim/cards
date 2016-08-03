using Spark;
using Spark.Web.Mvc;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(CardGame.SparkWebMvc), "Start")]

namespace CardGame {
    public static class SparkWebMvc {
        public static void Start() {
            var settings = new SparkSettings();
            settings.SetAutomaticEncoding(true); 
            
            SparkEngineStarter.RegisterViewEngine(settings);
        }
    }
}
