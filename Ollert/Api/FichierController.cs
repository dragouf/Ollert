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
using System.Web;

namespace Ollert.Api
{
    [Authorize]
    public class FichierController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/Fichier
        public IQueryable<Fichier> GetFichiers()
        {
            return db.Fichiers;
        }

        // GET api/Fichier/5
        [ResponseType(typeof(Fichier))]
        public async Task<IHttpActionResult> GetFichier(int id)
        {
            Fichier fichier = await db.Fichiers.FindAsync(id);
            if (fichier == null)
            {
                return NotFound();
            }

            return Ok(fichier);
        }

        // PUT api/Fichier/5
        public async Task<IHttpActionResult> PutFichier(int id, Fichier fichier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != fichier.Id)
            {
                return BadRequest();
            }

            db.Entry(fichier).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FichierExists(id))
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

        // POST api/Fichier
        [ResponseType(typeof(Fichier))]
        public async Task<IHttpActionResult> PostFichier(Fichier fichier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Fichiers.Add(fichier);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = fichier.Id }, fichier);
        }

        // DELETE api/Fichier/5
        [ResponseType(typeof(Fichier))]
        public async Task<IHttpActionResult> DeleteFichier(int id)
        {
            Fichier fichier = await db.Fichiers.FindAsync(id);
            if (fichier == null)
            {
                return NotFound();
            }

            db.Fichiers.Remove(fichier);
            await db.SaveChangesAsync();

            return Ok(fichier);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FichierExists(int id)
        {
            return db.Fichiers.Count(e => e.Id == id) > 0;
        }
    }
}