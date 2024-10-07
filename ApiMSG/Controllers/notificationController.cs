using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

using System.Data.Entity;
using System.Data.Entity.Infrastructure;


using System.Web.Http.Description;

using System.Data.Entity.Validation;

using System.Web.Http.ModelBinding;

using System.Text;
using System.Configuration;
using Newtonsoft.Json;
using System.Web.Http.Cors;
using System.IO;
using System.Xml;
using System.Web;
using System.Text.RegularExpressions;
using Formatting = Newtonsoft.Json.Formatting;
using System.Data;
using System.Data.Common;
using System.Dynamic;
using ApiMSG.Models;
using System.Net.Http.Headers;
using System.Drawing;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using System.Threading;

namespace ApiMSG.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class notificationController : ApiController
    {

        [Route("api/notifications/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostNotification(NotificationX dto)
        {
            // return Ok(client);
            var context = new ppa_vareshEntities();
            int c = 0;
            foreach (var x in dto.Employees)
            {
                var entity = new Notification();
                context.Notifications.Add(entity);
                NotificationX.Fill(entity, dto, x);
                if (dto.Names != null && dto.Names.Count > 0)
                {
                    var name = dto.Names[c];
                    entity.Message = entity.Message.Replace("[#Name]", name);
                }

                c++;


            }





            await context.SaveChangesAsync();



            return Ok(dto);
        }


        [Route("api/notifications/person/{personid}")]

        // [Authorize]
        public IHttpActionResult GetPersonNotifications(int personid)
        {
            try
            {


                //  var result = unitOfWork.NotificationRepository.GetViewCrewPickupSMS().Where(q => q.PersonId == personid).OrderByDescending(q => q.DateSent).ToList();
                //  return result.AsQueryable();
                var context = new ppa_vareshEntities();
                var pickups = context.ViewCrewPickupSMS.Where(q => q.PersonId == personid).Select(q => new NotificationResponse()
                {
                    DateSent = q.DateSent,
                    DateVisit = q.DateVisit,
                    DepartureLocal = q.DepartureLocal,
                    FlightNumber = q.FlightNumber,
                    FromAirportIATA = q.FromAirportIATA,
                    ToAirportIATA = q.ToAirportIATA,
                    IsVisited = q.IsVisited,
                    Message = q.Message,
                    Name = q.Name,
                    PersonId = q.PersonId,
                    PickupLocal = q.PickupLocal,
                    Type = q.Type,
                    TypeStr = q.TypeStr
                }).ToList();


                var nots = context.ViewNotifications.Where(q => q.PersonId == personid).Select(q => new NotificationResponse() { 
                 DateSent=q.DateSent,
                  DateVisit=q.DateAppVisited,
                     Message=q.Abstract,
                      Name=q.Name,
                       PersonId=q.PersonId,
                        Type=q.TypeId,
                         TypeStr=q.Type,
                          
                }).ToList();
                foreach (var x in nots)
                    x.IsVisited = x.DateVisit != null ? 1 : 0;

                var result = pickups.Concat(nots).OrderByDescending(q => q.DateSent).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }




    }

    public class NotificationResponse
    {
        public DateTime? DateSent { get; set; }
        public DateTime? DateVisit { get; set; }
        public int IsVisited { get; set; }
        public string TypeStr { get; set; }
        public int? Type { get; set; }
        public string Message { get; set; }
        public int? PersonId { get; set; }
        public string Name { get; set; }
        public string FlightNumber { get; set; }
        public string FromAirportIATA { get; set; }
        public string ToAirportIATA { get; set; }
        public DateTime? DepartureLocal { get; set; }
        public DateTime? PickupLocal { get; set; }
    }

    public class NotificationX
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? CustomerId { get; set; }
        public string Message { get; set; }
        public DateTime DateSent { get; set; }
        public int? SenderId { get; set; }
        public string SenderName { get; set; }
        public bool SMS { get; set; }
        public bool Email { get; set; }
        public bool App { get; set; }
        public DateTime? DateSMSSent { get; set; }
        public DateTime? DateEmailSent { get; set; }
        public DateTime? DateAppSent { get; set; }
        public string SMSIssue { get; set; }
        public string EmailIssue { get; set; }
        public string AppIssue { get; set; }
        public DateTime? DateAppVisited { get; set; }
        public int TypeId { get; set; }
        public string Subject { get; set; }
        public int? ModuleId { get; set; }
        public int? FlightId { get; set; }

        List<int> employees;
        public List<int> Employees
        {
            get
            {
                if (employees == null)
                    employees = new List<int>();
                return employees;
            }
            set
            {
                employees = value;
            }
        }

        List<int?> fdps;
        public List<int?> FDPs
        {
            get
            {
                if (fdps == null)
                    fdps = new List<int?>();
                return fdps;
            }
            set
            {
                fdps = value;
            }
        }


        List<string> names;
        public List<string> Names
        {
            get
            {
                if (names == null)
                    names = new List<string>();
                return names;
            }
            set
            {
                names = value;
            }
        }

        List<string> names2;
        public List<string> Names2
        {
            get
            {
                if (names2 == null)
                    names2 = new List<string>();
                return names2;
            }
            set
            {
                names2 = value;
            }
        }

        List<string> mobiles2;
        public List<string> Mobiles2
        {
            get
            {
                if (mobiles2 == null)
                    mobiles2 = new List<string>();
                return mobiles2;
            }
            set
            {
                mobiles2 = value;
            }
        }

        List<string> messages2;
        public List<string> Messages2
        {
            get
            {
                if (messages2 == null)
                    messages2 = new List<string>();
                return messages2;
            }
            set
            {
                messages2 = value;
            }
        }


        List<DateTime?> dates;
        public List<DateTime?> Dates
        {
            get
            {
                if (dates == null)
                    dates = new List<DateTime?>();
                return dates;
            }
            set
            {
                dates = value;
            }
        }
        public static void Fill(Models.Notification entity, NotificationX notification, int userid)
        {
            entity.Id = notification.Id;
            entity.UserId = userid;
            entity.CustomerId = notification.CustomerId;
            entity.Message = notification.Message;
            entity.DateSent = DateTime.Now;
            entity.SenderId = notification.SenderId;
            entity.SMS = notification.SMS;
            entity.Email = notification.Email;
            entity.App = notification.App;
            entity.DateSMSSent = null;
            entity.DateEmailSent = null;
            entity.DateAppSent = null;
            entity.SMSIssue = null;
            entity.EmailIssue = null;
            entity.AppIssue = null;
            entity.DateAppVisited = null;
            entity.TypeId = notification.TypeId;
            entity.Subject = notification.Subject;
            entity.ModuleId = notification.ModuleId;
        }
        public static void FillDto(Models.Notification entity, NotificationX notification)
        {
            notification.Id = entity.Id;
            notification.UserId = entity.UserId;
            notification.CustomerId = entity.CustomerId;
            notification.Message = entity.Message;
            notification.DateSent = DateTime.Now;
            notification.SenderId = entity.SenderId;
            notification.SMS = entity.SMS;
            notification.Email = entity.Email;
            notification.App = entity.App;
            notification.DateSMSSent = null;
            notification.DateEmailSent = null;
            notification.DateAppSent = null;
            notification.SMSIssue = null;
            notification.EmailIssue = null;
            notification.AppIssue = null;
            notification.DateAppVisited = null;
            notification.TypeId = entity.TypeId;
            notification.Subject = entity.Subject;
            notification.ModuleId = entity.ModuleId;
        }
    }
}
