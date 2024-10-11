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
    public class PersonCourseRepository : GenericRepository<PersonCourse>
    {
        public PersonCourseRepository(EPAGRIFFINEntities context)
       : base(context)
        {
        }
        public virtual CustomActionResult CanDelete(Models.PersonCourse entity)
        {
            //  if (HasChildren(entity.Id))
            //     return Exceptions.getCanNotDeleteException("Location-03");
            var course = this.context.ViewCertificates.First(q => q.Id == entity.Id);
            if (course.IsNotificationEnabled==true)
                return Exceptions.getCanNotDeleteException("Certificate-03");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }
        public virtual CustomActionResult ValidateCertificate(ViewModels.Certificate dto)
        {
            var c = context.ViewCertificates.FirstOrDefault(q => q.Id != dto.Id && q.PersonId==dto.PersonId && DbFunctions.TruncateTime(q.DateIssue) == DbFunctions.TruncateTime(dto.DateIssue) && q.CourseTypeId == dto.CourseTypeId && q.CourseTitle.ToLower() == dto.CourseTitle.ToLower());
            if (c != null)
                return Exceptions.getDuplicateException("Certificate-01", "Certificate");
            

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

    }
}