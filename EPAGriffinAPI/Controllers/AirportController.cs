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
    public class AirportController : ODataController
    {
       // EPAGRIFFINEntities db = new EPAGRIFFINEntities();

        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/airports/all")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewAirport> GetAirports()
        {
            try
            {
                return unitOfWork.AirportRepository.GetViewAirports();
               // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }


          

        }


        [Route("odata/airport/iata/{iata}")]
        [EnableQuery]
        // [Authorize]
        public IHttpActionResult GetAirportByIATA(string iata)
        {
            try
            {
                var airport= unitOfWork.AirportRepository.GetViewAirports().FirstOrDefault(q=>q.IATA==iata);
                return Ok(airport);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                //throw new HttpResponseException(HttpStatusCode.Unauthorized);
                var msg = ex.Message;
                if (ex.InnerException != null)
                    msg += ex.InnerException.Message;
                return Ok(msg);
            }




        }

        [Route("odata/airports/save")]
        
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostAirport(ViewModels.Airport dto)
        {
            // return Ok(client);
            if (dto==null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.AirportRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Airport entity = null;
            if (dto.Id == -1)
            {
                entity = new Airport();
                unitOfWork.AirportRepository.Insert(entity);
            }

            else
                entity = await unitOfWork.AirportRepository.GetByID(dto.Id);

            if (entity == null)
                return Exceptions.getNotFoundException();

            ViewModels.Airport.Fill(entity, dto);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }


         

        [Route("odata/airports/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteAirport(ViewModels.Airport dto)
        {
            var entity = await unitOfWork.AirportRepository.GetByID(dto.Id);
             
            if (entity == null)
            {
                return NotFound();
            }



            var canDelete =unitOfWork.AirportRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.AirportRepository.Delete(entity);

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
