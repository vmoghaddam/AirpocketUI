using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class EmployeeAbs
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public string Phone1 { get; set; }
        public int? BaseAirportId { get; set; }
        public Nullable<int> GroupId { get; set; }
        public string NID { get; set; }
        public int SexId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateBirth { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string PassportNumber { get; set; }
        public DateTime? DatePassportIssue { get; set; }
        public DateTime? DatePassportExpire { get; set; }
        public string Address { get; set; }
        public int? CityId { get; set; }

        public string LinkedIn { get; set; }
        public string WhatsApp { get; set; }
        public string Telegram { get; set; }
        public string PostalCode { get; set; }

    }
    public class Employee:PersonCustomer
    {
       
        public string PID { get; set; }
        public string Phone { get; set; }
        public int? BaseAirportId { get; set; }
        public DateTime? DateInactiveBegin { get; set; }

        public DateTime? DateInactiveEnd { get; set; }
        public bool? InActive { get; set; }

        List<EmployeeLocation> locations = null;
        public List<EmployeeLocation> Locations
        {
            get
            {
                if (locations == null)
                    locations = new List<EmployeeLocation>();
                return locations;

            }
            set { locations = value; }
        }
        public static void Fill(Models.Employee entity, ViewModels.Employee employee)
        {
            entity.Id = employee.Id;
            entity.InActive = employee.InActive;
            entity.PID = employee.PID;
            entity.Phone = employee.Phone;
            entity.BaseAirportId = employee.BaseAirportId;
            entity.DateInactiveBegin = employee.DateInactiveBegin;
            if (employee.DateInactiveEnd != null)
                entity.DateInactiveEnd = ((DateTime)employee.DateInactiveEnd).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
        }
    }


    public class CertificationDto
    {

    }
}