namespace Ollert.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Ollert.DAL;
    using Ollert.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Data.Entity.Validation;
    using System.Diagnostics;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Ollert.DAL.OllertDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(Ollert.DAL.OllertDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            var userManager = new UserManager<OllertUser>(new UserStore<OllertUser>(new OllertDbContext()));
            var user = new OllertUser() { UserName = "Admin" };
            var userResult = userManager.Create(user, "123456");

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            var tableau1 = new Tableau { Nom = "Attente Estimation", Position = 0 };

            var carte = new Carte
            {
                Titre = "Un exemple de carte 1",
                Description = @"il faut vraiment le faire!",
                NumeroDemande = 40,
                DateCreation = DateTime.Now,
                Estimation = 1200
            };
            tableau1.Cartes = new List<Carte>();
            tableau1.Cartes.Add(carte);

            var message = new Message
            {
                Texte = "Hi, do it quickly!",
                CreateOn = DateTime.Now,
                Utilisateur = context.Users.First()
            };

            carte.Messages = new List<Message>();
            carte.Messages.Add(message);

            context.Tableaux.AddOrUpdate(
              T => T.Nom,
              tableau1,
              new Tableau { Nom = "Attente Validation", Position = 1 },
              new Tableau { Nom = "Accepté", Position = 2 },
              new Tableau { Nom = "Developpement", Position = 3 },
              new Tableau { Nom = "A Tester", Position = 4 },
              new Tableau { Nom = "Terminé et Validé", Position = 5 }
            );

            //var db = new OllertDbContext();
            var david = new OllertUser()
            {
                UserName = "David",
                Avatar = System.IO.File.ReadAllBytes(this.MapPath("~/Content/images/avatar/david.png"))
            };
            var yannick = new OllertUser()
            {
                UserName = "Yannick",
                Avatar = System.IO.File.ReadAllBytes(this.MapPath("~/Content/images/avatar/yannick.png"))
            };

            var r1 = userManager.Create(david, "123456");
            var r2 = userManager.Create(yannick, "123456");

        }

        private string MapPath(string seedFile)
        {
            if (System.Web.HttpContext.Current != null)
                return System.Web.Hosting.HostingEnvironment.MapPath(seedFile);

            var absolutePath = new Uri(System.Reflection.Assembly.GetExecutingAssembly().CodeBase).AbsolutePath;
            var directoryName = System.IO.Path.GetDirectoryName(absolutePath);
            var path = System.IO.Path.Combine(directoryName, ".." + seedFile.TrimStart('~').Replace('/', '\\'));

            return path;
        }
    }
}
