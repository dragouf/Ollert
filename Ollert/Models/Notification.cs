using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace Ollert.Models
{
    [Flags]
    public enum TypeNotification
    {
        NouveauMessage = 1,
        SuppressionMessage = 2,

        MouvementCarte = 3,
        NouvelleCarte = 4,
        EditionCarte = 5,
        SuppressionCarte = 6,

        AjoutFichier = 7,
        SuppressionFichier = 8,

        AjoutEtape = 9,
        SuppressionEtape = 10,
        ModificationEtape = 11
        
    }
    public class Notification : Ollert.Models.IEntity
    {
        [Key]
        public int Id { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public TypeNotification Type { get; set; }
        public string Titre { get; set; }
        public string Texte { get; set; }
        public DateTime Date { get; set; }
        public virtual OllertUser Createur { get; set; }
    }
}
