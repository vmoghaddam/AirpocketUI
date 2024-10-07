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
    public class OrganizationRepository : GenericRepository<Organization>
    {
        public OrganizationRepository(EPAGRIFFINEntities context)
          : base(context)
        {
        }

        public IQueryable<ViewOrganization> GetViewOrganization()
        {
            return this.GetQuery<ViewOrganization>();
        }
        public virtual CustomActionResult Validate(ViewModels.Organization dto)
        {
            var exist = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.Title.ToLower().Trim() == dto.Title.ToLower().Trim() );
            if (exist != null)
                return Exceptions.getDuplicateException("Organization-01", "Title");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.Organization entity)
        {
            if (entity.TypeId == 77)
            {
                var books = this.context.Books.Count(q => q.PublisherId == entity.Id);
                if (books>0)
                    return Exceptions.getCanNotDeleteException("Organization-03");
            }
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

    }
}