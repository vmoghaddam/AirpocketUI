using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class Organization
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Website { get; set; }
        public string Email { get; set; }
        public string Tel { get; set; }
        public string Fax { get; set; }
        public string ContactPerson { get; set; }
        public string Address { get; set; }
        public string Remark { get; set; }
        public string LogoUrl { get; set; }
        public int? TypeId { get; set; }
        public int CountryId { get; set; }
        public static void Fill(Models.Organization entity, ViewModels.Organization organization)
        {
            entity.Id = organization.Id;
            entity.Title = organization.Title;
            entity.Website = organization.Website;
            entity.Email = organization.Email;
            entity.Tel = organization.Tel;
            entity.Fax = organization.Fax;
            entity.ContactPerson = organization.ContactPerson;
            entity.Address = organization.Address;
            entity.Remark = organization.Remark;
            entity.LogoUrl = organization.LogoUrl;
            entity.TypeId = organization.TypeId;
            entity.CountryId = organization.CountryId;
        }
        public static void FillDto(Models.Organization entity, ViewModels.Organization organization)
        {
            organization.Id = entity.Id;
            organization.Title = entity.Title;
            organization.Website = entity.Website;
            organization.Email = entity.Email;
            organization.Tel = entity.Tel;
            organization.Fax = entity.Fax;
            organization.ContactPerson = entity.ContactPerson;
            organization.Address = entity.Address;
            organization.Remark = entity.Remark;
            organization.LogoUrl = entity.LogoUrl;
            organization.TypeId = entity.TypeId;
            organization.CountryId = entity.CountryId;
        }
    }
}