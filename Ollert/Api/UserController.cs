using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Ollert.Models;
using Ollert.DAL;

namespace Ollert.Api
{
    [Authorize]
    public class UserController : ApiController
    {
        private OllertDbContext db = new OllertDbContext();

        // GET api/User
        public async Task<IEnumerable<OllertUser>> GetUsers()
        {
            return await db.Users.ToListAsync();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}