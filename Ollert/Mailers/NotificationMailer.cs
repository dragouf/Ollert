using Mvc.Mailer;
using Ollert.Models;
using System.Web.Mvc;

namespace Ollert.Mailers
{ 
    public class NotificationMailer : MailerBase
	{
		public NotificationMailer()
		{
			MasterName="_Layout";
		}
		
		public virtual MvcMailMessage NewEvent(MailEventViewModel model, string userEmail)
		{
            ViewData = new ViewDataDictionary(model);

			return Populate(x =>
			{
				x.Subject = model.Titre;
				x.ViewName = "NewEvent";
                x.From = new System.Net.Mail.MailAddress(userEmail);
                x.To.Add(userEmail);
			});
		}
 	}
}