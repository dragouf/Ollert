using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Ollert.Models
{
    /// <summary>
    /// Cette table sert a determiner si des notifications doivent etre affichees
    /// </summary>
    public class CarteVue : Ollert.Models.IEntity
    {
        public CarteVue()
        {
            this.Carte = new Carte();
        }

        [Key]
        public int Id { get; set; }
        public virtual OllertUser Utilisateur { get; set; }
        [Required]
        public virtual Carte Carte { get; set; }
        public DateTime DerniereConsultation { get; set; }
    }
}
