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
            AutomaticMigrationsEnabled = false;
            //AutomaticMigrationDataLossAllowed = true;
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

            var admin = context.Users.First(u => u.UserName == "Admin");

            var salle = new Salle {
                Nom = "Development",
                Proprietaire = admin
            };

            context.Salles.AddOrUpdate(T => T.Nom, salle);

            var carte = new Carte
            {
                Titre = "Card example 1",
                Description = @"Do it really!",
                NumeroDemande = 40,
                DateCreation = DateTime.Now,
                Etapes = new List<CarteEtape> { new CarteEtape { Estimation = 1200, Position = 0, Terminee = false, Titre = "Total" } }
            };

            var tableau1 = new Tableau { Nom = "Waiting", Position = 0, Salle = salle };
            tableau1.Cartes.Add(carte);

            var message = new Message
            {
                Texte = "Hi, do it quickly!",
                CreateOn = DateTime.Now,
                Utilisateur = context.Users.First()
            };

            carte.Messages = new List<Message> {message};

            context.Tableaux.AddOrUpdate(
              T => T.Nom,
              tableau1,
              new Tableau { Nom = "Pending", Position = 1, Salle = salle },
              new Tableau { Nom = "Accepted", Position = 2, Salle = salle },
              new Tableau { Nom = "Development", Position = 3, Salle = salle },
              new Tableau { Nom = "Tests", Position = 4, Salle = salle },
              new Tableau { Nom = "Done", Position = 5, Salle = salle }
            );

            //var db = new OllertDbContext();
            var david = new OllertUser()
            {
                UserName = "David",
                Email = "david-laurent@yopmail.com",
                Avatar = System.IO.File.ReadAllBytes(this.MapPath("~/Content/images/avatar/david.png"))
            };
            var yannick = new OllertUser()
            {
                UserName = "Yannick",
                Email = "david-laurent@yopmail.com",
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
            var path = System.IO.Path.Combine(directoryName ?? string.Empty, ".." + seedFile.TrimStart('~').Replace('/', '\\'));

            return path;
        }
    }
}
