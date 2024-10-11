using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class CourseType
    {
        public int Id { get; set; }
        public int? CalenderTypeId { get; set; }
        public int? CourseCategoryId { get; set; }
        public int? LicenseResultBasicId { get; set; }
        public string Title { get; set; }
        public string Remark { get; set; }
        public int? Interval { get; set; }
        public bool? IsGeneral { get; set; }
        public bool? Status { get; set; }
        
        public string Category { get; set; }
        public static void Fill(Models.CourseType entity, ViewModels.CourseType coursetype)
        {
            entity.Id = coursetype.Id;
            entity.CalenderTypeId = coursetype.CalenderTypeId;
            entity.CourseCategoryId = coursetype.CourseCategoryId;
            entity.LicenseResultBasicId = coursetype.LicenseResultBasicId;
            entity.Title = coursetype.Title;
            entity.Remark = coursetype.Remark;
            entity.Interval = coursetype.Interval;
            entity.IsGeneral = coursetype.IsGeneral;
            entity.Status = coursetype.Status;
        }
        public static void FillDto(Models.CourseType entity, ViewModels.CourseType coursetype)
        {
            coursetype.Id = entity.Id;
            coursetype.CalenderTypeId = entity.CalenderTypeId;
            coursetype.CourseCategoryId = entity.CourseCategoryId;
            coursetype.LicenseResultBasicId = entity.LicenseResultBasicId;
            coursetype.Title = entity.Title;
            coursetype.Remark = entity.Remark;
            coursetype.Interval = entity.Interval;
            coursetype.IsGeneral = entity.IsGeneral;
            coursetype.Status = entity.Status;
        }
       


    }
}