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
            bundles.Add(new ScriptBundle("~/bundles/page-global").Include("~/Scripts/pages/global.js"));
            bundles.Add(new ScriptBundle("~/bundles/page-salles").Include("~/Scripts/pages/salles.js"));
            bundles.Add(new ScriptBundle("~/bundles/page-liste").Include("~/Scripts/pages/liste.js"));

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
