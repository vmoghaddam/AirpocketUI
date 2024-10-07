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
using EPAGriffinAPI.DAL;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class OptionsController : ODataController
    {
        EPAGRIFFINEntities db = new EPAGRIFFINEntities();
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/options/all/{creator}")]
        [EnableQuery]
       // [Authorize]
        public IQueryable<ViewOption> GetOptions(int creator)
        {
            try
            {
                //if (!User.Identity.IsAuthenticated)
                //    throw new HttpResponseException(HttpStatusCode.Unauthorized);
                //var x=User.IsInRole("user");
                //var x1 = User.IsInRole("user1");
                return db.ViewOptions.Where(q => q.IsSystem == true || q.CreatorId == creator);
            }
            catch(Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }
            
                
            //try
            //{
            //    db.Clients.Add(
            //    new Client
            //    {
            //        Id = "ngAuthApp",
            //        Secret = Helper.GetHash("abc@123"),
            //        Name = "AngularJS front-end Application",
            //        ApplicationType = (int)Models.ApplicationTypes.JavaScript,
            //        Active = true,
            //        RefreshTokenLifeTime = 7200,
            //        AllowedOrigin = "*"
            //    }
            //   );
            //    db.Clients.Add(
            //         new Client
            //         {
            //             Id = "consoleApp",
            //             Secret = Helper.GetHash("123@abc"),
            //             Name = "Console Application",
            //             ApplicationType = (int)Models.ApplicationTypes.NativeConfidential,
            //             Active = true,
            //             RefreshTokenLifeTime = 14400,
            //             AllowedOrigin = "*"
            //         }
            //        );
            //    db.SaveChanges();
            //}


            //catch (DbEntityValidationException e)
            //{
            //    foreach (var eve in e.EntityValidationErrors)
            //    {

            //        foreach (var ve in eve.ValidationErrors)
            //        {
            //            var xxx =
            //                 ve.PropertyName + " " + ve.ErrorMessage;
            //        }
            //    }
            //    return null;
            //}
          
        }
        [Route("odata/options/{parentId}")]
        [EnableQuery]
        public IQueryable<ViewOption> GetOptionsByParentId(int parentId)
        {
            
            return db.ViewOptions.Where(q => q.ParentId==parentId);
        }

        [Route("odata/options/personcoursestatus")]
        [EnableQuery]
        public IQueryable<ViewOption> GetPersonCourseStatuses()
        {

            return db.ViewOptions.Where(q => q.ParentId == 66 && q.Id!=71);
        }

        [Route("odata/option/{id}")]
        [ResponseType(typeof(Models.ViewOption))]
        public async Task<IHttpActionResult> GetOption(int  id)
        {
            var entity = await db.ViewOptions.FirstOrDefaultAsync(q => q.Id == id);
            if (entity == null)
                return NotFound();
            return Ok(entity);
        }
        [Route("odata/option/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostOption(ViewModels.Option dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.OptionRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Option entity = null;
           
            if (dto.Id == -1)
            {
                entity = new Option();
                unitOfWork.OptionRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.OptionRepository.GetByID(dto.Id);
                

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            entity.Title = dto.Title;
            entity.IsSystem =(bool) dto.IsSystem;
            entity.OrderIndex = (int)dto.OrderIndex;
            entity.ParentId = dto.ParentId;
            entity.CreatorId = dto.CreatorId;
            
            

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }


        [Route("odata/option/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteLocation(ViewModels.Option dto)
        {
            var entity = await unitOfWork.OptionRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.OptionRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.OptionRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }
        //// POST: odata/Options
        //public async Task<IHttpActionResult> Post(Option option)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Options.Add(option);
        //    await db.SaveChangesAsync();

        //    return Created(option);
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
