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
    public class PersonMiscRepository : GenericRepository<PersonMisc>
    {
        public PersonMiscRepository(EPAGRIFFINEntities context)
           : base(context)
        {
        }
        public IQueryable<ViewPersonMisc> GetViewPersonMisc()
        {
            return this.GetQuery<ViewPersonMisc>();
        }
       
        public virtual CustomActionResult Validate(ViewModels.PersonMiscellaneous dto)
        {
            var exist = dbSet.FirstOrDefault(q=>q.Id!=dto.Id && q.FirstName.ToLower().Trim()== dto.FirstName.ToLower().Trim() && q.LastName.ToLower().Trim() == dto.LastName.ToLower().Trim() && q.TypeId==dto.TypeId);
            if (exist != null)
                return Exceptions.getDuplicateException("PersonMisc-01", "Name-Type");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.PersonMisc entity)
        {
            if (entity.TypeId == 75)
            {
                var books = this.context.BookAutors.Count(q => q.PersonMiscId == entity.Id);
                if (books > 0)
                    return Exceptions.getCanNotDeleteException("PersonMisc-03");
            }
            return new CustomActionResult(HttpStatusCode.OK, "");
        }



    }
}