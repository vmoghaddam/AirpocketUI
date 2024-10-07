using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.OData;
using EPAGriffinAPI.Models;
using System.Web.Http.Description;
using System.Collections.Generic;
using System;
using System.Data.Entity.Validation;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using EPAGriffinAPI.DAL;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CourseController : ODataController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/courses/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCourse> GetCoursesByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewCourses().Where(q =>q.CustomerId==null || q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/courses/active/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCourseNotificationEnabled> GetActiveCoursesByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewActiveCourses().Where(q => q.CustomerId == null || q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/courses/archived/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCourse> GetArchievedCoursesByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewCourses().Where(q => (q.CustomerId == null || q.CustomerId == cid) && q.IsNotificationEnabled==false);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }


        [Route("odata/courses/types")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCourseType> GetCourseTypes()
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewCourseTypes();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/courses/types/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCourseType(ViewModels.CourseType dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.CourseTypeRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            CourseType entity = null;

            if (dto.Id == -1)
            {
                entity = new CourseType();
                unitOfWork.CourseTypeRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.CourseTypeRepository.GetByID(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.CourseType.Fill(entity, dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }

        [Route("odata/courses/types/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteCourseType(ViewModels.CourseType dto)
        {
            var entity = await unitOfWork.CourseTypeRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.CourseTypeRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.CourseTypeRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }


        [Route("odata/courses/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteCourse(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            var entity = unitOfWork.CourseRepository.GetCourseById(id);

            if (entity == null)
            {
                return NotFound();
            }



         //   var canDelete = unitOfWork.CourseTypeRepository.CanDelete(entity);
          //  if (canDelete.Code != HttpStatusCode.OK)
           //     return canDelete;

            unitOfWork.CourseRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }


        [Route("odata/courses/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCourse(ViewModels.Course dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.CourseRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Course entity = null;
             
            if (dto.Id == -1)
            {
                entity = new Course();
                unitOfWork.CourseRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.CourseRepository.GetByID(dto.Id);
               
            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.Course.Fill(entity, dto);
            unitOfWork.CourseRepository.FillCourseRelatedAircraftTypes(entity, dto);
            unitOfWork.CourseRepository.FillCourseRelatedCourses(entity, dto);
            unitOfWork.CourseRepository.FillCourseRelatedCourseTypes(entity, dto);
            unitOfWork.CourseRepository.FillCourseRelatedEmployees(entity, dto);
            unitOfWork.CourseRepository.FillCourseRelatedJobGroups(entity, dto);
            unitOfWork.CourseRepository.FillCourseRelatedStudyFields(entity, dto);
            unitOfWork.CourseRepository.FillAircraftTypes(entity, dto);
            unitOfWork.CourseRepository.FillCourseCatRates(entity, dto);

            //if (dto.Id != -1 && entity.FullCode != oldFullCode)
            //    unitOfWork.LocationRepository.UpdateChildren(entity, entity.FullCode);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }


        [Route("odata/certifications/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCertification(ViewModels.Certificate dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.PersonCourseRepository.ValidateCertificate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            PersonCourse entity = null;

            if (dto.Id == -1)
            {
                entity = new PersonCourse();
                unitOfWork.PersonCourseRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.PersonCourseRepository.GetByID(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.Certificate.Fill(entity, dto);
             

          
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }

        [Route("odata/certifications/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteCertificate(ViewModels.Certificate dto)
        {
            var entity = await unitOfWork.PersonCourseRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.PersonCourseRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.PersonCourseRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }

        [Route("odata/course/{id}")]
        public async Task<IHttpActionResult> GetCourse( int id)
        {
            var course = await unitOfWork.CourseRepository.GetCourseDto(id);
            return Ok(course);
        }
        [Route("odata/course/active/{id}")]
        public async Task<IHttpActionResult> GetActiveCourse(int id)
        {
            var course = await unitOfWork.CourseRepository.GetActiveCourseDto(id);
            return Ok(course);
        }

        [Route("odata/course/active/changeStatus")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostChangeStatus(ViewModels.ActiveCourseStatus dto)
        {
            var result = await unitOfWork.CourseRepository.ChangeActiveCourseStatus(dto);
            if (result)
            {
                var saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;
                var summary =await unitOfWork.CourseRepository.GetActiveCourseSummary(dto.CourseId);

                return Ok(summary);
            }
               
            else
                return InternalServerError();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                //db.Dispose();
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
