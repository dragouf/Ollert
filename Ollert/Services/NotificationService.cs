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


            switch (type)
            {
                case TypeNotification.NouveauMessage: hubContext.Clients.All.newMessage(objetMessage);
                    break;
                case TypeNotification.Mouvement: hubContext.Clients.All.newMove(objetMessage);
                    break;
                case TypeNotification.NouvelleCarte: hubContext.Clients.All.newCard(objetMessage);
                    break;
                case TypeNotification.EditionCarte: hubContext.Clients.All.changeCard(objetMessage);
                    break;
                case TypeNotification.AjoutFichier: hubContext.Clients.All.addFile(objetMessage);
                    break;
                case TypeNotification.SuppressionCarte: hubContext.Clients.All.deleteCard(objetMessage);
                    break;
                default:
                    break;
            }
            
            // Notification globale
            hubContext.Clients.All.newNotification(notification);

            db.Dispose();
        }
    }
}