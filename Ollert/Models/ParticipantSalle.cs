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
    public class ParticipantSalle : Ollert.Models.IEntity
    {
        [Key]
        public int Id { get; set; }
        
        [Column(Order = 1)]
        [ForeignKey("Participant")]
        public string UserId { get; set; }
                
        [Column(Order = 2)]
        [ForeignKey("Salle")]
        public int SalleId { get; set; }

        public virtual OllertUser Participant { get; set; }
        [Required]
        public virtual Salle Salle { get; set; }
    }
}
