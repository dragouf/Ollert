using Microsoft.AspNet.SignalR;
using Ollert.DAL;
using Ollert.Hubs;
using Ollert.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Ollert.Services
{
    public class NotificationService
    {
        public static async Task AddNotification(string titre, string message, TypeNotification type) /*where T : IEntity*/
        {
            var hub = new OllertHub();
            var db = new OllertDbContext();

            var notification = new Notification
            {
                Date = DateTime.Now,
                Titre = titre,
                Texte = message,
                Type = type
            };

            db.Notifications.Add(notification);
            await db.SaveChangesAsync();

            var context = GlobalHost.ConnectionManager.GetHubContext<OllertHub>();
            context.Clients.All.newNotification(notification);

            db.Dispose();
        }
    }
}