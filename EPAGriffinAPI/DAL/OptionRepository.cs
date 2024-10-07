using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;
using EPAGriffinAPI.ViewModels;

namespace EPAGriffinAPI.DAL
{
    public class OptionRepository : GenericRepository<Models.Option>
    {
        public OptionRepository(EPAGRIFFINEntities context)
     : base(context)
        {
        }
        public virtual CustomActionResult Validate(ViewModels.Option dto)
        {
            var exist = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.CreatorId == dto.CreatorId && q.Title.ToLower().Trim() == dto.Title.ToLower().Trim() && q.ParentId==dto.ParentId);
            if (exist != null)
                return Exceptions.getDuplicateException("Option-01", "Title");
             

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.Option entity)
        {
            if (entity.IsSystem)
                return Exceptions.getCanNotDeleteException("Option-06");
            var employees = this.context.PersonEducations.Count(q => q.StudyFieldId == entity.Id );
            if (employees > 0)
                return Exceptions.getCanNotDeleteException("Option-03:Employees found");
            var employees2 = this.context.EmployeeLocations.Count(q => q.OrgRoleId == entity.Id);
            if (employees2 > 0)
                return Exceptions.getCanNotDeleteException("Option-03:Employees found");

            var books = this.context.BookRelatedStudyFields.Count(q => q.StudyFieldId == entity.Id);
            if (books > 0)
                return Exceptions.getCanNotDeleteException("Option-04:Library item found");
            var courses = this.context.CourseRelatedStudyFields.Count(q => q.StudyFieldId == entity.Id);
            if (courses > 0)
                return Exceptions.getCanNotDeleteException("Option-05:Course found");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }
    }
}