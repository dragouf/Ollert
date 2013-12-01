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

namespace Ollert.Hubs
{
    [Authorize]
    public class OllertHub : Hub
    {
        //public void NewMessage()
        //{
            
        //}
        //public void NewCard()
        //{

        //}
        //public void ChangeCard()
        //{

        //}
        //public void NewFile()
        //{

        //}
        //public void NewMove()
        //{
        //    //Clients.All.newNotification(new Notification());
        //}
        //public void NewNotification(Notification notification)
        //{
        //    Clients.All.newNotification(notification);
        //}
    }
}