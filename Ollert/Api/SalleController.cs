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

namespace Ollert.Api
{
    public class SalleController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/Salle
        public IQueryable<Salle> GetSalles()
        {
            return db.Salles;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != salle.Id)
            {
                return BadRequest();
            }

            db.Entry(salle).State = EntityState.Modified;

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