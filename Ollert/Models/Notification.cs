using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Ollert.Models
{
    [Flags]
    public enum TypeNotification
    {
        NouveauMessage = 1,
        Mouvement = 2,
        NouvelleCarte = 3,
        EditionCarte = 4,
        AjoutFichier = 5,
        SuppressionCarte = 6,
        SuppressionFichier = 7,
        SuppressionMessage = 8
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
    }
}
