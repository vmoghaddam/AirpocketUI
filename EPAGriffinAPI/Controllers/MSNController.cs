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
using System.Text;
using System.Configuration;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MSNController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/msn/customer/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewMSN> GetMSNsByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.MSNRepository.GetViewMSNs().Where(q => q.CustomerId == cid);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/msn/{id}")]
        public async Task<IHttpActionResult> GetMSN(int id)
        {
            var course = await unitOfWork.MSNRepository.GetDto(id);
            return Ok(course);
        }
        

        [Route("odata/msn/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostMSN(ViewModels.Ac_MSNDto dto)
        {
             
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.MSNRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Ac_MSN entity = null;

            if (dto.ID == -1)
            {
                entity = new Ac_MSN();
                unitOfWork.MSNRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.MSNRepository.GetByID(dto.ID);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.Ac_MSNDto.Fill(entity, dto);


          

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

 
            return Ok(dto);
        }

        [Route("odata/msn/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteMSN(ViewModels.Ac_MSNDto dto)
        {
            var entity = await unitOfWork.MSNRepository.GetByID(dto.ID);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.MSNRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.MSNRepository.Delete(entity);

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
