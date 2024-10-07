using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
   public class RosterSMSDto
    {
        public List<int> Ids { get; set; }
        public DateTime Date { get; set; }
        public string UserName { get; set; }
    }
    public class RosterSMSStatusDto
    {
        public List<string> Ids { get; set; }
         
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
        public static void Fill(Models.Notification entity, ViewModels.NotificationX notification,int userid)
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
        public static void FillDto(Models.Notification entity, ViewModels.NotificationX notification)
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