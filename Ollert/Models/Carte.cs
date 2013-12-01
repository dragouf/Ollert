using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Ollert.Models
{
    [DataContract]
    public class Carte : Ollert.Models.IEntity
    {
        public Carte()
        {
            this.Messages = new List<Message>();
            this.Fichiers = new List<Fichier>();
            this.Notifications = new List<Notification>();
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
        public virtual ICollection<Message> Messages { get; set; }
        [DataMember]
        public virtual ICollection<Fichier> Fichiers { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual Tableau Tableau { get; set; }
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
