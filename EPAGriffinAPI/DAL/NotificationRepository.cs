using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;
using EPAGriffinAPI.ViewModels;
using static EPAGriffinAPI.DAL.FlightRepository;

namespace EPAGriffinAPI.DAL
{
    public class NotificationRepository : GenericRepository<Models.Notification>
    {
        public NotificationRepository(EPAGRIFFINEntities context)
      : base(context)
        {
        }

        public async Task<Notification> VisitMessage(int id)
        {
            var notification = await this.context.Notifications.FirstOrDefaultAsync(q => q.Id==id);
            if (notification != null)
                notification.DateAppVisited = DateTime.Now;
            return notification;
            // return await this.context.UserActivityMenuHits.FirstOrDefaultAsync(q => q.UserId == dto.UserId && q.CustomerId == dto.CustomerId && q.ModuleId == dto.ModuleId && q.Key == dto.Key);
        }
        public async Task<Models.ViewNotification> GetNotification(int id)
        {
            var view = await this.context.ViewNotifications.FirstOrDefaultAsync(q => q.Id == id);
            if (view != null)
            {
                var notification = await dbSet.Where(q=>q.Id==id).Select(q=>q.Message).FirstOrDefaultAsync();
                view.Abstract = notification;
            }
            return view;
        }

        public IQueryable<ViewNotification> GetViewViewNotification()
        {
            return this.GetQuery<ViewNotification>();
        }
        public IQueryable<ViewCrewPickupSM> GetViewCrewPickupSMS()
        {
            return this.GetQuery<ViewCrewPickupSM>();
        }

       
        internal string SendNotification(string mobile, string text, string name, int type)
        {
            //var refStr = mobile;
            //if (refStr[0] == '0')
            //    refStr = refStr.Substring(1);
            //if (refStr[0] == '9')
            //    refStr = refStr.Substring(1);
            //refStr += type.ToString();


            Magfa m = new Magfa();
            var result9 = m.enqueue(1, mobile, text)[0];
            this.context.SMSHistories.Add(new SMSHistory()
            {
                DateSent = DateTime.Now,
                RecMobile = mobile,
                RecName = name,
                Ref = result9.ToString(),
                Text = text,
                TypeId = type,
                
            });
            // this.context.SaveChanges();
            return result9.ToString();
        }
        public async Task<object> SendGroupNotificationRegisterTypeChange(List<TypeChangeDto> items)
        {
            var recs = await this.context.ViewNotificationGroups.Where(q => q.GroupTitle == "Register Change").ToListAsync();
            var query = (from x in items
                        group x by new { x.Date, x.OldType, x.NewType } into grp
                        select new
                        {
                            grp.Key.Date,
                            grp.Key.OldType,
                            grp.Key.NewType,
                            flights = grp.OrderBy(q => q.STDLocal).ToList(),
                        }).OrderBy(q=>q.Date).ThenBy(q=>q.OldType).ThenBy(q=>q.NewType).ToList();
            var strs = new List<string>();
            strs.Add("A/C TYPE CHANGED");
            foreach (var x in query)
            {
                strs.Add(x.Date);
                strs.Add(x.OldType + " => " + x.NewType);
                foreach(var f in x.flights)
                {
                    strs.Add("FLT "+f.FlightNumber + " " + f.Route + " " + ((DateTime)f.STDLocal).ToString("HH:mm"));
                }
            }
            strs.Add("Sent by AirPocket at" );
            strs.Add(DateTime.Now.ToLocalTime().ToString("yyyy/MM/dd HH:mm"));
            var text = String.Join("\n", strs);

            foreach (var p in recs)
            {
                if (!string.IsNullOrEmpty(p.PhoneNumber))
                    this.SendNotification(p.PhoneNumber, text, p.UserName, 26);
            }
            await this.context.SaveAsync();
            return true;
        }

        public virtual CustomActionResult Validate(ViewModels.NotificationX dto)
        {
            //var exist = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.Title.ToLower().Trim() == dto.Title.ToLower().Trim());
            //if (exist != null)
            //    return Exceptions.getDuplicateException("Organization-01", "Title");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }
    }
}