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
using System.Net.Http;

namespace EPAGriffinAPI.Controllers
{
    public class UserActivityController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/useractivities/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewUserActivity> GetUserActivitiesByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.UserActivityRepository.GetViewUserActivity().Where(q => q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/useractivities/top/{cid}/{top}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewUserActivity> GetTopUserActivitiesByCustomerId(int cid,int top)
        {
            try
            {
                return unitOfWork.UserActivityRepository.GetViewUserActivity().Where(q => q.CustomerId == cid).OrderByDescending(q=>q.Date).Take(top);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/useractivities/top/{cid}/{module}/{uid}/{top}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewUserActivity> GetTopUserActivities (int cid, int top,int module,int uid)
        {
            try
            {
                return unitOfWork.UserActivityRepository.GetViewUserActivity().Where(q => q.CustomerId == cid && q.ModuleId==module && q.UserId!=uid).OrderByDescending(q => q.Date).Take(top);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }


        [Route("odata/menuhits/top/{cid}/{user}/{module}/{top}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<UserActivityMenuHit> GetTopUserMenuHits(int cid, int top,int user,int module)
        {
            try
            {
                return unitOfWork.UserActivityRepository.GetUserActivityMenuHit().Where(q => q.CustomerId == cid && q.ModuleId==module && q.UserId==user).OrderByDescending(q => q.DateLastHit).Take(top);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }



        [Route("odata/useractivities/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserActivity(ViewModels.UserActivityX dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.UserActivityRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;
            var entity = new UserActivity();
            unitOfWork.UserActivityRepository.Insert(entity);
            ViewModels.UserActivityX.Fill(entity, dto);

            if (dto.IsMain)
            {
                var entity2 = await unitOfWork.UserActivityRepository.GetMenuHitsByDto(dto);
                if (entity2 == null)
                {
                    entity2 = new UserActivityMenuHit();
                    unitOfWork.UserActivityRepository.Insert(entity2);
                    ViewModels.UserActivityMenuHitX.FillByUserActivityDto(entity2, dto);
                }
                else
                {
                    entity2.Hit++;
                    entity2.DateLastHit = DateTime.Now;
                }
              
                
            }
            




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);
        }



        [Route("odata/visitlibrary/{employeeId}/{itemId}")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostVisitLibraryItem(int employeeId,int itemId)
        {
            // return Ok(client);

            var status =await unitOfWork.UserActivityRepository.VisitLibraryItem(employeeId, itemId);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(true);
        }

        //[Route("odata/visitfile/{employeeId}/{fileId}")]
        //[AcceptVerbs("POST")]
        //public async Task<IHttpActionResult> PostVisitBookFile(int employeeId, int fileId)
        //{
        //    // return Ok(client);

        //    var status = await unitOfWork.UserActivityRepository.VisitBookFlie(employeeId, fileId);

        //    var saveResult = await unitOfWork.SaveAsync();
        //    if (saveResult.Code != HttpStatusCode.OK)
        //        return saveResult;



        //    return Ok(true);
        //}


        //fucking caspian
        [Route("odata/visitfile/{employeeId}/{fileId}")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostVisitBookFile(int employeeId, int fileId)
        {
            // return Ok(client);
            try
            {
                HttpClient client = new HttpClient();

                await client.PostAsync("https://fleet.caspianairlines.com/apinetplan/odata/visitfile/" + employeeId + "/" + fileId, null);
                return Ok(true);
            }
            catch(Exception ex)
            {
                return Ok(true);
            }
           

            //var status = await unitOfWork.UserActivityRepository.VisitBookFlie(employeeId, fileId);

            //var saveResult = await unitOfWork.SaveAsync();
            //if (saveResult.Code != HttpStatusCode.OK)
            //    return saveResult;



            //return Ok(true);
        }

        [Route("odata/sign/book/{employeeId}/{bookid}/{code}")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostsSignBook(int employeeId, int bookid,string code)
        {
            // return Ok(client);

            var status = await unitOfWork.UserActivityRepository.SignBook(employeeId, bookid,code);
            if (status == null)
                return Ok(false);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(status);
        }


        [Route("odata/visitmessage/{id}")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostVisitMessage(int id)
        {
            // return Ok(client);

            var status = await unitOfWork.NotificationRepository.VisitMessage(id);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(true);
        }

        [Route("odata/downloadlibrary/{employeeId}/{itemId}")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostDownloadLibraryItem(int employeeId, int itemId)
        {
            // return Ok(client);

            var status = await unitOfWork.UserActivityRepository.DownloadLibraryItem(employeeId, itemId);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(true);
        }





    }
}
