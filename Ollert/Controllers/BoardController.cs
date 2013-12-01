using Ollert.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Ollert.Models;
using System.IO;

namespace Ollert.Controllers
{
    [Authorize]
    public class BoardController : Controller
    {
        //
        // GET: /Board/
        public ActionResult Index()
        {
            return View();
        }

        #region User Requests
        public async Task<ActionResult> CurrentUser()
        {
            var userManager = new UserManager<OllertUser>(new UserStore<OllertUser>(new OllertDbContext()));
            var currentUser = await userManager.FindByIdAsync(this.User.Identity.GetUserId());

            var result = await Newtonsoft.Json.JsonConvert.SerializeObjectAsync(currentUser);

            return Content(result, "application/json");
        }

        public async Task<ActionResult> AvatarImage(string id)
        {
            var userManager = new UserManager<OllertUser>(new UserStore<OllertUser>(new OllertDbContext()));
            var user = await userManager.FindByIdAsync(id);
            if (user.Avatar == null)
            {
                user.Avatar = System.IO.File.ReadAllBytes(HttpContext.Request.MapPath(HttpContext.Request.ApplicationPath) + "/Content/images/avatar/avatarblue.png");
            }

            return File(user.Avatar, "image/png");
        }
        #endregion

        #region File Management
        public async Task<ActionResult> AddFileToCard(HttpPostedFileBase file, int cardId)
        {
            Fichier fichier = null;

            if (file.ContentLength != 0)
            {
                byte[] fileData = null;
                using (var binaryReader = new BinaryReader(file.InputStream))
                {
                    fileData = binaryReader.ReadBytes(file.ContentLength);
                }

                var db = new OllertDbContext();
                var carte = await db.Cartes.FirstAsync(c => c.Id == cardId);
                fichier = new Fichier
                {
                    Data = fileData,
                    Nom = file.FileName,
                    DateEnvoi = DateTime.Now,
                    ContentType = file.ContentType
                };
                carte.Fichiers.Add(fichier);

                await db.SaveChangesAsync();

                // Ajoute une notification
                await Ollert.Services.NotificationService.AddNotification(
                    "Fichier Ajouté", "{0} a ajouté un fichier a la carte : {1}".FormatWith(this.User.Identity.Name, carte.Titre), 
                    TypeNotification.AjoutFichier);
            }

            var result = await Newtonsoft.Json.JsonConvert.SerializeObjectAsync(fichier);

            return Content(result, "application/json");
        }

        public async Task<ActionResult> DownloadFile(int id, bool download = false)
        {
            var db = new OllertDbContext();
            var fichier = await db.Fichiers.FirstAsync(f => f.Id == id);

            if (!fichier.ContentType.Contains("image") && !download)
            {
                fichier.Data = System.IO.File.ReadAllBytes(HttpContext.Request.MapPath(HttpContext.Request.ApplicationPath) + "/Content/images/text_enriched.png");
            }

            return File(fichier.Data, fichier.ContentType);
        }
        #endregion
	}
}