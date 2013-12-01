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
    public class Fichier : Ollert.Models.IEntity
    {
        [Key]
        [DataMember]
        public int Id { get; set; }      
        [DataMember]
        public string Nom { get; set; }
        [DataMember]
        public DateTime DateEnvoi { get; set; }
        [DataMember]
        public string ContentType { get; set; }
        [NotMapped]
        [DataMember]
        public int FileSize { get { return this.Data.Length; } }
        public byte[] Data { get; set; }
        public virtual Carte Carte { get; set; }
        [NotMapped]
        [DataMember]
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
