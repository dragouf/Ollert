using System.ComponentModel.DataAnnotations;

namespace Ollert.Models
{
    public class MailEventViewModel
    {
        public string Titre { get; set; }
        public string Message { get; set; }
        public int SalleId { get; set; }
        //public object NotifObject { get; set; }
    }
}
