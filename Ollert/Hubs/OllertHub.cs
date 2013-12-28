using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Threading;
using Newtonsoft.Json;
using Ollert.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;

namespace Ollert.Hubs
{
    public class User
    {
        public string UserName { get; set; }
        public string EmailMd5 { get; set; }
        public bool UseGravatar { get; set; }
        public string UserId { get; set; }
        public HashSet<string> ConnectionIds { get; set; }
    }

    [Authorize]
    public class OllertHub : Hub
    {
        internal static readonly ConcurrentDictionary<string, User> ConnectedUsers = new ConcurrentDictionary<string, User>();
        public override Task OnConnected()
        {
            string userId = Guid.Empty.ToString();
            OllertUser currentUser = null;
            if (Context.User != null)
            {
                var db = new Ollert.DAL.OllertDbContext();
                userId = Context.User.Identity.GetUserId();
                currentUser = db.Users.First(u => u.Id == userId);
            }
                

            string connectionId = Context.ConnectionId;

            var user = ConnectedUsers.GetOrAdd(userId, _ => new User
            {
                UserName = Context.User != null ? Context.User.Identity.Name : "<anonyme>",
                UserId = userId,
                UseGravatar = currentUser != null ? currentUser.UseGravatar : false,
                EmailMd5 = currentUser != null ? currentUser.EmailMd5 : string.Empty,
                ConnectionIds = new HashSet<string>()
            });

            lock (user.ConnectionIds)
            {
                user.ConnectionIds.Add(connectionId);
            }

            this.Clients.All.onConnected(ConnectedUsers.Select(u => u.Value));

            return base.OnConnected();
        }

        public override Task OnDisconnected()
        {
            // Retire l'id de la liste
            foreach (var connectedUser in ConnectedUsers)
            {
                lock (connectedUser.Value.ConnectionIds)
                {
                    connectedUser.Value.ConnectionIds = connectedUser.Value.ConnectionIds.Where(c => !c.Equals(Context.ConnectionId)).ToHashSet();
                }

                if (!connectedUser.Value.ConnectionIds.Any())
                {
                    User removedUser;
                    ConnectedUsers.TryRemove(connectedUser.Key, out removedUser);
                }
            }
            
            // Send to js client
            Clients.Others.onDisconnected(ConnectedUsers.Select(u => u.Value));

            return base.OnDisconnected();
        }
    }
}