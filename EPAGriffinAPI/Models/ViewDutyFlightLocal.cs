//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EPAGriffinAPI.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class ViewDutyFlightLocal
    {
        public int Id { get; set; }
        public int FDPId { get; set; }
        public Nullable<int> FlightId { get; set; }
        public System.DateTime CDate { get; set; }
        public Nullable<System.DateTime> DatePart { get; set; }
        public Nullable<int> CrewId { get; set; }
        public Nullable<bool> IsCanceled { get; set; }
        public Nullable<int> DurationLocal { get; set; }
        public Nullable<int> Year { get; set; }
        public string FlightNumber { get; set; }
        public Nullable<System.DateTime> DepartureLocal { get; set; }
        public Nullable<System.DateTime> DepartureDay { get; set; }
        public Nullable<System.DateTime> ArrivalLocal { get; set; }
        public Nullable<System.DateTime> Departure { get; set; }
        public Nullable<System.DateTime> Arrival { get; set; }
        public Nullable<System.DateTime> STD { get; set; }
        public Nullable<System.DateTime> STA { get; set; }
        public Nullable<int> FlightStatusID { get; set; }
    }
}