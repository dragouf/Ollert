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
using Newtonsoft.Json;

namespace Ollert.Models
{
    public class Salle : Ollert.Models.IEntity
    {
        public Salle()
        {
            this.Tableaux = new List<Tableau>();
            this.Participants = new List<OllertUser>();
        }

        [Key]
        public int Id { get; set; }
        public string Nom { get; set; }
        [JsonIgnore]
        public virtual ICollection<Tableau> Tableaux { get; set; }
        [Required]
        public virtual OllertUser Proprietaire { get; set; }
        public virtual ICollection<OllertUser> Participants { get; set; }
    }
}
