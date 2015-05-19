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
    public class SalleController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/Salle
        public async Task<IEnumerable<Salle>> GetSalles()
        {
            var currentUserId = this.User.Identity.GetUserId();

            var salles = db.Salles
                .Include(s => s.ParticipantsSalle)
                .Include(s => s.ParticipantsSalle.Select(p => p.Participant))
                .Include(s => s.ParticipantsSalle.Select(p => p.Salle))
                .Include(s => s.Proprietaire)
                .Where(s => s.Proprietaire.Id == currentUserId || s.ParticipantsSalle.Count(p => p.Participant.Id == currentUserId) > 0);

            return await salles.ToListAsync();
        }

        // GET api/Salle/5
        [ResponseType(typeof(Salle))]
        public async Task<IHttpActionResult> GetSalle(int id)
        {
            Salle salle = await db.Salles.FindAsync(id);
            if (salle == null)
            {
                return NotFound();
            }

            return Ok(salle);
        }

        // PUT api/Salle/5
        public async Task<IHttpActionResult> PutSalle(int id, Salle salle)
        {
            var salleBdd = await db.Salles
                .Include(s => s.Proprietaire)
                .Include(s => s.ParticipantsSalle)
                .Include(s => s.ParticipantsSalle.Select(p => p.Participant))
                .FirstOrDefaultAsync(s => s.Id == id);

            if (id != salle.Id || salleBdd == null)
                return BadRequest();
            if (salleBdd.Proprietaire.Id != this.User.Identity.GetUserId())
                return BadRequest();

            var participantsIds = salle.ParticipantsSalle.Select(p => p.Participant.Id).Distinct().ToList();
            var participantsBdd = await db.Users.Where(u => participantsIds.Contains(u.Id)).ToListAsync();
            salleBdd.Nom = salle.Nom;

            salleBdd.ParticipantsSalle.ToList().ForEach(p => db.ParticipantsSalles.Remove(p));

            foreach (var participant in participantsBdd)
            {
                var participantsSalle = new ParticipantSalle
                {
                    Participant = participant
                };

                salleBdd.ParticipantsSalle.Add(participantsSalle);
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Salle
        [ResponseType(typeof(Salle))]
        public async Task<IHttpActionResult> PostSalle(Salle salle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var currentUserId = this.User.Identity.GetUserId();
            var currentUser = await db.Users.FirstAsync(u => u.Id == currentUserId);

            salle.Proprietaire = currentUser;

            db.Salles.Add(salle);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = salle.Id }, salle);
        }

        // DELETE api/Salle/5
        [ResponseType(typeof(Salle))]
        public async Task<IHttpActionResult> DeleteSalle(int id)
        {
            Salle salle = await db.Salles.FindAsync(id);
            if (salle == null)
            {
                return NotFound();
            }

            db.Salles.Remove(salle);
            await db.SaveChangesAsync();

            return Ok(salle);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SalleExists(int id)
        {
            return db.Salles.Count(e => e.Id == id) > 0;
        }
    }
}