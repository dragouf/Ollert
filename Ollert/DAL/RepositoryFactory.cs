using System;
using System.Threading.Tasks;

namespace Ollert.DAL
{
    public class RepositoryFactory : IDisposable
    {
        private OllertDbContext _context;
        public OllertDbContext Context 
        {
            get 
            {
                if (_context == null)
                    _context = new OllertDbContext();

                return _context;
            }
        }

        //private AccountRepository _AccountRepository;
        //public AccountRepository AccountRepository
        //{
        //    get
        //    {
        //        if (_AccountRepository == null)
        //            _AccountRepository = new AccountRepository(this.Context);
        //        return _AccountRepository;
        //    }
        //}
        

        public async Task SaveAsync()
        {
            await Context.SaveChangesAsync();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    Context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
