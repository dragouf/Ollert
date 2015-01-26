using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Ollert.Startup))]
namespace Ollert
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            ConfigureSignalR(app);
        }
    }
}
