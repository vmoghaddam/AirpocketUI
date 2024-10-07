using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class Ac_MSNDto
    {
        public int ID { get; set; }
        public int? AC_ModelID { get; set; }
        public Guid? pkAircraftMSN { get; set; }
        public int? fkFlight_Range { get; set; }
        public int AirlineOperatorsID { get; set; }
        public int? fkAc_MSN_Status { get; set; }
        public int? MSN { get; set; }
        public string Register { get; set; }
        public int? TFH_Hours { get; set; }
        public byte? TFH_Minutes { get; set; }
        public int? TFC { get; set; }
        public DateTime? ManDate { get; set; }
        public DateTime? Last_WB { get; set; }
        public bool? ETOPS { get; set; }
        public bool? AC_Flag { get; set; }
        public int? Cabin_Seat_Ver_F { get; set; }
        public int? Cabin_Seat_Ver_B { get; set; }
        public int? Cabin_Seat_Ver_C { get; set; }
        public int? Cabin_Seat_Ver_R { get; set; }
        public int? Lav_QTY { get; set; }
        public int? Galley_QTY { get; set; }
        public int? Cabin_CrewVer { get; set; }
        public int? Cockpit_Seat_Ver_Pilot { get; set; }
        public int? Cockpit_Seat_Ver_FlightEngineer { get; set; }
        public int? Cockpit_Seat_Ver_Observer { get; set; }
        public string Previous_Register { get; set; }
        public int? Fuel_LH_Outer { get; set; }
        public int? Fuel_LH_Inner { get; set; }
        public int? Fuel_Center { get; set; }
        public int? Fuel_RH_Inner { get; set; }
        public int? Fuel_RH_Outer { get; set; }
        public int? Fuel_ACT1 { get; set; }
        public int? Fuel_ACT2 { get; set; }
        public int? Fuel_Trim { get; set; }
        public int? Fuel_Total { get; set; }
        public bool? FuelUnit { get; set; }
        public int CustomerId { get; set; }
        public static void Fill(Models.Ac_MSN entity, ViewModels.Ac_MSNDto ac_msn)
        {
            entity.ID = ac_msn.ID;
            entity.AC_ModelID = ac_msn.AC_ModelID;
            entity.pkAircraftMSN = ac_msn.pkAircraftMSN;
            entity.fkFlight_Range = ac_msn.fkFlight_Range;
            entity.AirlineOperatorsID = ac_msn.AirlineOperatorsID;
            entity.fkAc_MSN_Status = ac_msn.fkAc_MSN_Status;
            entity.MSN = ac_msn.MSN;
            entity.Register = ac_msn.Register;
            entity.TFH_Hours = ac_msn.TFH_Hours;
            entity.TFH_Minutes = ac_msn.TFH_Minutes;
            entity.TFC = ac_msn.TFC;
            entity.ManDate = ac_msn.ManDate;
            entity.Last_WB = ac_msn.Last_WB;
            entity.ETOPS = ac_msn.ETOPS;
            entity.AC_Flag = ac_msn.AC_Flag;
            entity.Cabin_Seat_Ver_F = ac_msn.Cabin_Seat_Ver_F;
            entity.Cabin_Seat_Ver_B = ac_msn.Cabin_Seat_Ver_B;
            entity.Cabin_Seat_Ver_C = ac_msn.Cabin_Seat_Ver_C;
            entity.Cabin_Seat_Ver_R = ac_msn.Cabin_Seat_Ver_R;
            entity.Lav_QTY = ac_msn.Lav_QTY;
            entity.Galley_QTY = ac_msn.Galley_QTY;
            entity.Cabin_CrewVer = ac_msn.Cabin_CrewVer;
            entity.Cockpit_Seat_Ver_Pilot = ac_msn.Cockpit_Seat_Ver_Pilot;
            entity.Cockpit_Seat_Ver_FlightEngineer = ac_msn.Cockpit_Seat_Ver_FlightEngineer;
            entity.Cockpit_Seat_Ver_Observer = ac_msn.Cockpit_Seat_Ver_Observer;
            entity.Previous_Register = ac_msn.Previous_Register;
            entity.Fuel_LH_Outer = ac_msn.Fuel_LH_Outer;
            entity.Fuel_LH_Inner = ac_msn.Fuel_LH_Inner;
            entity.Fuel_Center = ac_msn.Fuel_Center;
            entity.Fuel_RH_Inner = ac_msn.Fuel_RH_Inner;
            entity.Fuel_RH_Outer = ac_msn.Fuel_RH_Outer;
            entity.Fuel_ACT1 = ac_msn.Fuel_ACT1;
            entity.Fuel_ACT2 = ac_msn.Fuel_ACT2;
            entity.Fuel_Trim = ac_msn.Fuel_Trim;
            entity.Fuel_Total = ac_msn.Fuel_Total;
            entity.FuelUnit = ac_msn.FuelUnit;
            entity.CustomerId = ac_msn.CustomerId;
        }
        public static void FillDto(Models.Ac_MSN entity, ViewModels.Ac_MSNDto ac_msn)
        {
            ac_msn.ID = entity.ID;
            ac_msn.AC_ModelID = entity.AC_ModelID;
            ac_msn.pkAircraftMSN = entity.pkAircraftMSN;
            ac_msn.fkFlight_Range = entity.fkFlight_Range;
            ac_msn.AirlineOperatorsID = entity.AirlineOperatorsID;
            ac_msn.fkAc_MSN_Status = entity.fkAc_MSN_Status;
            ac_msn.MSN = entity.MSN;
            ac_msn.Register = entity.Register;
            ac_msn.TFH_Hours = entity.TFH_Hours;
            ac_msn.TFH_Minutes = entity.TFH_Minutes;
            ac_msn.TFC = entity.TFC;
            ac_msn.ManDate = entity.ManDate;
            ac_msn.Last_WB = entity.Last_WB;
            ac_msn.ETOPS = entity.ETOPS;
            ac_msn.AC_Flag = entity.AC_Flag;
            ac_msn.Cabin_Seat_Ver_F = entity.Cabin_Seat_Ver_F;
            ac_msn.Cabin_Seat_Ver_B = entity.Cabin_Seat_Ver_B;
            ac_msn.Cabin_Seat_Ver_C = entity.Cabin_Seat_Ver_C;
            ac_msn.Cabin_Seat_Ver_R = entity.Cabin_Seat_Ver_R;
            ac_msn.Lav_QTY = entity.Lav_QTY;
            ac_msn.Galley_QTY = entity.Galley_QTY;
            ac_msn.Cabin_CrewVer = entity.Cabin_CrewVer;
            ac_msn.Cockpit_Seat_Ver_Pilot = entity.Cockpit_Seat_Ver_Pilot;
            ac_msn.Cockpit_Seat_Ver_FlightEngineer = entity.Cockpit_Seat_Ver_FlightEngineer;
            ac_msn.Cockpit_Seat_Ver_Observer = entity.Cockpit_Seat_Ver_Observer;
            ac_msn.Previous_Register = entity.Previous_Register;
            ac_msn.Fuel_LH_Outer = entity.Fuel_LH_Outer;
            ac_msn.Fuel_LH_Inner = entity.Fuel_LH_Inner;
            ac_msn.Fuel_Center = entity.Fuel_Center;
            ac_msn.Fuel_RH_Inner = entity.Fuel_RH_Inner;
            ac_msn.Fuel_RH_Outer = entity.Fuel_RH_Outer;
            ac_msn.Fuel_ACT1 = entity.Fuel_ACT1;
            ac_msn.Fuel_ACT2 = entity.Fuel_ACT2;
            ac_msn.Fuel_Trim = entity.Fuel_Trim;
            ac_msn.Fuel_Total = entity.Fuel_Total;
            ac_msn.FuelUnit = entity.FuelUnit;
            ac_msn.CustomerId = entity.CustomerId;
        }
    }
}