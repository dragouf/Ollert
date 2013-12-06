using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Ollert.DAL;
using System.Web;

namespace Ollert.Models
{
    [DataContract]
    public class Carte : Ollert.Models.IEntity
    {
        public Carte()
        {
            this.Messages = new List<Message>();
            this.Fichiers = new List<Fichier>();            
            this.CartesVues = new List<CarteVue>();
        }

        [Key]
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public int NumeroDemande { get; set; }
        [DataMember]
        public string Titre { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public Nullable<int> Estimation { get; set; }
        [DataMember]
        public DateTime DateCreation { get; set; }
        [DataMember]
        public int Position { get; set; }
        [DataMember]
        public virtual ICollection<Message> Messages { get; set; }
        [DataMember]
        public virtual ICollection<Fichier> Fichiers { get; set; }
        public virtual Tableau Tableau { get; set; }
        public virtual ICollection<CarteVue> CartesVues { get; set; }


        [NotMapped]
        [DataMember]
        public DateTime LastTimeViewed
        {
            get
            {
                var carteVue = CartesVues.FirstOrDefault(c => c.Utilisateur.Id == System.Web.HttpContext.Current.User.Identity.GetUserId());
                if (carteVue != null)
                {
                    return carteVue.DerniereConsultation;
                }

                return DateTime.MinValue;
            }
            set
            {
                var carteVue = CartesVues.FirstOrDefault(c => c.Utilisateur.Id == System.Web.HttpContext.Current.User.Identity.GetUserId());
                if (carteVue != null)
                {
                    carteVue.DerniereConsultation = value;
                }
                else
                {
                    carteVue = new CarteVue
                    {
                        DerniereConsultation = value,
                        Utilisateur = new OllertUser { Id = System.Web.HttpContext.Current.User.Identity.GetUserId() }
                    };
                }

                this.CartesVues.Add(carteVue);
            }
        }
        [NotMapped]
        [DataMember]
        public int TableauId
        {
            get
            {
                if (Tableau != null)
                    return Tableau.Id;
                else
                    return -1;
            }
        }
    }
}
