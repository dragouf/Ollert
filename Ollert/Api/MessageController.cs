using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Ollert.Models;
using Ollert.DAL;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Ollert.Api
{
    [Authorize]
    public class MessageController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/Message
        public async Task<IEnumerable<Message>> GetMessages()
        {
            return await db.Messages.ToListAsync();
        }

        // GET api/Message/5
        //[ResponseType(typeof(Message))]
        //public async Task<IHttpActionResult> GetMessage(int id)
        //{
        //    Message message = await db.Messages.FindAsync(id);
        //    if (message == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(message);
        //}

        // PUT api/Message/5
        //public async Task<IHttpActionResult> PutMessage(int id, Message message)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != message.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(message).State = EntityState.Modified;

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!MessageExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // POST api/Message
        [ResponseType(typeof(Message))]
        public async Task<IHttpActionResult> PostMessage(Message message)
        {
            var userId = this.User.Identity.GetUserId();
            var currentUser = await db.Users.FirstAsync(u => u.Id == userId);

            message.CreateOn = DateTime.Now;
            message.Utilisateur = currentUser;

            // find corresponding card
            var carte = await db.Cartes.FindAsync(message.Carte.Id);
            message.Carte = carte;

            //if (carte== null || !ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            db.Messages.Add(message);
            await db.SaveChangesAsync();

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<Message>(
                "Message Ajouté", "Un message a été ajouté a la carte 'Demande {1}' par {0}".FormatWith(this.User.Identity.Name, carte.NumeroDemande),
                TypeNotification.NouveauMessage,
                message);

            return CreatedAtRoute("DefaultApi", new { id = message.Id }, message);
        }

        // DELETE api/Message/5
        [ResponseType(typeof(Message))]
        public async Task<IHttpActionResult> DeleteMessage(int id)
        {
            Message message = await db.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<Message>(
                "Message Supprimé", "Le message du '{0}' a été supprimé par {1}".FormatWith(message.CreateOn.ToShortDateString(), this.User.Identity.Name),
                TypeNotification.SuppressionMessage,
                message);

            db.Messages.Remove(message);
            await db.SaveChangesAsync();

            return Ok(message);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MessageExists(int id)
        {
            return db.Messages.Count(e => e.Id == id) > 0;
        }
    }
}