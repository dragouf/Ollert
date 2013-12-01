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
        public static async Task AddNotification<T>(string titre, string message, TypeNotification type, T objetMessage) /*where T : IEntity*/
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<OllertHub>();
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

            var cookie = HttpContext.Current.Request.Cookies["signalr-conn-id"];
            var connectionID = "";
            if (cookie != null)
            {
                connectionID = HttpContext.Current.Request.Cookies["signalr-conn-id"].Value;
            }

            switch (type)
            {
                case TypeNotification.NouveauMessage: hubContext.Clients.AllExcept(connectionID).newMessage(objetMessage);
                    break;
                case TypeNotification.Mouvement: hubContext.Clients.AllExcept(connectionID).newMove(objetMessage);
                    break;
                case TypeNotification.NouvelleCarte: hubContext.Clients.AllExcept(connectionID).newCard(objetMessage);
                    break;
                case TypeNotification.EditionCarte: hubContext.Clients.AllExcept(connectionID).changeCard(objetMessage);
                    break;
                case TypeNotification.AjoutFichier: hubContext.Clients.AllExcept(connectionID).addFile(objetMessage);
                    break;
                case TypeNotification.SuppressionCarte: hubContext.Clients.AllExcept(connectionID).deleteCard(objetMessage); // TODO
                    break;
                case TypeNotification.SuppressionFichier: hubContext.Clients.AllExcept(connectionID).deleteFile(objetMessage);
                    break;
                case TypeNotification.SuppressionMessage: hubContext.Clients.AllExcept(connectionID).deleteMessage(objetMessage); // TODO
                    break;
                default:
                    break;
            }
            
            // Notification globale
            hubContext.Clients.AllExcept(connectionID).newNotification(notification);

            db.Dispose();
        }
    }
}