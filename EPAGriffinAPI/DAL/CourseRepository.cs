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
    public class CourseRepository : GenericRepository<Course>
    {
        public CourseRepository(EPAGRIFFINEntities context)
        : base(context)
        {
        }

        public IQueryable<ViewCourse> GetViewCourses()
        {
            return this.GetQuery<ViewCourse>();
        }
        public IQueryable<ViewPersonActiveCourse> GetViewPersonActiveCourse()
        {
            return this.GetQuery<ViewPersonActiveCourse>();
        }
        public IQueryable<ViewCourseNotificationEnabled> GetViewActiveCourses()
        {
            return this.GetQuery<ViewCourseNotificationEnabled>();
        }

        public IQueryable<ViewCertificate> GetViewCertificates()
        {
            return this.GetQuery<ViewCertificate>();
        }

        public IQueryable<ViewCourseType> GetViewCourseTypes()
        {
            return this.GetQuery<ViewCourseType>();
        }
        public Course GetCourseById (int id)
        {
            var course = this.context.Courses.FirstOrDefault(q => q.Id == id);
            return course;
        }
        public async Task<ViewModels.Course> GetCourseDto(int id)
        {
            var course = new ViewModels.Course();
            var dbcourse = await context.Courses.FirstOrDefaultAsync(q => q.Id == id);
            ViewModels.Course.FillDto(dbcourse, course);
            course.CourseAircraftTypes = await context.CourseAircraftTypes.Where(q => q.CourseId == id).Select(q => q.AircraftTypeId).ToListAsync();
            course.CourseCatRates = await context.CourseCatRates.Where(q => q.CourseId == id).Select(q => q.CatRateId).ToListAsync();
            course.CourseRelatedAircraftTypes = (await (from x in context.CourseRelatedAircraftTypes
                                                        join y in context.ViewAircraftTypes on x.AircraftTypeId equals y.Id
                                                        where x.CourseId == id
                                                        select y).ToListAsync()).Select(q => new ViewModels.AircraftType()
                                                        {
                                                            Id = q.Id,
                                                            Manufacturer = q.Manufacturer,
                                                            ManufacturerId = q.ManufacturerId,
                                                            Remark = q.Remark,
                                                            Type = q.Type
                                                        }).ToList();
            course.CourseRelatedCourses = (await (from x in context.CourseRelatedCourses
                                                  join y in context.ViewCourses on x.RelatedCourseId equals y.Id
                                                  where x.CourseId == id
                                                  select y).ToListAsync()).Select(q => new ViewModels.CourseView()
                                                  {
                                                      Id = q.Id,
                                                      No = q.No,
                                                      Title = q.Title,
                                                      DateStart = q.DateStart,
                                                      DateEnd = q.DateEnd,
                                                      Organization = q.Organization,
                                                      Instructor = q.Instructor,

                                                  }).ToList();
            course.CourseRelatedCourseTypes = (await (from x in context.CourseRelatedCourseTypes
                                                      join y in context.ViewCourseTypes on x.CourseTypeId equals y.Id
                                                      where x.CourseId == id
                                                      select y).ToListAsync()).Select(q => new ViewModels.CourseType()
                                                      {
                                                          Title = q.Title,
                                                          Remark = q.Remark,
                                                          Id = q.Id,
                                                      }).ToList();
            course.CourseRelatedEmployees = (await (from x in context.CourseRelatedEmployees
                                                    join y in context.ViewEmployees on x.EmployeeId equals y.Id
                                                    where x.CourseId == id
                                                    select y).ToListAsync()).Select(q => new ViewModels.EmployeeView()
                                                    {
                                                        Name = q.Name,
                                                        NID = q.NID,
                                                        PID = q.PID,
                                                        Location = q.Location,
                                                        CaoCardNumber = q.CaoCardNumber,
                                                        NDTNumber = q.NDTNumber,
                                                        DateJoinCompany = q.DateJoinCompany,
                                                        Id = q.Id,
                                                        IDNo = q.IDNo,


                                                    }).ToList();
            course.CourseRelatedGroups = (await (from x in context.CourseRelatedGroups
                                                 join y in context.ViewJobGroups on x.GroupId equals y.Id
                                                 where x.CourseId == id
                                                 select y).ToListAsync()).Select(q => new ViewModels.JobGroup()
                                                 {
                                                     Title = q.Title,
                                                     FullCode = q.FullCode,
                                                     Remark = q.Remark,
                                                     Parent = q.Parent,
                                                     Id = q.Id,
                                                 }).ToList();
            course.CourseRelatedStudyFields = (await (from x in context.CourseRelatedStudyFields
                                                      join y in context.ViewOptions on x.StudyFieldId equals y.Id
                                                      where x.CourseId == id
                                                      select y).ToListAsync()).Select(q => new ViewModels.Option()
                                                      {
                                                          Title = q.Title,

                                                          Parent = q.Parent,
                                                          Id = q.Id,

                                                      }).ToList();


            return course;
        }
        public async Task<ViewModels.ActiveCourse> GetActiveCourseDto(int id)
        {
            var course = new ViewModels.ActiveCourse();
            var dbcourse = await context.ViewCourseNotificationEnableds.FirstOrDefaultAsync(q => q.Id == id);
            ViewModels.ActiveCourse.FillDto(dbcourse, course);
            course.ApplicablePeople = await context.ViewApplicableCoursePersons.Where(q => q.CourseId == course.Id).ToListAsync();

            return course;
        }
        public async Task<  ViewModels.ActiveCourseSummary>  GetActiveCourseSummary(int id)
        {
            var course = new ViewModels.ActiveCourse();
            var dbcourse =await  context.ViewCourseNotificationEnableds.Where(q => q.Id == id).Select(q => new
            {
                q.Total,
                q.Passed,
                q.Failed,
                q.Registered,
                q.Pending,
                q.Attended,
                q.Canceled
            }).FirstAsync();
            var dto = new ViewModels.ActiveCourseSummary()
            {
                Attended = dbcourse.Attended,
                Canceled = dbcourse.Canceled,
                Registered = dbcourse.Registered,
                Pending = dbcourse.Pending,
                Failed = dbcourse.Failed,
                Passed = dbcourse.Passed,
                Total = dbcourse.Total,

            };

            return dto;
        }

        public void FillCourseRelatedAircraftTypes(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseRelatedAircraftTypes.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseRelatedAircraftTypes.FirstOrDefault(q => q.Id == x.AircraftTypeId) == null
                           select x).ToList();
            var added = (from x in dto.CourseRelatedAircraftTypes
                         where existing.FirstOrDefault(q => q.AircraftTypeId == x.Id) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseRelatedAircraftTypes.Remove(x);
            foreach (var x in added)
                context.CourseRelatedAircraftTypes.Add(new CourseRelatedAircraftType()
                {
                    Course = course,
                    AircraftTypeId = x.Id,

                });
        }
        public void FillCourseRelatedCourseTypes(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseRelatedCourseTypes.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseRelatedCourseTypes.FirstOrDefault(q => q.Id == x.CourseTypeId) == null
                           select x).ToList();
            var added = (from x in dto.CourseRelatedCourseTypes
                         where existing.FirstOrDefault(q => q.CourseTypeId == x.Id) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseRelatedCourseTypes.Remove(x);
            foreach (var x in added)
                context.CourseRelatedCourseTypes.Add(new CourseRelatedCourseType()
                {
                    Course = course,
                    CourseTypeId = x.Id,

                });
        }
        public void FillCourseRelatedCourses(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseRelatedCourses.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseRelatedCourses.FirstOrDefault(q => q.Id == x.CourseId) == null
                           select x).ToList();
            var added = (from x in dto.CourseRelatedCourses
                         where existing.FirstOrDefault(q => q.CourseId == x.Id) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseRelatedCourses.Remove(x);
            foreach (var x in added)
                context.CourseRelatedCourses.Add(new CourseRelatedCourse()
                {
                    Course = course,
                    RelatedCourseId = x.Id,

                });
        }

        public void FillCourseRelatedJobGroups(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseRelatedGroups.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseRelatedGroups.FirstOrDefault(q => q.Id == x.GroupId) == null
                           select x).ToList();
            var added = (from x in dto.CourseRelatedGroups
                         where existing.FirstOrDefault(q => q.GroupId == x.Id) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseRelatedGroups.Remove(x);
            foreach (var x in added)
                context.CourseRelatedGroups.Add(new CourseRelatedGroup()
                {
                    Course = course,
                    GroupId = x.Id,

                });
        }
        public void FillCourseRelatedEmployees(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseRelatedEmployees.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseRelatedEmployees.FirstOrDefault(q => q.Id == x.EmployeeId) == null
                           select x).ToList();
            var added = (from x in dto.CourseRelatedEmployees
                         where existing.FirstOrDefault(q => q.EmployeeId == x.Id) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseRelatedEmployees.Remove(x);
            foreach (var x in added)
                context.CourseRelatedEmployees.Add(new CourseRelatedEmployee()
                {
                    Course = course,
                    EmployeeId = x.Id,

                });
        }

        public void FillCourseRelatedStudyFields(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseRelatedStudyFields.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseRelatedStudyFields.FirstOrDefault(q => q.Id == x.StudyFieldId) == null
                           select x).ToList();
            var added = (from x in dto.CourseRelatedStudyFields
                         where existing.FirstOrDefault(q => q.StudyFieldId == x.Id) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseRelatedStudyFields.Remove(x);
            foreach (var x in added)
                context.CourseRelatedStudyFields.Add(new CourseRelatedStudyField()
                {
                    Course = course,
                    StudyFieldId = x.Id,

                });
        }


        public void FillAircraftTypes(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseAircraftTypes.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseAircraftTypes.IndexOf(x.CourseId) == -1
                           select x).ToList();
            var added = (from x in dto.CourseAircraftTypes
                         where existing.FirstOrDefault(q => q.CourseId == x) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseAircraftTypes.Remove(x);
            foreach (var x in added)
                context.CourseAircraftTypes.Add(new CourseAircraftType()
                {
                    Course = course,
                    AircraftTypeId = x,

                });
        }

        public void FillCourseCatRates(Course course, ViewModels.Course dto)
        {
            var existing = this.context.CourseCatRates.Where(q => q.CourseId == course.Id).ToList();
            var deleted = (from x in existing
                           where dto.CourseCatRates.IndexOf(x.CourseId) == -1
                           select x).ToList();
            var added = (from x in dto.CourseCatRates
                         where existing.FirstOrDefault(q => q.CourseId == x) == null
                         select x).ToList();
            foreach (var x in deleted)
                context.CourseCatRates.Remove(x);
            foreach (var x in added)
                context.CourseCatRates.Add(new CourseCatRate()
                {
                    Course = course,
                    CatRateId = x

                });
        }


        public async Task<bool> ChangeActiveCourseStatus(ViewModels.ActiveCourseStatus dto)
        {
            try
            {
                
                var query = await (from x in context.PersonCourses
                                   where x.CourseId==dto.CourseId && dto.People.Contains((int)x.PersonId )
                                   select x).ToListAsync();
                //pending
                if (dto.StatusId != 72)
                {
                    foreach (var x in dto.People)
                    {
                        var item = query.FirstOrDefault(q => q.PersonId == x);
                        if (item == null)
                        {
                            item = new PersonCourse()
                            {
                                PersonId = x,
                                CourseId = dto.CourseId,

                            };
                            context.PersonCourses.Add(item);
                        }
                        item.StatusId = dto.StatusId;
                        item.DateStatus = DateTime.Now;
                        item.StatusConfirmed = true;
                        item.Remark = dto.Remark;
                        item.CerNumber = null;
                        item.DateIssue = null;
                        if (dto.StatusId == 71)
                        {
                            item.CerNumber = dto.No;
                            item.DateIssue = dto.IssueDate;
                        }

                    }
                }
                else
                {
                    foreach (var x in query)
                        context.PersonCourses.Remove(x);
                }
                

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public virtual CustomActionResult Validate(ViewModels.Course dto)
        {
            var c = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.DateStart == dto.DateStart && q.CourseTypeId == dto.CourseTypeId && q.OrganizationId == dto.OrganizationId);
            if (c != null)
                return Exceptions.getDuplicateException("Course-01", "Type-Organization-DateStart");
            //var checkByTitle = GetByTitleInParent(dto.Id, dto.ParentId, dto.Title);
            //if (checkByTitle != null)
            //    return Exceptions.getDuplicateException("Location-01", "Title");
            //var checkByCode = GetByFullCode(dto.Id, dto.CustomerId, dto.FullCode);
            //if (checkByCode != null)
            //    return Exceptions.getDuplicateException("Location-02", "FullCode");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

         


    }
}