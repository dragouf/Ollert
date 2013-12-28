using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Ollert.Models
{
    [DataContract]
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class OllertUser : IdentityUser
    {
        public OllertUser()
        {
            this.Messages = new List<Message>();
        }

        [DataMember]
        public override string Id { get; set; }
        [DataMember]
        public override string UserName { get; set; }
        public byte[] Avatar { get; set; }
        [DataMember]
        public Nullable<DateTime> LastViewed { get; set; }
        public string Email { get; set; }
        [DataContract]
        public string EmailMd5
        {
            get 
            {
                if(!string.IsNullOrWhiteSpace(this.Email))
                {
                    return this.Email.Trim().ToLower().Md5();
                }

                return string.Empty;
                    
            }
        }
        [DataMember]
        public bool UseGravatar { get; set; }


        public virtual ICollection<Message> Messages { get; set; }

        public ICollection<ParticipantSalle> Participants { get; set; }
    }
}