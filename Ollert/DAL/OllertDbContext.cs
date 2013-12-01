using Microsoft.AspNet.Identity.EntityFramework;
using Ollert.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ollert.DAL
{
    public class OllertDbContext : IdentityDbContext<OllertUser>
    {
        public DbSet<Carte> Cartes { get; set; }
        public DbSet<Fichier> Fichiers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Tableau> Tableaux { get; set; }
        public DbSet<CarteVue> CartesVues { get; set; }

        public OllertDbContext() : base("DefaultConnection")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            //modelBuilder.Entity<Course>()
            //    .HasMany(c => c.Instructors).WithMany(i => i.Courses)
            //    .Map(t => t.MapLeftKey("CourseID")
            //        .MapRightKey("InstructorID")
            //        .ToTable("CourseInstructor"));

            base.OnModelCreating(modelBuilder);
        }
    }
}
