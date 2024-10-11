using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;
namespace EPAGriffinAPI.DAL
{
    public class JournalRepository : GenericRepository<Journal>
    {
        public JournalRepository(EPAGRIFFINEntities context)
           : base(context)
        {
        }
        public IQueryable<ViewJournal> GetViewJournal()
        {
            return this.GetQuery<ViewJournal>();
        }
        public virtual CustomActionResult Validate(ViewModels.JournalX dto)
        {
            var exist = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.Title.ToLower().Trim() == dto.Title.ToLower().Trim() && q.TypeId == dto.TypeId);
            if (exist != null)
                return Exceptions.getDuplicateException("Journal-01", "Title-Type");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.Journal entity)
        {
            
                var books = this.context.Books.Count(q => q.JournalId == entity.Id);
                if (books > 0)
                    return Exceptions.getCanNotDeleteException("Journal-03");
            
            return new CustomActionResult(HttpStatusCode.OK, "");
        }



    }
}