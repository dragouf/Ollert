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
using System.Data.Entity.Validation;
using System.Diagnostics;

namespace Ollert.Api
{
    [Authorize]
    public class TableauController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/Tableau
        public async Task<IEnumerable<Tableau>> GetTableaux()
        {
            var tableaux = await db.Tableaux
                .Include(i => i.Cartes)
                .Include(i => i.Cartes.Select(c => c.Messages))
                .Include(i => i.Cartes.Select(c => c.Messages.Select(m => m.Utilisateur)))
                .ToListAsync();

            return tableaux;
        }

        // GET api/Tableau/5
        //[ResponseType(typeof(Tableau))]
        //public async Task<IHttpActionResult> GetTableau(int id)
        //{
        //    Tableau tableau = await db.Tableaux.FindAsync(id);
        //    if (tableau == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(tableau);
        //}

        // PUT api/Tableau/5
        //public async Task<IHttpActionResult> PutTableau(int id, Tableau tableau)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != tableau.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(tableau).State = EntityState.Modified;

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!TableauExists(id))
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

        // PUT api/Tableau/5
        public async Task<IHttpActionResult> PutTableau(int id, DeplacementModelView deplacement)
        {
            // Retrouve la carte
            var carte = await db.Cartes.FirstAsync(c => c.Id == deplacement.CarteId);
            if (carte == null || !TableauExists(deplacement.AncienTableauId) || !TableauExists(deplacement.NouveauTableauId))
            {
                return NotFound();
            }

            // Retrouve le tableau
            var nouveauTableau = await db.Tableaux.FirstAsync(t => t.Id == deplacement.NouveauTableauId);

            // Change le tableau de la carte
            carte.Tableau = nouveauTableau;

            await db.SaveChangesAsync();

            // Ajoute une notification
            await Ollert.Services.NotificationService.AddNotification<DeplacementModelView>(
                "Deplacement de carte",
                "La carte '{0}' a été deplacée vers '{1}' par {2}".FormatWith(carte.Titre, nouveauTableau.Nom, this.User.Identity.Name),
                TypeNotification.Mouvement,
                deplacement);

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Tableau
        //[ResponseType(typeof(Tableau))]
        //public async Task<IHttpActionResult> PostTableau(Tableau tableau)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Tableaux.Add(tableau);
        //    await db.SaveChangesAsync();

        //    return CreatedAtRoute("DefaultApi", new { id = tableau.Id }, tableau);
        //}

        // DELETE api/Tableau/5
        //[ResponseType(typeof(Tableau))]
        //public async Task<IHttpActionResult> DeleteTableau(int id)
        //{
        //    Tableau tableau = await db.Tableaux.FindAsync(id);
        //    if (tableau == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Tableaux.Remove(tableau);
        //    await db.SaveChangesAsync();

        //    return Ok(tableau);
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TableauExists(int id)
        {
            return db.Tableaux.Count(e => e.Id == id) > 0;
        }
    }
}