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
            var carteBdd = await db.Cartes
                .Include(c => c.Tableau)
                .Include(c => c.CartesVues)
                .Include(c => c.CartesVues.Select(cv => cv.Utilisateur))
                .FirstAsync(c => c.Id == id);

            if (carteBdd == null || id != carte.Id)
            {
                return BadRequest();
            }

            bool isModified = true;
            string message = string.Empty;

            if (carteBdd.NumeroDemande.Equals(carte.NumeroDemande) &&
                carteBdd.Titre.Equals(carte.Titre) &&
                carteBdd.Description.Equals(carte.Description) &&
                carteBdd.Archive.Equals(carte.Archive))
            {
                isModified = false;
            }
            else
            {
                if (!carteBdd.NumeroDemande.Equals(carte.NumeroDemande))
                    message = "Le numero de demande de la carte 'Demande {0}' a été modifié par {1}";
                if (!carteBdd.Titre.Equals(carte.Titre))
                    message = "Le titre de la carte 'Demande {0}' a été modifié par {1}";
                if (!carteBdd.Description.Equals(carte.Description))
                    message = "La description de la carte 'Demande {0}' a été modifiée par {1}";
                if (!carteBdd.Archive.Equals(carte.Archive) && carte.Archive)
                    message = "La carte 'Demande {0}' a été archivee par {1}";
                else if (!carteBdd.Archive.Equals(carte.Archive) && !carte.Archive)
                    message = "La carte 'Demande {0}' a été restauree par {1}";

                message = message.FormatWith(carteBdd.NumeroDemande, this.User.Identity.Name);
            }

            carteBdd.NumeroDemande = carte.NumeroDemande;
            carteBdd.Titre = carte.Titre;
            carteBdd.Description = carte.Description;
            carteBdd.Archive = carte.Archive;

            // date a laquelle la carte a ete ouverte
            string userId = this.User.Identity.GetUserId();
            var carteVue = carteBdd.CartesVues.FirstOrDefault(c => c.Utilisateur.Id == userId);
            if (carteVue != null)
            {
                carteVue.DerniereConsultation = carte.LastTimeViewed;
            }
            else
            {
                var currentUser = await db.Users.FirstAsync(u => u.Id == userId);

                carteVue = new CarteVue {
                    DerniereConsultation = carte.LastTimeViewed,
                    Utilisateur = currentUser,
                    Carte = carteBdd
                };

                carteBdd.CartesVues.Add(carteVue);
            }

            try
            {
                await db.SaveChangesAsync();

                if (isModified)
                {
                    // Ajoute une notification
                    await Ollert.Services.NotificationService.AddNotification<Carte>(
                        "Carte Modifiée", 
                        message,
                        TypeNotification.EditionCarte,
                        carteBdd,
                        carteBdd.Tableau.Salle.Id);
                }
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

            //if (tableau == null || !ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            // Add to correct table
            carte.Tableau = tableau;

            // carte vue pour notification
            var userId = this.User.Identity.GetUserId();
            var currentUser = await db.Users.FirstAsync(u => u.Id == userId);
            var carteVue = new CarteVue
            {
                DerniereConsultation = carte.LastTimeViewed,
                Utilisateur = currentUser,
                Carte = carte
            };
            carte.CartesVues.Clear(); // Il s' agit d' une nouvelle carte, la liste peut etre videe
            carte.CartesVues.Add(carteVue);
           
            db.Cartes.Add(carte);

            await db.SaveChangesAsync();

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<Carte>(
                "Carte Ajoutée", 
                "La carte 'Demande {0}' a été ajouté par {1}".FormatWith(carte.NumeroDemande, this.User.Identity.Name),
                TypeNotification.NouvelleCarte,
                carte,
                carte.Tableau.Salle.Id);

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

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<Carte>(
                "Carte Supprimée", 
                "La carte 'Demande {0}' a été supprimée par {1}".FormatWith(carte.NumeroDemande, this.User.Identity.Name),
                TypeNotification.SuppressionCarte,
                carte,
                carte.Tableau.Salle.Id);

            db.Cartes.Remove(carte);
            await db.SaveChangesAsync();

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