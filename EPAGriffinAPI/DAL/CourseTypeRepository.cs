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
    public class CourseTypeRepository : GenericRepository<CourseType>
    {
        public CourseTypeRepository(EPAGRIFFINEntities context)
       : base(context)
        {
        }

        public virtual CustomActionResult Validate(ViewModels.CourseType dto)
        {
            var c = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.Title.ToLower().Trim() == dto.Title.ToLower().Trim() );
            if (c != null)
                return Exceptions.getDuplicateException("CourseType-01", "Title");
            

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.CourseType entity)
        {
            //  if (HasChildren(entity.Id))
            //     return Exceptions.getCanNotDeleteException("Location-03");
            var course = this.context.ViewCourses.Where(q => q.CourseTypeId == entity.Id).Count();
            if (course>0)
                return Exceptions.getCanNotDeleteException("CourseType-02-Courses found");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }
    }
}