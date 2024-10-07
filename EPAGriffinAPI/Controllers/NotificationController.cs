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
    public class NotificationController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/sms")]
        [AcceptVerbs("GET")]
        // [Authorize]
        public IHttpActionResult SMS()
        {
            Magfa m = new Magfa();
            var result9 = m.enqueue(1, "09124449584", "Hi Vahid")[0];
            var result = 1;
            var p = new EPAGriffinAPI.Payamak();
            p.send("09124449584", "Hi Vahid");

            return Ok(result9);

        }

        [Route("odata/sms/status/{str}")]
        [AcceptVerbs("GET")]
        // [Authorize]
        public IHttpActionResult SMS(string str)
        {
            var ids = str.Split('_').Select(q => Convert.ToInt64(q)).ToList();
            Magfa m = new Magfa();
            var result9 = m.getStatus(ids);
           // var result = 1;
            //var p = new EPAGriffinAPI.Payamak();
           // p.send("09124449584", "Hi Vahid");

            return Ok(result9);

        }

        public class SM
        {
            public string mobile { get; set; }
            public string text { get; set; }
        }
        [Route("odata/sms/free")]
        [AcceptVerbs("POST")]
        // [Authorize]
        public IHttpActionResult SMSFree(SM dto)
        {
           // string mobile = Convert.ToString(dto.mobile);
            var mobiles = dto.mobile.Split('_').ToList();
            //var text = Convert.ToString(dto.text);
            Magfa m = new Magfa();
            var result = new List<string>();
            foreach (var no in mobiles)
            {
                long result9 = m.enqueue(1, no, dto.text)[0];
                result.Add(result9.ToString());
            }
            
             
             

            return Ok(result);

        }


        [Route("odata/notifications/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewNotification> GetNotificationsByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.NotificationRepository.GetViewViewNotification().Where(q => q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/notifications/employee/{eid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewNotification> GetNotificationsByEmployeeId(int eid)
        {
            try
            {
                return unitOfWork.NotificationRepository.GetViewViewNotification().Where(q => q.UserId == eid).OrderByDescending(q => q.DateSent);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/notifications/module/{cid}/{mid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewNotification> GetModuleNotificationsByCustomerId(int cid, int mid)
        {
            try
            {
                return unitOfWork.NotificationRepository.GetViewViewNotification().Where(q => q.CustomerId == cid && q.ModuleId == mid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/notification/{id}")]

        // [Authorize]
        public async Task<Models.ViewNotification> GetNotification(int id)
        {
            try
            {
                return await unitOfWork.NotificationRepository.GetNotification(id);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/notifications/pickup/{fid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewPickupSM> GetViewCrewPickupSMS(int fid)
        {
            try
            {
                var types = new List<int?>() {10010,10011,10012,10013 };
                return unitOfWork.NotificationRepository.GetViewCrewPickupSMS().Where(q => q.FlightId == fid && types.Contains(q.Type));
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/notifications/sms/{fid}/{un}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewPickupSM> GetViewCrewSMS(int fid,string un)
        {
            try
            {
                un = un.Replace(".","").ToLower();
                var types = new List<int?>() { 10010, 10011, 10012, 10013 };
                return unitOfWork.NotificationRepository.GetViewCrewPickupSMS().Where(q => q.FlightId == fid && !types.Contains(q.Type) && q.Sender.ToLower()==un);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/notifications/sms/all/{un}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewPickupSM> GetViewCrewSMS2(string un)
        {
            try
            {
                un = un.Replace(".","").ToLower();
                var types = new List<int?>() { 10010, 10011, 10012, 10013 };
                return unitOfWork.NotificationRepository.GetViewCrewPickupSMS().Where(q =>!types.Contains(q.Type) && q.Sender.ToLower()==un);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        //chook
        [Route("odata/notifications/crew/sms/new/{personid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewPickupSM> GetNewViewCrewSMSCrew(int personid)
        {
            try
            {
                 
                var result= unitOfWork.NotificationRepository.GetViewCrewPickupSMS().Where(q => q.PersonId== personid && q.IsVisited==0).OrderByDescending(q=>q.DateSent).ToList();
                return result.AsQueryable();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/notifications/crew/sms/{personid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewPickupSM> GetAllViewCrewSMSCrew(int personid)
        {
            try
            {

                var result = unitOfWork.NotificationRepository.GetViewCrewPickupSMS().Where(q => q.PersonId == personid ).OrderByDescending(q => q.DateSent).ToList();
                return result.AsQueryable();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        //08-30
        [Route("odata/notifications/save")]
        //2024-02-03

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostNotification(ViewModels.NotificationX dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.NotificationRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;
            int c = 0;
            var msg = "";

            var emps = unitOfWork.PersonRepository.GetViewEmployeesLight().Where(q => dto.Employees.Contains(q.Id)).ToList();
            Magfa mgf = new Magfa();

            foreach (var x in dto.Employees)
            {
                var entity = new Notification();
                unitOfWork.NotificationRepository.Insert(entity);
                ViewModels.NotificationX.Fill(entity, dto, x);
                if (dto.Names != null && dto.Names.Count > 0)
                {
                    var name = dto.Names[c];
                    entity.Message = entity.Message.Replace("[#Name]", name);
                    msg = entity.Message;
                    msg = msg.Replace("<strong>", "").Replace("</strong>", "").Replace("<b>", "").Replace("</b>", "");
                    var _emp = emps.FirstOrDefault(q => q.Id == x);
                    if (_emp != null && !string.IsNullOrEmpty(_emp.Mobile))
                    {
                        var res = mgf.enqueue(1, _emp.Mobile, msg.Replace("<br />", "\n"));
                        entity.SMSIssue = res[0].ToString();
                        dto.SMSIssue = entity.SMSIssue;
                    }
                }
               
                c++;


            }





            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);
        }


        //chook
        [Route("odata/notifications/save2")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostNotification2(ViewModels.NotificationX dto)
        {
            
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
               
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.NotificationRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            //var newMessages = new List<string>();
            //int c = 0;
            //foreach (var x in dto.Employees)
            //{
            //    var entity = new Notification();
            //    unitOfWork.NotificationRepository.Insert(entity);
            //    ViewModels.NotificationX.Fill(entity, dto, x);
            //    if (dto.Names != null && dto.Names.Count > 0)
            //    {
            //        var name = dto.Names[c];

            //        newMessages.Add(entity.Message);

            //    }

            //    c++;


            //}








            var result = await unitOfWork.FlightRepository.SendPickup(dto);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            return Ok(result);
        }


        [Route("odata/notifications/sms/visit")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostNotificationSMSVisit(dynamic dto)
        {

            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var id = Convert.ToInt32(dto.Id);
             


            var result = await unitOfWork.FlightRepository.SMSVisit(id);

            
            return Ok(result);
        }


        [Route("odata/notifications/flight/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostNotificationFlight(ViewModels.NotificationX dto)
        {

            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.NotificationRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            


            var result = await unitOfWork.FlightRepository.SendFlightSMS(dto);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            return Ok(result);
        }


        [Route("odata/notifications/welcome")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> PostNotificationWelcome()
        {
            // return Ok(client);
            unitOfWork.FlightRepository.sendWelcome();
            return Ok(true);
        }

        [Route("odata/notify/nira/{id}")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetNotifyNira(int id)
        {
            // return Ok(client);
            var result=await unitOfWork.FlightRepository.NotifyNira(id,"");
            return Ok(true);
        }

        ///////////////////////////////////////////

    }
}
