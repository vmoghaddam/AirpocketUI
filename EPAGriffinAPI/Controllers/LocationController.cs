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
    public class LocationController : ODataController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/locations/all")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewLocation> GetLocations()
        {
            try
            {
                return unitOfWork.LocationRepository.GetViewLocations().Where(q => !q.IsDeleted);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/locations/customer/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewLocation> GetLocationsByCustomer(int cid, string parentIds)
        {
            try
            {
                var query = unitOfWork.LocationRepository.GetViewLocations().Where(q => q.CustomerId == cid && !q.IsDeleted);
                if (string.IsNullOrEmpty(parentIds))
                    query = query.Where(q => q.ParentId == null);
                else
                {
                    if (parentIds != "-1")
                    {
                        var pids = parentIds.Split(',').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                        query = query.Where(q => pids.Contains(q.ParentId));
                    }


                }
                return query;
                //return unitOfWork.LocationRepository.GetViewLocations().Where(q=>q.CustomerId==cid && !q.IsDeleted);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/locations/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewLocation> GetLocationsByCustomer(int cid)
        {
            try
            {
                var query = unitOfWork.LocationRepository.GetViewLocations().Where(q => q.CustomerId == cid && !q.IsDeleted);
                 
                return query;
                //return unitOfWork.LocationRepository.GetViewLocations().Where(q=>q.CustomerId==cid && !q.IsDeleted);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/locations/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostLocation(ViewModels.Location dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.LocationRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Location entity = null;
            var oldFullCode = string.Empty;
            if (dto.Id == -1)
            {
                entity = new Location();
                unitOfWork.LocationRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.LocationRepository.GetByID(dto.Id);
                oldFullCode = entity.FullCode;
            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            ViewModels.Location.Fill(entity, dto);


            if (dto.Id != -1 && entity.FullCode != oldFullCode)
                unitOfWork.LocationRepository.UpdateChildren(entity, entity.FullCode);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }



        [Route("odata/locations/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteLocation(ViewModels.Location dto)
        {
            var entity = await unitOfWork.LocationRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.LocationRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.LocationRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
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
