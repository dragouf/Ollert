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
    public class CarteEtape : Ollert.Models.IEntity
    {
        [Key]
        public int Id { get; set; }
        public string Titre { get; set; }
        public int Position { get; set; }
        public int Estimation { get; set; }
        public int Reel { get; set; }
        public bool Terminee { get; set; }
        [Required]
        [JsonIgnore]
        public virtual Carte Carte { get; set; }
        [NotMapped]
        public int CarteId
        {
            get
            {
                if (Carte != null)
                    return Carte.Id;
                else
                    return -1;
            }
        }        
    }
}
