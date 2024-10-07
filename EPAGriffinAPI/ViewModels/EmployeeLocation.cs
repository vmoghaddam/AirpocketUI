using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class _EmployeeLocation
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int LocationId { get; set; }
        public bool IsMainLocation { get; set; }
        public int? OrgRoleId { get; set; }
        public decimal? DateActiveStartP { get; set; }
        public decimal? DateActiveEndP { get; set; }
        public DateTime? DateActiveStart { get; set; }
        public DateTime? DateActiveEnd { get; set; }
        public string Remark { get; set; }
        public string Phone { get; set; }
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
    }
}