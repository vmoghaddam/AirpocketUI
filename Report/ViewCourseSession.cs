//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Report
{
    using System;
    using System.Collections.Generic;
    
    public partial class ViewCourseSession
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public Nullable<System.DateTime> DateStart { get; set; }
        public Nullable<System.DateTime> DateEnd { get; set; }
        public Nullable<System.DateTime> DateStartUtc { get; set; }
        public Nullable<System.DateTime> DateEndUtc { get; set; }
        public bool Done { get; set; }
        public string Remark { get; set; }
        public string Key { get; set; }
        public string DayName { get; set; }
        public Nullable<int> Year { get; set; }
        public string MonthName { get; set; }
        public Nullable<int> Month { get; set; }
        public string PDate { get; set; }
        public string PYearName { get; set; }
        public Nullable<int> PYear { get; set; }
        public string PMonthName { get; set; }
        public Nullable<int> PMonth { get; set; }
        public string PDayName { get; set; }
        public string No { get; set; }
        public string Instructor { get; set; }
        public string Title { get; set; }
        public string CT_Title { get; set; }
        public Nullable<int> CustomerId { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public Nullable<int> OrganizationId { get; set; }
        public string Organization { get; set; }
        public Nullable<bool> IsGeneral { get; set; }
        public Nullable<int> StatusId { get; set; }
        public string Status { get; set; }
    }
}