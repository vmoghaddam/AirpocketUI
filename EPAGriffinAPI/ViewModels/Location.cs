using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace EPAGriffinAPI.ViewModels
{
    public class Location
    {
        public string Parent { get; set; }
        public string ParentCode { get; set; }
        public string Root { get; set; }
        public string RootCode { get; set; }
        public int Id { get; set; }
        public string Title { get; set; }
        public string TitleFormated { get; set; }
        public string Code { get; set; }
        public string FullCode { get; set; }
        public int CustomerId { get; set; }
        public int TypeId { get; set; }
        public string Remark { get; set; }
        public bool IsVirtual { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
        public int? ParentId { get; set; }
        public int? CityId { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string Website { get; set; }
        public int? RootLocation { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public string SortName { get; set; }
        public string Type { get; set; }
        public int? Items { get; set; }
        public int HasItems { get; set; }
        public static void Fill(Models.Location entity, ViewModels.Location viewlocation)
        {
           
            entity.Id = viewlocation.Id;
            entity.Title = viewlocation.Title;
             
            entity.Code = viewlocation.Code;
            entity.FullCode = viewlocation.FullCode;
            entity.CustomerId = viewlocation.CustomerId;
            entity.TypeId = viewlocation.TypeId;
            entity.Remark = viewlocation.Remark;
            entity.IsVirtual = viewlocation.IsVirtual;
            entity.IsDeleted = viewlocation.IsDeleted;
            entity.IsActive = viewlocation.IsActive;
            entity.ParentId = viewlocation.ParentId;
            entity.CityId = viewlocation.CityId;
            entity.Address = viewlocation.Address;
            entity.PostalCode = viewlocation.PostalCode;
            entity.Website = viewlocation.Website;
            entity.RootLocation = viewlocation.RootLocation;
            
        }
        public static void FillDto(Models.ViewLocation entity, ViewModels.Location viewlocation)
        {
            viewlocation.Parent = entity.Parent;
            viewlocation.ParentCode = entity.ParentCode;
            viewlocation.Root = entity.Root;
            viewlocation.RootCode = entity.RootCode;
            viewlocation.Id = entity.Id;
            viewlocation.Title = entity.Title;
            viewlocation.TitleFormated = entity.TitleFormated;
            viewlocation.Code = entity.Code;
            viewlocation.FullCode = entity.FullCode;
            viewlocation.CustomerId = entity.CustomerId;
            viewlocation.TypeId = entity.TypeId;
            viewlocation.Remark = entity.Remark;
            viewlocation.IsVirtual = entity.IsVirtual;
            viewlocation.IsDeleted = entity.IsDeleted;
            viewlocation.IsActive = entity.IsActive;
            viewlocation.ParentId = entity.ParentId;
            viewlocation.CityId = entity.CityId;
            viewlocation.Address = entity.Address;
            viewlocation.PostalCode = entity.PostalCode;
            viewlocation.Website = entity.Website;
            viewlocation.RootLocation = entity.RootLocation;
            viewlocation.City = entity.City;
            viewlocation.State = entity.State;
            viewlocation.Country = entity.Country;
            viewlocation.CountryId = entity.CountryId;
            viewlocation.StateId = entity.StateId;
            viewlocation.SortName = entity.SortName;
            viewlocation.Type = entity.Type;
            viewlocation.Items = entity.Items;
            viewlocation.HasItems = entity.HasItems;
        }
    }

    public partial class  EmployeeLocation
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int LocationId { get; set; }
        public bool IsMainLocation { get; set; }
        public Nullable<int> OrgRoleId { get; set; }
        public Nullable<decimal> DateActiveStartP { get; set; }
        public Nullable<decimal> DateActiveEndP { get; set; }
        public Nullable<System.DateTime> DateActiveStart { get; set; }
        public Nullable<System.DateTime> DateActiveEnd { get; set; }
        public string Remark { get; set; }
        public string Phone { get; set; }
        public string OrgRole { get; set; }
        public string Title { get; set; }
        public string FullCode { get; set; }
        public static void Fill(Models.EmployeeLocation entity, ViewModels.EmployeeLocation employeelocation)
        {
            entity.Id = employeelocation.Id;
            entity.EmployeeId = employeelocation.EmployeeId;
            entity.LocationId = employeelocation.LocationId;
            entity.IsMainLocation = employeelocation.IsMainLocation;
            entity.OrgRoleId = employeelocation.OrgRoleId;
            entity.DateActiveStartP = employeelocation.DateActiveStartP;
            entity.DateActiveEndP = employeelocation.DateActiveEndP;
            entity.DateActiveStart = employeelocation.DateActiveStart;
            entity.DateActiveEnd = employeelocation.DateActiveEnd;
            entity.Remark = employeelocation.Remark;
            entity.Phone = employeelocation.Phone;
        }
        public static void FillDto(Models.ViewEmployeeLocation entity, ViewModels.EmployeeLocation viewemployeelocation)
        {
            viewemployeelocation.Id = entity.Id;
            viewemployeelocation.EmployeeId = entity.EmployeeId;
            viewemployeelocation.LocationId = entity.LocationId;
            viewemployeelocation.IsMainLocation = entity.IsMainLocation;
            viewemployeelocation.OrgRoleId = entity.OrgRoleId;
            viewemployeelocation.DateActiveStartP = entity.DateActiveStartP;
            viewemployeelocation.DateActiveEndP = entity.DateActiveEndP;
            viewemployeelocation.DateActiveStart = entity.DateActiveStart;
            viewemployeelocation.DateActiveEnd = entity.DateActiveEnd;
            viewemployeelocation.Remark = entity.Remark;
            viewemployeelocation.Phone = entity.Phone;
            viewemployeelocation.OrgRole = entity.OrgRole;
            viewemployeelocation.Title = entity.Title;
            viewemployeelocation.FullCode = entity.FullCode;
        }
        public static ViewModels.EmployeeLocation GetDto(Models.ViewEmployeeLocation entity)
        {
            var result = new ViewModels.EmployeeLocation();
            FillDto(entity, result);
            return result;
        }
        public static List<ViewModels.EmployeeLocation> GetDtos(List<Models.ViewEmployeeLocation> entities)
        {
            var result = new List<ViewModels.EmployeeLocation>();
            foreach (var x in entities)
                result.Add(GetDto(x));
            return result;

        }
    }
}