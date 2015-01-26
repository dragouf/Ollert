namespace Ollert.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CarteEtapes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Titre = c.String(),
                        Position = c.Int(nullable: false),
                        Estimation = c.Int(nullable: false),
                        Reel = c.Int(nullable: false),
                        Terminee = c.Boolean(nullable: false),
                        Carte_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cartes", t => t.Carte_Id, cascadeDelete: true)
                .Index(t => t.Carte_Id);
            
            CreateTable(
                "dbo.Cartes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        NumeroDemande = c.Int(nullable: false),
                        Titre = c.String(),
                        Description = c.String(),
                        DateCreation = c.DateTime(nullable: false),
                        Position = c.Int(nullable: false),
                        Archive = c.Boolean(nullable: false),
                        Tableau_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Tableaux", t => t.Tableau_Id, cascadeDelete: true)
                .Index(t => t.Tableau_Id);
            
            CreateTable(
                "dbo.CarteVues",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DerniereConsultation = c.DateTime(nullable: false),
                        Carte_Id = c.Int(nullable: false),
                        Utilisateur_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cartes", t => t.Carte_Id, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.Utilisateur_Id)
                .Index(t => t.Carte_Id)
                .Index(t => t.Utilisateur_Id);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UserName = c.String(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        Avatar = c.Binary(),
                        LastViewed = c.DateTime(),
                        Email = c.String(),
                        UseGravatar = c.Boolean(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        User_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.LoginProvider, t.ProviderKey })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Messages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Texte = c.String(),
                        CreateOn = c.DateTime(nullable: false),
                        Carte_Id = c.Int(nullable: false),
                        Utilisateur_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cartes", t => t.Carte_Id, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.Utilisateur_Id)
                .Index(t => t.Carte_Id)
                .Index(t => t.Utilisateur_Id);
            
            CreateTable(
                "dbo.ParticipantSalles",
                c => new
                    {
                        UserId = c.String(maxLength: 128),
                        SalleId = c.Int(nullable: false),
                        Id = c.Int(nullable: false, identity: true),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .ForeignKey("dbo.Salles", t => t.SalleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.SalleId);
            
            CreateTable(
                "dbo.Salles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Nom = c.String(),
                        Proprietaire_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.Proprietaire_Id, cascadeDelete: true)
                .Index(t => t.Proprietaire_Id);
            
            CreateTable(
                "dbo.Tableaux",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Nom = c.String(),
                        Position = c.Int(nullable: false),
                        Salle_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Salles", t => t.Salle_Id, cascadeDelete: true)
                .Index(t => t.Salle_Id);
            
            CreateTable(
                "dbo.Fichiers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Nom = c.String(),
                        DateEnvoi = c.DateTime(nullable: false),
                        ContentType = c.String(),
                        Data = c.Binary(),
                        Carte_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cartes", t => t.Carte_Id, cascadeDelete: true)
                .Index(t => t.Carte_Id);
            
            CreateTable(
                "dbo.Notifications",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Type = c.Int(nullable: false),
                        Titre = c.String(),
                        Texte = c.String(),
                        Date = c.DateTime(nullable: false),
                        Createur_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.Createur_Id)
                .Index(t => t.Createur_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Notifications", "Createur_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.CarteEtapes", "Carte_Id", "dbo.Cartes");
            DropForeignKey("dbo.Cartes", "Tableau_Id", "dbo.Tableaux");
            DropForeignKey("dbo.Fichiers", "Carte_Id", "dbo.Cartes");
            DropForeignKey("dbo.CarteVues", "Utilisateur_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ParticipantSalles", "SalleId", "dbo.Salles");
            DropForeignKey("dbo.Tableaux", "Salle_Id", "dbo.Salles");
            DropForeignKey("dbo.Salles", "Proprietaire_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ParticipantSalles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Messages", "Utilisateur_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Messages", "Carte_Id", "dbo.Cartes");
            DropForeignKey("dbo.AspNetUserClaims", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.CarteVues", "Carte_Id", "dbo.Cartes");
            DropIndex("dbo.Notifications", new[] { "Createur_Id" });
            DropIndex("dbo.CarteEtapes", new[] { "Carte_Id" });
            DropIndex("dbo.Cartes", new[] { "Tableau_Id" });
            DropIndex("dbo.Fichiers", new[] { "Carte_Id" });
            DropIndex("dbo.CarteVues", new[] { "Utilisateur_Id" });
            DropIndex("dbo.ParticipantSalles", new[] { "SalleId" });
            DropIndex("dbo.Tableaux", new[] { "Salle_Id" });
            DropIndex("dbo.Salles", new[] { "Proprietaire_Id" });
            DropIndex("dbo.ParticipantSalles", new[] { "UserId" });
            DropIndex("dbo.Messages", new[] { "Utilisateur_Id" });
            DropIndex("dbo.Messages", new[] { "Carte_Id" });
            DropIndex("dbo.AspNetUserClaims", new[] { "User_Id" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.CarteVues", new[] { "Carte_Id" });
            DropTable("dbo.Notifications");
            DropTable("dbo.Fichiers");
            DropTable("dbo.Tableaux");
            DropTable("dbo.Salles");
            DropTable("dbo.ParticipantSalles");
            DropTable("dbo.Messages");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.CarteVues");
            DropTable("dbo.Cartes");
            DropTable("dbo.CarteEtapes");
        }
    }
}
