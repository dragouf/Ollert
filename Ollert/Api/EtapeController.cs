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
    public class EtapeController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/Etape
        //public IQueryable<CarteEtape> GetCarteEtapes()
        //{
        //    return db.CarteEtapes;
        //}

        // GET api/Etape/5
        //[ResponseType(typeof(CarteEtape))]
        //public async Task<IHttpActionResult> GetCarteEtape(int id)
        //{
        //    CarteEtape carteetape = await db.CarteEtapes.FindAsync(id);
        //    if (carteetape == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(carteetape);
        //}

        // PUT api/Etape/5
        public async Task<IHttpActionResult> PutCarteEtape(int id, CarteEtape carteetape)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            var etapeBdd = await db.CarteEtapes.Include(c => c.Carte).FirstAsync(c => c.Id == id);

            if (id != carteetape.Id || etapeBdd == null)
            {
                return BadRequest();
            }

            etapeBdd.Estimation = carteetape.Estimation;
            etapeBdd.Position = carteetape.Position;
            etapeBdd.Terminee = carteetape.Terminee;
            etapeBdd.Titre = carteetape.Titre;

            try
            {
                await db.SaveChangesAsync();

                // Ajoute une notification
                await Ollert.Services.NotificationService.AddNotification<CarteEtape>(
                    "Etape Modifiée", 
                    "L'etape '{0}' a été modifiée par {1}".FormatWith(etapeBdd.Titre, this.User.Identity.Name),
                    TypeNotification.ModificationEtape,
                    etapeBdd,
                    etapeBdd.Carte.Tableau.Salle.Id);
            }           
            catch (DbUpdateConcurrencyException)
            {
                if (!CarteEtapeExists(id))
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

        // POST api/Etape
        [ResponseType(typeof(CarteEtape))]
        public async Task<IHttpActionResult> PostCarteEtape(CarteEtape carteEtape)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            // find corresponding card
            var carte = await db.Cartes.FindAsync(carteEtape.Carte.Id);
            carteEtape.Carte = carte;

            db.CarteEtapes.Add(carteEtape);
            await db.SaveChangesAsync();

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<CarteEtape>(
                "Etape Ajoutée", "Une etape d'estimation a été ajoutée a la carte 'Demande {1}' par {0}".FormatWith(this.User.Identity.Name, carte.NumeroDemande),
                TypeNotification.AjoutEtape,
                carteEtape,
                carteEtape.Carte.Tableau.Salle.Id);

            return CreatedAtRoute("DefaultApi", new { id = carteEtape.Id }, carteEtape);
        }

        // DELETE api/Etape/5
        [ResponseType(typeof(CarteEtape))]
        public async Task<IHttpActionResult> DeleteCarteEtape(int id)
        {
            CarteEtape carteetape = await db.CarteEtapes.FindAsync(id);
            if (carteetape == null)
            {
                return NotFound();
            }

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<CarteEtape>(
                "Etape Supprimée", "L'etape '{0}' a été supprimé par {1}".FormatWith(carteetape.Titre, this.User.Identity.Name),
                TypeNotification.SuppressionEtape,
                carteetape,
                carteetape.Carte.Tableau.Salle.Id);

            db.CarteEtapes.Remove(carteetape);
            await db.SaveChangesAsync();

            return Ok(carteetape);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CarteEtapeExists(int id)
        {
            return db.CarteEtapes.Count(e => e.Id == id) > 0;
        }
    }
}