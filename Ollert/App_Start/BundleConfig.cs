using System.Web;
using System.Web.Optimization;

namespace Ollert
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/libraries").Include(
                      "~/Scripts/knockout-3.0.0.js",
                      "~/Scripts/jquery-ui-1.10.3.js",
                      "~/Scripts/knockout-sortable.js",
                      "~/Scripts/jquery.slimscroll.js",
                      "~/Scripts/jquery.signalR-2.0.0.js",
                      "~/Scripts/jquery.cookie.js",
                      "~/Scripts/moment-with-langs.js",
                      "~/Scripts/dropzone.js",
                      "~/Scripts/jquery.gritter.js",                      
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/site.css",
                      "~/Content/font-awesome.css",
                       "~/Content/dropzone.css",
                       "~/Content/jquery.gritter.css",                       
                        "~/Content/ace.css"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
                      "~/Content/bootstrap.css"));
        }
    }
}
