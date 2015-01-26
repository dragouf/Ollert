using System.Web;
using System.Web.Optimization;

namespace Ollert
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            // SCRIPTS
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/Scripts/jquery.validate*"));
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js"));
            bundles.Add(new ScriptBundle("~/bundles/libraries").Include(                      
                      "~/Scripts/knockout-{version}.js",
                      "~/Scripts/jquery-ui-{version}.js",
                      "~/Scripts/knockout-sortable.js",
                      "~/Scripts/jquery.slimscroll.js",
                      "~/Scripts/jquery.signalR-{version}.js",
                      "~/Scripts/jquery.cookie.js",
                      "~/Scripts/moment-with-langs.js",
                      "~/Scripts/dropzone.js",
                      "~/Scripts/jquery.gritter.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/pages/extensions.js"));
            bundles.Add(new ScriptBundle("~/bundles/ollert-engine").Include(
                "~/Scripts/pages/Classes/Global.js",

                "~/Scripts/pages/Classes/Attachment.js",     
                "~/Scripts/pages/Classes/Card.js",                
                "~/Scripts/pages/Classes/List.js",
                "~/Scripts/pages/Classes/Message.js",
                "~/Scripts/pages/Classes/Notification.js",
                "~/Scripts/pages/Classes/Step.js",
                "~/Scripts/pages/Classes/User.js",
                "~/Scripts/pages/Classes/BoardDetails.js",

                "~/Scripts/pages/Classes/Converter.js",
                "~/Scripts/pages/Classes/OllertApi.js",
                "~/Scripts/pages/Classes/Ollert.js",

                "~/Scripts/pages/Classes/Layout.js",
                "~/Scripts/pages/Classes/Board.js",
                "~/Scripts/pages/Classes/BoardsList.js"
                ));

            // CSS
            bundles.Add(new StyleBundle("~/css/global").Include(
                      "~/Content/site.css",
                      "~/Content/font-awesome.css",
                      "~/Content/dropzone.css",
                      "~/Content/jquery.gritter.css",                       
                      "~/Content/ace.css"));

            bundles.Add(new StyleBundle("~/css/bootstrap").Include("~/Content/bootstrap.css"));
        }
    }
}
