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
                        UserName = c.String(nullable: false, maxLength: 256),
                        Avatar = c.Binary(),
                        LastViewed = c.DateTime(),
                        Email = c.String(maxLength: 256),
                        UseGravatar = c.Boolean(nullable: false),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
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
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
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
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.Notifications", "Createur_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.CarteEtapes", "Carte_Id", "dbo.Cartes");
            DropForeignKey("dbo.Cartes", "Tableau_Id", "dbo.Tableaux");
            DropForeignKey("dbo.Fichiers", "Carte_Id", "dbo.Cartes");
            DropForeignKey("dbo.CarteVues", "Utilisateur_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.ParticipantSalles", "SalleId", "dbo.Salles");
            DropForeignKey("dbo.Tableaux", "Salle_Id", "dbo.Salles");
            DropForeignKey("dbo.Salles", "Proprietaire_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ParticipantSalles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Messages", "Utilisateur_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Messages", "Carte_Id", "dbo.Cartes");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.CarteVues", "Carte_Id", "dbo.Cartes");
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.Notifications", new[] { "Createur_Id" });
            DropIndex("dbo.Fichiers", new[] { "Carte_Id" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.Tableaux", new[] { "Salle_Id" });
            DropIndex("dbo.Salles", new[] { "Proprietaire_Id" });
            DropIndex("dbo.ParticipantSalles", new[] { "SalleId" });
            DropIndex("dbo.ParticipantSalles", new[] { "UserId" });
            DropIndex("dbo.Messages", new[] { "Utilisateur_Id" });
            DropIndex("dbo.Messages", new[] { "Carte_Id" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.CarteVues", new[] { "Utilisateur_Id" });
            DropIndex("dbo.CarteVues", new[] { "Carte_Id" });
            DropIndex("dbo.Cartes", new[] { "Tableau_Id" });
            DropIndex("dbo.CarteEtapes", new[] { "Carte_Id" });
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.Notifications");
            DropTable("dbo.Fichiers");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.Tableaux");
            DropTable("dbo.Salles");
            DropTable("dbo.ParticipantSalles");
            DropTable("dbo.Messages");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.CarteVues");
            DropTable("dbo.Cartes");
            DropTable("dbo.CarteEtapes");
        }
    }
}
