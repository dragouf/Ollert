using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Ollert.Models
{
    [DataContract]
    public class Tableau : Ollert.Models.IEntity
    {
        public Tableau()
        {
            this.Cartes = new List<Carte>();
        }

        [Key]
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Nom { get; set; }
        [DataMember]
        public int Position { get; set; }
        [DataMember]
        public virtual ICollection<Carte> Cartes { get; set; }
        [Required]
        public virtual Salle Salle { get; set; }
    }
}