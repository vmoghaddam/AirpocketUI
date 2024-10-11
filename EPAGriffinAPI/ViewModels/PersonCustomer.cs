using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class PersonCustomer
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public DateTime? DateJoinCompany { get; set; }
        public decimal? DateJoinCompanyP { get; set; }
        public bool IsActive { get; set; }
        public decimal? DateRegisterP { get; set; }
        public decimal? DateConfirmedP { get; set; }
        public DateTime? DateRegister { get; set; }
        public DateTime? DateConfirmed { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DateActiveStart { get; set; }
        public DateTime? DateActiveEnd { get; set; }
        public decimal? DateLastLoginP { get; set; }
        public DateTime? DateLastLogin { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int? CustomerId { get; set; }
        public Nullable<int> GroupId { get; set; }

        public Person Person { get; set; }
        public static void Fill(Models.PersonCustomer entity, ViewModels.Employee personcustomer)
        {
            entity.Id = personcustomer.Id;
            entity.PersonId = personcustomer.PersonId;
            entity.DateJoinCompany = personcustomer.DateJoinCompany;
            if (personcustomer.DateJoinCompany!=null)
            entity.DateJoinCompanyP =Convert.ToDecimal( Utils.DateTimeUtil.GetPersianDateDigital((DateTime) personcustomer.DateJoinCompany));
            entity.IsActive = personcustomer.IsActive;
           
            if (entity.Id == -1)
            {
                entity.DateRegister = DateTime.Now;
                entity.DateRegisterP = Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateTimeDigital((DateTime)entity.DateRegister));
                entity.DateConfirmed = personcustomer.DateRegister;
                entity.DateConfirmedP = entity.DateRegisterP;
            }
             

            entity.IsDeleted = personcustomer.IsDeleted;
            entity.DateActiveStart = personcustomer.DateActiveStart;
            entity.DateActiveEnd = personcustomer.DateActiveEnd;
           // entity.DateLastLoginP = personcustomer.DateLastLoginP;
            //entity.DateLastLogin = personcustomer.DateLastLogin;
            entity.Username = personcustomer.PID;
            entity.Password = personcustomer.PID;
            entity.CustomerId = personcustomer.CustomerId;
            entity.GroupId = personcustomer.GroupId;
        }
    }
}