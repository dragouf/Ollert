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
    [Authorize]
    public class CarteController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/Carte
        //public IQueryable<Carte> GetCartes()
        //{
        //    return db.Cartes;
        //}

        // GET api/Carte/5
        //[ResponseType(typeof(Carte))]
        //public async Task<IHttpActionResult> GetCarte(int id)
        //{
        //    Carte carte = await db.Cartes.FindAsync(id);
        //    if (carte == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(carte);
        //}

        // PUT api/Carte/5
        public async Task<IHttpActionResult> PutCarte(int id, Carte carte)
        {
            var carteBdd = await db.Cartes.FirstAsync(c => c.Id == id);
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (carteBdd == null || id != carte.Id)
            {
                return BadRequest();
            }

            carteBdd.NumeroDemande = carte.NumeroDemande;
            carteBdd.Titre = carte.Titre;
            carteBdd.Description = carte.Description;
            carteBdd.Estimation = carte.Estimation;

            //db.Entry(carte).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();

                // Ajoute une notification
                await Ollert.Services.NotificationService.AddNotification<Carte>(
                    "Carte Modifiée", "La carte '{0}' a été modifiée par {1}".FormatWith(carte.Titre, this.User.Identity.Name),
                    TypeNotification.EditionCarte,
                    carteBdd);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarteExists(id))
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

        // POST api/Carte
        [ResponseType(typeof(Carte))]
        public async Task<IHttpActionResult> PostCarte(Carte carte)
        {
            // Add current date
            carte.DateCreation = DateTime.Now;
            
            // find table
            var tableau = await db.Tableaux.FindAsync(carte.Tableau.Id);

            if (tableau == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Add to correct table
            carte.Tableau = tableau;

            db.Cartes.Add(carte);
            await db.SaveChangesAsync();

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<Carte>(
                "Carte Ajoutée", "La carte '{0}' a été ajouté par {1}".FormatWith(carte.Titre, this.User.Identity.Name),
                TypeNotification.NouvelleCarte,
                carte);

            return CreatedAtRoute("DefaultApi", new { id = carte.Id }, carte);
        }

        // DELETE api/Carte/5
        [ResponseType(typeof(Carte))]
        public async Task<IHttpActionResult> DeleteCarte(int id)
        {
            Carte carte = await db.Cartes.FindAsync(id);
            if (carte == null)
            {
                return NotFound();
            }

            db.Cartes.Remove(carte);
            await db.SaveChangesAsync();

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<Carte>(
                "Carte Ajoutée", "La carte '{0}' a été supprimée par {1}".FormatWith(carte.Titre, this.User.Identity.Name),
                TypeNotification.SuppressionCarte,
                carte);

            return Ok(carte);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CarteExists(int id)
        {
            return db.Cartes.Count(e => e.Id == id) > 0;
        }
    }
}