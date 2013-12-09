using Microsoft.AspNet.SignalR;
using Ollert.DAL;
using Ollert.Hubs;
using Ollert.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;

namespace Ollert.Services
{
    public class NotificationService
    {
        public static async Task AddNotification<T>(string titre, string message, TypeNotification type, T objetMessage) /*where T : IEntity*/
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<OllertHub>();
            var db = new OllertDbContext();

            var userId = HttpContext.Current.User.Identity.GetUserId();
            var currentUser = await db.Users.FirstAsync(u => u.Id == userId);

            var notification = new Notification
            {
                Date = DateTime.Now,
                Titre = titre,
                Texte = message,
                Type = type,
                Createur = currentUser
            };

            db.Notifications.Add(notification);
            await db.SaveChangesAsync();

            //var cookie = HttpContext.Current.Request.Cookies["signalr-conn-id"];
            //var connectionID = "";
            //if (cookie != null)
            //{
                //connectionID = HttpContext.Current.Request.Cookies["signalr-conn-id"].Value;
            //}

            var userConnIds = OllertHub.ConnectedUsers.Where(u => u.Key == userId).SelectMany(u => u.Value.ConnectionIds.ToArray()).ToArray();

            switch (type)
            {
                case TypeNotification.NouveauMessage: hubContext.Clients.AllExcept(userConnIds).newMessage(objetMessage);
                    break;
                case TypeNotification.MouvementCarte: hubContext.Clients.AllExcept(userConnIds).newMove(objetMessage);
                    break;
                case TypeNotification.NouvelleCarte: hubContext.Clients.AllExcept(userConnIds).newCard(objetMessage);
                    break;
                case TypeNotification.EditionCarte: hubContext.Clients.AllExcept(userConnIds).changeCard(objetMessage);
                    break;
                case TypeNotification.AjoutFichier: hubContext.Clients.AllExcept(userConnIds).addFile(objetMessage);
                    break;
                case TypeNotification.SuppressionCarte: hubContext.Clients.AllExcept(userConnIds).deleteCard(objetMessage); // TODO
                    break;
                case TypeNotification.SuppressionFichier: hubContext.Clients.AllExcept(userConnIds).deleteFile(objetMessage);
                    break;
                case TypeNotification.SuppressionMessage: hubContext.Clients.AllExcept(userConnIds).deleteMessage(objetMessage); // TODO
                    break;
                case TypeNotification.AjoutEtape: hubContext.Clients.AllExcept(userConnIds).addStep(objetMessage); // TODO
                    break;
                case TypeNotification.SuppressionEtape: hubContext.Clients.AllExcept(userConnIds).deleteStep(objetMessage); // TODO
                    break;
                case TypeNotification.ModificationEtape: hubContext.Clients.AllExcept(userConnIds).changeStep(objetMessage); // TODO
                    break;
                default:
                    break;
            }
            
            // Notification globale
            hubContext.Clients.AllExcept(userConnIds).newNotification(notification);

            db.Dispose();
        }
    }
}