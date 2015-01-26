using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ollert.Models
{
    public class DeplacementModelView
    {
        public int CarteId { get; set; }
        public int AncienTableauId { get; set; }
        public int NouveauTableauId { get; set; }
    }
}