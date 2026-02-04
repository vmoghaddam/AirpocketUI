using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class FlightDto
    {
        public int ID { get; set; }
        public int? TypeID { get; set; }
        public int? RegisterID { get; set; }
        public int? FlightTypeID { get; set; }
        public int? FlightStatusID { get; set; }
        public int? AirlineOperatorsID { get; set; }
        public int? FlightGroupID { get; set; }
        public string FlightNumber { get; set; }
        public int? FromAirportId { get; set; }
        public int? ToAirportId { get; set; }
        public string STDRAW { get; set; }
        public string STARAW { get; set; }
        public DateTime? STD { get; set; }
        public DateTime? STA { get; set; }
        public DateTime? ChocksOut { get; set; }
        public DateTime? Takeoff { get; set; }
        public DateTime? Landing { get; set; }
        public DateTime? ChocksIn { get; set; }
        public int? FlightH { get; set; }
        public byte? FlightM { get; set; }
        public int? BlockH { get; set; }
        public byte? BlockM { get; set; }
        public decimal? GWTO { get; set; }
        public decimal? GWLand { get; set; }
        public decimal? FuelPlanned { get; set; }
        public decimal? FuelActual { get; set; }
        public decimal? FuelDeparture { get; set; }
        public decimal? FuelArrival { get; set; }
        public int? PaxAdult { get; set; }
        public int? NightTime { get; set; }
        public int? PaxInfant { get; set; }
        public int? PaxChild { get; set; }
        public int? CargoWeight { get; set; }
        public int? CargoUnitID { get; set; }
        public int? BaggageCount { get; set; }
        public int? CustomerId { get; set; }
        public int? FlightPlanId { get; set; }
        public DateTime? DateCreate { get; set; }
        public int? CargoCount { get; set; }
        public int? BaggageWeight { get; set; }
        public int? FuelUnitID { get; set; }
        public string ArrivalRemark { get; set; }
        public string DepartureRemark { get; set; }
        public int? EstimatedDelay { get; set; }
        public int? FlightStatusUserId { get; set; }

        public int? LinkedFlight { get; set; }
        public int? LinkedReason { get; set; }
        public string LinkedRemark { get; set; }

        public int? BoxId { get; set; }
        public Nullable<int> CPCrewId { get; set; }
        public string CPRegister { get; set; }
        public Nullable<int> CPPositionId { get; set; }
        public Nullable<int> CPFlightTypeId { get; set; }
        public Nullable<int> CPFDPItemId { get; set; }
        public Nullable<bool> CPDH { get; set; }

        public Nullable<int> PFLR { get; set; }
        public Nullable<int> CPFDPId { get; set; }
        public string CPInstructor { get; set; }
        public string CPP1 { get; set; }
        public string CPP2 { get; set; }
        public string CPSCCM { get; set; }
        public string CPISCCM { get; set; }

        public int? SMSNira { get; set; }
        public string UserName { get; set; }

        public int? Interval { get; set; }
        public DateTime? IntervalFrom { get; set; }
        public DateTime? IntervalTo { get; set; }
        public string IntervalFromRAW { get; set; }
        public string IntervalToRAW { get; set; }
        public List<int> Days { get; set; }
        public List<int> DaysUTC { get; set; }
        public DateTime? RefDate { get; set; }
        public string RefDateRAW { get; set; }
        public int? RefDays { get; set; }
        public int? CheckTime { get; set; }

        public int? STDHH { get; set; }
        public int? STDMM { get; set; }

        public string ChrCode { get; set; }
        public string ChrTitle { get; set; }




        public static void Fill(Models.FlightInformation entity, ViewModels.FlightDto flightinformation)
        {
            entity.ID = flightinformation.ID;
            entity.TypeID = flightinformation.TypeID;
            entity.RegisterID = flightinformation.RegisterID;
            entity.FlightTypeID = flightinformation.FlightTypeID;
            entity.FlightStatusID = flightinformation.FlightStatusID;
            entity.AirlineOperatorsID = flightinformation.AirlineOperatorsID;
            entity.FlightGroupID = flightinformation.FlightGroupID;
            entity.FlightNumber = flightinformation.FlightNumber;
            entity.FromAirportId = flightinformation.FromAirportId;
            entity.ToAirportId = flightinformation.ToAirportId;
            entity.STD = flightinformation.STD;
            entity.STA = flightinformation.STA;
            entity.ChocksOut = flightinformation.ChocksOut;
            entity.Takeoff = flightinformation.Takeoff;
            entity.Landing = flightinformation.Landing;
            entity.ChocksIn = flightinformation.ChocksIn;
            entity.FlightH = flightinformation.FlightH;
            entity.FlightM = flightinformation.FlightM;
            entity.BlockH = flightinformation.BlockH;
            entity.BlockM = flightinformation.BlockM;
            entity.GWTO = flightinformation.GWTO;
            entity.GWLand = flightinformation.GWLand;
            entity.FuelPlanned = flightinformation.FuelPlanned;
            entity.FuelActual = flightinformation.FuelActual;
            entity.FuelDeparture = flightinformation.FuelDeparture;
            entity.FuelArrival = flightinformation.FuelArrival;
            entity.PaxAdult = flightinformation.PaxAdult;
            entity.PaxInfant = flightinformation.PaxInfant;
            entity.PaxChild = flightinformation.PaxChild;
            entity.CargoWeight = flightinformation.CargoWeight;
            entity.CargoUnitID = flightinformation.CargoUnitID;
            entity.BaggageCount = flightinformation.BaggageCount;
            entity.CustomerId = flightinformation.CustomerId;
            entity.FlightPlanId = flightinformation.FlightPlanId;
            entity.DateCreate = flightinformation.DateCreate;
            entity.CargoCount = flightinformation.CargoCount;
            entity.BaggageWeight = flightinformation.BaggageWeight;
            entity.FuelUnitID = flightinformation.FuelUnitID;
            entity.ArrivalRemark = flightinformation.ArrivalRemark;
            entity.DepartureRemark = flightinformation.DepartureRemark;
            entity.EstimatedDelay = flightinformation.EstimatedDelay;
            entity.FlightStatusUserId = flightinformation.FlightStatusUserId;
            entity.ChrCode = flightinformation.ChrCode;
            entity.ChrTitle = flightinformation.ChrTitle;
        }

        public static void FillNotID(Models.FlightInformation entity, ViewModels.FlightDto flightinformation)
        {
            //entity.ID = flightinformation.ID;
            entity.TypeID = flightinformation.TypeID;
            entity.RegisterID = flightinformation.RegisterID;
            entity.FlightTypeID = flightinformation.FlightTypeID;
            entity.FlightStatusID = flightinformation.FlightStatusID;
            entity.AirlineOperatorsID = flightinformation.AirlineOperatorsID;
            entity.FlightGroupID = flightinformation.FlightGroupID;
            entity.FlightNumber = flightinformation.FlightNumber;
            entity.FromAirportId = flightinformation.FromAirportId;
            entity.ToAirportId = flightinformation.ToAirportId;
            entity.STD = flightinformation.STD;
            entity.STA = flightinformation.STA;
            entity.ChocksOut = flightinformation.ChocksOut;
            entity.Takeoff = flightinformation.Takeoff;
            entity.Landing = flightinformation.Landing;
            entity.ChocksIn = flightinformation.ChocksIn;
            entity.FlightH = flightinformation.FlightH;
            entity.FlightM = flightinformation.FlightM;
            entity.BlockH = flightinformation.BlockH;
            entity.BlockM = flightinformation.BlockM;
            entity.GWTO = flightinformation.GWTO;
            entity.GWLand = flightinformation.GWLand;
            entity.FuelPlanned = flightinformation.FuelPlanned;
            entity.FuelActual = flightinformation.FuelActual;
            entity.FuelDeparture = flightinformation.FuelDeparture;
            entity.FuelArrival = flightinformation.FuelArrival;
            entity.PaxAdult = flightinformation.PaxAdult;
            entity.PaxInfant = flightinformation.PaxInfant;
            entity.PaxChild = flightinformation.PaxChild;
            entity.CargoWeight = flightinformation.CargoWeight;
            entity.CargoUnitID = flightinformation.CargoUnitID;
            entity.BaggageCount = flightinformation.BaggageCount;
            entity.CustomerId = flightinformation.CustomerId;
            entity.FlightPlanId = flightinformation.FlightPlanId;
            entity.DateCreate = flightinformation.DateCreate;
            entity.CargoCount = flightinformation.CargoCount;
            entity.BaggageWeight = flightinformation.BaggageWeight;
            entity.FuelUnitID = flightinformation.FuelUnitID;
            entity.ArrivalRemark = flightinformation.ArrivalRemark;
            entity.DepartureRemark = flightinformation.DepartureRemark;
            entity.EstimatedDelay = flightinformation.EstimatedDelay;
            entity.FlightStatusUserId = flightinformation.FlightStatusUserId;
        }

        public static void FillForGroupUpdate(Models.FlightInformation entity, ViewModels.FlightDto flightinformation)
        {
            //entity.ID = flightinformation.ID;
            //entity.TypeID = flightinformation.TypeID;
            //entity.RegisterID = flightinformation.RegisterID;
            entity.FlightTypeID = flightinformation.FlightTypeID;
            entity.FlightStatusID = flightinformation.FlightStatusID;
            entity.AirlineOperatorsID = flightinformation.AirlineOperatorsID;
            entity.FlightGroupID = flightinformation.FlightGroupID;
            entity.FlightNumber = flightinformation.FlightNumber;
            entity.FromAirportId = flightinformation.FromAirportId;
            entity.ToAirportId = flightinformation.ToAirportId;
            entity.STD = flightinformation.STD;
            entity.STA = flightinformation.STA;
            entity.ChocksOut = flightinformation.ChocksOut;
            entity.Takeoff = flightinformation.Takeoff;
            entity.Landing = flightinformation.Landing;
            entity.ChocksIn = flightinformation.ChocksIn;
            entity.FlightH = flightinformation.FlightH;
            entity.FlightM = flightinformation.FlightM;
            entity.BlockH = flightinformation.BlockH;
            entity.BlockM = flightinformation.BlockM;
            entity.GWTO = flightinformation.GWTO;
            entity.GWLand = flightinformation.GWLand;
            entity.FuelPlanned = flightinformation.FuelPlanned;
            entity.FuelActual = flightinformation.FuelActual;
            entity.FuelDeparture = flightinformation.FuelDeparture;
            entity.FuelArrival = flightinformation.FuelArrival;
            entity.PaxAdult = flightinformation.PaxAdult;
            entity.PaxInfant = flightinformation.PaxInfant;
            entity.PaxChild = flightinformation.PaxChild;
            entity.CargoWeight = flightinformation.CargoWeight;
            entity.CargoUnitID = flightinformation.CargoUnitID;
            entity.BaggageCount = flightinformation.BaggageCount;
            entity.CustomerId = flightinformation.CustomerId;
            entity.FlightPlanId = flightinformation.FlightPlanId;
            entity.DateCreate = flightinformation.DateCreate;
            entity.CargoCount = flightinformation.CargoCount;
            entity.BaggageWeight = flightinformation.BaggageWeight;
            entity.FuelUnitID = flightinformation.FuelUnitID;
            entity.ArrivalRemark = flightinformation.ArrivalRemark;
            entity.DepartureRemark = flightinformation.DepartureRemark;
            entity.EstimatedDelay = flightinformation.EstimatedDelay;
            entity.FlightStatusUserId = flightinformation.FlightStatusUserId;
            entity.ChrCode = flightinformation.ChrCode;
            entity.ChrTitle = flightinformation.ChrTitle;
        }
        public static void FillDto(Models.FlightInformation entity, ViewModels.FlightDto flightinformation)
        {
            flightinformation.ID = entity.ID;
            flightinformation.TypeID = entity.TypeID;
            flightinformation.RegisterID = entity.RegisterID;
            flightinformation.FlightTypeID = entity.FlightTypeID;
            flightinformation.FlightStatusID = entity.FlightStatusID;
            flightinformation.AirlineOperatorsID = entity.AirlineOperatorsID;
            flightinformation.FlightGroupID = entity.FlightGroupID;
            flightinformation.FlightNumber = entity.FlightNumber;
            flightinformation.FromAirportId = entity.FromAirportId;
            flightinformation.ToAirportId = entity.ToAirportId;
            flightinformation.STD = entity.STD;
            flightinformation.STA = entity.STA;
            flightinformation.ChocksOut = entity.ChocksOut;
            flightinformation.Takeoff = entity.Takeoff;
            flightinformation.Landing = entity.Landing;
            flightinformation.ChocksIn = entity.ChocksIn;
            flightinformation.FlightH = entity.FlightH;
            flightinformation.FlightM = entity.FlightM;
            flightinformation.BlockH = entity.BlockH;
            flightinformation.BlockM = entity.BlockM;
            flightinformation.GWTO = entity.GWTO;
            flightinformation.GWLand = entity.GWLand;
            flightinformation.FuelPlanned = entity.FuelPlanned;
            flightinformation.FuelActual = entity.FuelActual;
            flightinformation.FuelDeparture = entity.FuelDeparture;
            flightinformation.FuelArrival = entity.FuelArrival;
            flightinformation.PaxAdult = entity.PaxAdult;
            flightinformation.PaxInfant = entity.PaxInfant;
            flightinformation.PaxChild = entity.PaxChild;
            flightinformation.CargoWeight = entity.CargoWeight;
            flightinformation.CargoUnitID = entity.CargoUnitID;
            flightinformation.BaggageCount = entity.BaggageCount;
            flightinformation.CustomerId = entity.CustomerId;
            flightinformation.FlightPlanId = entity.FlightPlanId;
            flightinformation.DateCreate = entity.DateCreate;
            flightinformation.CargoCount = entity.CargoCount;
            flightinformation.BaggageWeight = entity.BaggageWeight;
            flightinformation.FuelUnitID = entity.FuelUnitID;
            flightinformation.ArrivalRemark = entity.ArrivalRemark;
            flightinformation.DepartureRemark = entity.DepartureRemark;
            flightinformation.EstimatedDelay = entity.EstimatedDelay;
            flightinformation.FlightStatusUserId = entity.FlightStatusUserId;
        }
    }
    public class ViewFlightInformationDto
    {
        public int ID { get; set; }
        public string ResKey { get; set; }
        public DateTime? DutyStartLocal { get; set; }
        public DateTime? DutyEndLocal { get; set; }
        public string ResTitle { get; set; }
        public int Id { get; set; }
        public bool IsBox { get; set; }
        public int? Duty { get; set; }
        public double? MaxFDPExtended { get; set; }



        public int IsDutyOver { get; set; }
        public int WOCLError { get; set; }
        public int? Flight { get; set; }
        public bool HasCrew { get; set; }
        public bool HasCrewProblem { get; set; }
        public bool ExtendedBySplitDuty { get; set; }
        // public bool SplitDuty { get; set; }

        public bool AllCrewAssigned { get; set; }
        public int? BoxId { get; set; }
        public string Flights { get; set; }
        public int? CalendarId { get; set; }
        public DateTime? Date { get; set; }
        public List<ViewFlightInformationDto> BoxItems = new List<ViewFlightInformationDto>();
        public int taskID { get; set; }
        public int? FlightPlanId { get; set; }
        public int? BaggageCount { get; set; }
        public int? CargoUnitID { get; set; }
        public string CargoUnit { get; set; }
        public string FuelUnit { get; set; }
        public int? CargoWeight { get; set; }
        public int? PaxChild { get; set; }
        public int? PaxInfant { get; set; }
        public int? FlightStatusUserId { get; set; }
        public int? PaxAdult { get; set; }
        public int? NightTime { get; set; }
        public int? TotalPax { get; set; }
        public int? PaxOver { get; set; }
        public decimal? FuelArrival { get; set; }
        public decimal? FuelDeparture { get; set; }
        public decimal? FuelActual { get; set; }
        public decimal? FuelPlanned { get; set; }
        public decimal? GWLand { get; set; }
        public decimal? GWTO { get; set; }
        public byte? BlockM { get; set; }
        public int? BlockH { get; set; }
        public int? FlightH { get; set; }
        public byte? FlightM { get; set; }
        public DateTime? ChocksIn { get; set; }
        public DateTime? DateStatus { get; set; }
        public DateTime? Landing { get; set; }
        public DateTime? Takeoff { get; set; }
        public DateTime? ChocksOut { get; set; }
        public DateTime? STD { get; set; }
        public DateTime? STA { get; set; }
        public DateTime STDDay { get; set; }
        public int FlightStatusID { get; set; }
        public int? RegisterID { get; set; }
        public int? FlightTypeID { get; set; }
        public int? TypeId { get; set; }
        public int? AirlineOperatorsID { get; set; }
        public string FlightNumber { get; set; }
        public int? FromAirport { get; set; }
        public int? ToAirport { get; set; }
        public DateTime? STAPlanned { get; set; }
        public DateTime? STDPlanned { get; set; }
        public int? FlightHPlanned { get; set; }
        public int? FlightMPlanned { get; set; }
        public string FlightPlan { get; set; }
        public int? CustomerId { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? DateActive { get; set; }
        public string FromAirportName { get; set; }
        public string FromAirportIATA { get; set; }
        public int? FromAirportCityId { get; set; }
        public string ToAirportName { get; set; }
        public string ToAirportIATA { get; set; }
        public int? ToAirportCityId { get; set; }
        public string FromAirportCity { get; set; }
        public string ToAirportCity { get; set; }
        public string AircraftType { get; set; }
        public string Register { get; set; }
        public int? MSN { get; set; }
        public string FlightStatus { get; set; }
        public string FlightStatusBgColor { get; set; }
        public string FlightStatusColor { get; set; }
        public string FlightStatusClass { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string notes { get; set; }
        public int status { get; set; }
        public int progress { get; set; }
        public string taskName { get; set; }
        public DateTime? startDate { get; set; }
        public decimal? duration { get; set; }
        public int taskId { get; set; }
        public int? FlightGroupID { get; set; }
        public int? PlanId { get; set; }
        public int? ManufacturerId { get; set; }
        public string Manufacturer { get; set; }
        public string ToCountry { get; set; }
        public string ToSortName { get; set; }
        public string ToCity { get; set; }
        public string FromSortName { get; set; }
        public string FromContry { get; set; }
        public string FromCity { get; set; }
        public decimal? FromLatitude { get; set; }
        public decimal? FromLongitude { get; set; }
        public decimal? ToLatitude { get; set; }
        public decimal? ToLongitude { get; set; }
        public int? CargoCount { get; set; }
        public int? BaggageWeight { get; set; }
        public int? FuelUnitID { get; set; }
        public string ArrivalRemark { get; set; }
        public string DepartureRemark { get; set; }
        public int? TotalSeat { get; set; }
        public int? EstimatedDelay { get; set; }
        public int? CancelReasonId { get; set; }
        public string CancelReason { get; set; }
        public string CancelRemark { get; set; }
        public DateTime? CancelDate { get; set; }

        public int? RedirectReasonId { get; set; }
        public string RedirectReason { get; set; }
        public string RedirectRemark { get; set; }
        public DateTime? RedirectDate { get; set; }
        public int? RampReasonId { get; set; }
        public string RampReason { get; set; }
        public string RampRemark { get; set; }
        public DateTime? RampDate { get; set; }

        public int? OToAirportId { get; set; }
        public string OToAirportIATA { get; set; }
        public DateTime? OSTA { get; set; }
        public List<int> resourceId { get; set; }

        public int? BaseId { get; set; }
        public string BaseIATA { get; set; }

        public string BaseName { get; set; }

        public decimal? Defuel { get; set; }
        public decimal? FPFuel { get; set; }
        public bool? SplitDuty { get; set; }
        public bool? IsPositioning { get; set; }
        public int? FPFlightHH { get; set; }
        public int? FPFlightMM { get; set; }

        public int MaleFemalError { get; set; }
        public int? MatchingListError { get; set; }
        public int? LinkedFlight { get; set; }
        public string LinkedFlightNumber { get; set; }
        public decimal? UsedFuel { get; set; }
        public int? JLBLHH { get; set; }
        public int? JLBLMM { get; set; }
        public int? PFLR { get; set; }
        public static void Fill(Models.ViewFlightInformation entity, ViewModels.ViewFlightInformationDto viewflightinformation)
        {
            entity.ID = viewflightinformation.ID;

            entity.FlightPlanId = viewflightinformation.FlightPlanId;
            entity.BaggageCount = viewflightinformation.BaggageCount;
            entity.CargoUnitID = viewflightinformation.CargoUnitID;
            entity.CargoUnit = viewflightinformation.CargoUnit;
            entity.CargoWeight = viewflightinformation.CargoWeight;
            entity.PaxChild = viewflightinformation.PaxChild;
            entity.PaxInfant = viewflightinformation.PaxInfant;
            entity.PaxAdult = viewflightinformation.PaxAdult;
            entity.FuelArrival = viewflightinformation.FuelArrival;
            entity.FuelDeparture = viewflightinformation.FuelDeparture;
            entity.FuelActual = viewflightinformation.FuelActual;
            entity.FuelPlanned = viewflightinformation.FuelPlanned;
            entity.GWLand = viewflightinformation.GWLand;
            entity.GWTO = viewflightinformation.GWTO;
            entity.BlockM = viewflightinformation.BlockM;
            entity.BlockH = viewflightinformation.BlockH;
            entity.FlightH = viewflightinformation.FlightH;
            entity.FlightM = viewflightinformation.FlightM;
            entity.ChocksIn = viewflightinformation.ChocksIn;
            entity.Landing = viewflightinformation.Landing;
            entity.Takeoff = viewflightinformation.Takeoff;
            entity.ChocksOut = viewflightinformation.ChocksOut;
            entity.STD = viewflightinformation.STD;
            entity.STA = viewflightinformation.STA;
            entity.FlightStatusID = viewflightinformation.FlightStatusID;
            entity.RegisterID = viewflightinformation.RegisterID;
            entity.FlightTypeID = viewflightinformation.FlightTypeID;
            entity.TypeId = viewflightinformation.TypeId;
            entity.AirlineOperatorsID = viewflightinformation.AirlineOperatorsID;
            entity.FlightNumber = viewflightinformation.FlightNumber;
            entity.FromAirport = viewflightinformation.FromAirport;
            entity.ToAirport = viewflightinformation.ToAirport;
            entity.STAPlanned = viewflightinformation.STAPlanned;
            entity.STDPlanned = viewflightinformation.STDPlanned;
            entity.FlightHPlanned = viewflightinformation.FlightHPlanned;
            entity.FlightMPlanned = viewflightinformation.FlightMPlanned;
            entity.FlightPlan = viewflightinformation.FlightPlan;
            entity.CustomerId = viewflightinformation.CustomerId;
            entity.IsActive = viewflightinformation.IsActive;
            entity.DateActive = viewflightinformation.DateActive;
            entity.FromAirportName = viewflightinformation.FromAirportName;
            entity.FromAirportIATA = viewflightinformation.FromAirportIATA;
            //entity.FromAirportCityId = viewflightinformation.FromAirportCityId;
            entity.ToAirportName = viewflightinformation.ToAirportName;
            entity.ToAirportIATA = viewflightinformation.ToAirportIATA;
            //  entity.ToAirportCityId = viewflightinformation.ToAirportCityId;
            //  entity.FromAirportCity = viewflightinformation.FromAirportCity;
            //  entity.ToAirportCity = viewflightinformation.ToAirportCity;
            entity.AircraftType = viewflightinformation.AircraftType;
            entity.Register = viewflightinformation.Register;
            entity.MSN = viewflightinformation.MSN;
            entity.FlightStatus = viewflightinformation.FlightStatus;
            entity.FlightStatusBgColor = viewflightinformation.FlightStatusBgColor;
            entity.FlightStatusColor = viewflightinformation.FlightStatusColor;
            entity.FlightStatusClass = viewflightinformation.FlightStatusClass;
            entity.from = viewflightinformation.from;
            entity.to = viewflightinformation.to;
            entity.notes = viewflightinformation.notes;
            entity.status = viewflightinformation.status;
            entity.progress = viewflightinformation.progress;
            entity.taskName = viewflightinformation.taskName;
            entity.startDate = viewflightinformation.startDate;
            entity.duration = viewflightinformation.duration;
            entity.taskId = viewflightinformation.taskId;
            entity.FlightGroupID = viewflightinformation.FlightGroupID;
            entity.PlanId = viewflightinformation.PlanId;
            entity.ManufacturerId = viewflightinformation.ManufacturerId;
            entity.Manufacturer = viewflightinformation.Manufacturer;
            // entity.ToCountry = viewflightinformation.ToCountry;
            // entity.ToSortName = viewflightinformation.ToSortName;
            // entity.ToCity = viewflightinformation.ToCity;
            entity.FromSortName = viewflightinformation.FromSortName;
            entity.FromContry = viewflightinformation.FromContry;
            //  entity.FromCity = viewflightinformation.FromCity;
            entity.FromLatitude = viewflightinformation.FromLatitude;
            entity.FromLongitude = viewflightinformation.FromLongitude;
            entity.ToLatitude = viewflightinformation.ToLatitude;
            entity.ToLongitude = viewflightinformation.ToLongitude;
            entity.CargoCount = viewflightinformation.CargoCount;
            entity.BaggageWeight = viewflightinformation.BaggageWeight;
            entity.FuelUnitID = viewflightinformation.FuelUnitID;
            entity.ArrivalRemark = viewflightinformation.ArrivalRemark;
            entity.DepartureRemark = viewflightinformation.DepartureRemark;
            entity.TotalSeat = viewflightinformation.TotalSeat;
            entity.EstimatedDelay = viewflightinformation.EstimatedDelay;
            entity.PaxOver = viewflightinformation.PaxOver;
            entity.TotalPax = viewflightinformation.TotalPax;
            entity.FuelUnit = viewflightinformation.FuelUnit;
            entity.DateStatus = viewflightinformation.DateStatus;
            entity.FlightStatusUserId = viewflightinformation.FlightStatusUserId;
            entity.CancelDate = viewflightinformation.CancelDate;
            entity.CancelReasonId = viewflightinformation.CancelReasonId;
            entity.CancelReason = viewflightinformation.CancelReason;
            entity.CancelRemark = viewflightinformation.CancelRemark;
            entity.RedirectDate = viewflightinformation.RedirectDate;
            entity.RedirectReasonId = viewflightinformation.RedirectReasonId;
            entity.RedirectReason = viewflightinformation.RedirectReason;
            entity.RedirectRemark = viewflightinformation.RedirectRemark;
            entity.OSTA = viewflightinformation.OSTA;
            entity.OToAirportIATA = viewflightinformation.OToAirportIATA;
            entity.OToAirportId = viewflightinformation.OToAirportId;

            entity.RampDate = viewflightinformation.RampDate;
            entity.RampReasonId = viewflightinformation.RampReasonId;
            entity.RampReason = viewflightinformation.RampReason;
            entity.RampRemark = viewflightinformation.RampRemark;

            entity.FPFlightHH = viewflightinformation.FPFlightHH;
            entity.FPFlightMM = viewflightinformation.FPFlightMM;
            entity.Defuel = viewflightinformation.Defuel;
            entity.FPFuel = viewflightinformation.FPFuel;


        }
        public static void FillDto(Models.ViewFlightInformation entity, ViewModels.ViewFlightInformationDto viewflightinformation, int tzoffset, int? utc = 0)
        {

            tzoffset = Helper.GetTimeOffset((DateTime)entity.STD);
            if (utc == 1)
                tzoffset = 0;
            viewflightinformation.Date = entity.Date;
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.Id = entity.ID;
            viewflightinformation.IsBox = false;
            viewflightinformation.HasCrew = false;
            viewflightinformation.BoxId = entity.BoxId;
            viewflightinformation.CalendarId = entity.CalendarId;
            viewflightinformation.HasCrewProblem = false;
            viewflightinformation.AllCrewAssigned = false;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;
            viewflightinformation.BaggageCount = entity.BaggageCount;
            viewflightinformation.CargoUnitID = entity.CargoUnitID;
            viewflightinformation.CargoUnit = entity.CargoUnit;
            viewflightinformation.CargoWeight = entity.CargoWeight;
            viewflightinformation.PaxChild = entity.PaxChild;
            viewflightinformation.PaxInfant = entity.PaxInfant;
            viewflightinformation.PaxAdult = entity.PaxAdult;
            viewflightinformation.FuelArrival = entity.FuelArrival;
            viewflightinformation.FuelDeparture = entity.FuelDeparture;
            viewflightinformation.FuelActual = entity.FuelActual;
            viewflightinformation.FuelPlanned = entity.FuelPlanned;
            viewflightinformation.GWLand = entity.GWLand;
            viewflightinformation.GWTO = entity.GWTO;
            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);
            viewflightinformation.RampDate = entity.RampDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RampDate).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;
            viewflightinformation.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;
            viewflightinformation.IsActive = entity.IsActive;
            viewflightinformation.DateActive = entity.DateActive;
            viewflightinformation.FromAirportName = entity.FromAirportName;
            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            // viewflightinformation.FromAirportCityId = entity.FromAirportCityId;
            viewflightinformation.ToAirportName = entity.ToAirportName;
            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            //viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            //viewflightinformation.FromAirportCity = entity.FromAirportCity;
            // viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;
            viewflightinformation.FlightStatusBgColor = entity.FlightStatusBgColor;
            viewflightinformation.FlightStatusColor = entity.FlightStatusColor;
            viewflightinformation.FlightStatusClass = entity.FlightStatusClass;
            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.taskID = entity.taskId;
            viewflightinformation.FlightGroupID = entity.FlightGroupID;
            viewflightinformation.PlanId = entity.PlanId;
            viewflightinformation.ManufacturerId = entity.ManufacturerId;
            viewflightinformation.Manufacturer = entity.Manufacturer;
            //viewflightinformation.ToCountry = entity.ToCountry;
            //viewflightinformation.ToSortName = entity.ToSortName;
            //viewflightinformation.ToCity = entity.ToCity;
            viewflightinformation.FromSortName = entity.FromSortName;
            viewflightinformation.FromContry = entity.FromContry;
            //viewflightinformation.FromCity = entity.FromCity;
            viewflightinformation.FromLatitude = entity.FromLatitude;
            viewflightinformation.FromLongitude = entity.FromLongitude;
            viewflightinformation.ToLatitude = entity.ToLatitude;
            viewflightinformation.ToLongitude = entity.ToLongitude;
            viewflightinformation.CargoCount = entity.CargoCount;
            viewflightinformation.BaggageWeight = entity.BaggageWeight;
            viewflightinformation.FuelUnitID = entity.FuelUnitID;
            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;
            viewflightinformation.TotalSeat = entity.TotalSeat;
            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;
            viewflightinformation.PaxOver = entity.PaxOver;
            viewflightinformation.TotalPax = entity.TotalPax;
            viewflightinformation.NightTime = entity.NightTime;


            viewflightinformation.FuelUnit = entity.FuelUnit;
            viewflightinformation.DateStatus = entity.DateStatus == null ? null : (Nullable<DateTime>)((DateTime)entity.DateStatus).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusUserId = entity.FlightStatusUserId;

            viewflightinformation.CancelDate = entity.CancelDate == null ? null : (Nullable<DateTime>)((DateTime)entity.CancelDate).AddMinutes(tzoffset);
            viewflightinformation.CancelReasonId = entity.CancelReasonId;
            viewflightinformation.CancelReason = entity.CancelReason;
            viewflightinformation.CancelRemark = entity.CancelRemark;



            viewflightinformation.RampReasonId = entity.RampReasonId;
            viewflightinformation.RampReason = entity.RampReason;
            viewflightinformation.RampRemark = entity.RampRemark;

            viewflightinformation.RedirectDate = entity.RedirectDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RedirectDate).AddMinutes(tzoffset); ;
            viewflightinformation.RedirectReasonId = entity.RedirectReasonId;
            viewflightinformation.RedirectReason = entity.RedirectReason;
            viewflightinformation.RedirectRemark = entity.RedirectRemark;
            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;

            viewflightinformation.BaseIATA = entity.BaseIATA;
            viewflightinformation.BaseId = entity.BaseId;
            viewflightinformation.BaseName = entity.BaseName;

            viewflightinformation.FPFlightHH = entity.FPFlightHH;
            viewflightinformation.FPFlightMM = entity.FPFlightMM;
            viewflightinformation.Defuel = entity.Defuel;
            viewflightinformation.FPFuel = entity.FPFuel;

            viewflightinformation.SplitDuty = entity.SplitDuty;
            viewflightinformation.MaleFemalError = entity.MaleFemalError == null ? 0 : (int)entity.MaleFemalError;
            viewflightinformation.MatchingListError = entity.MatchingListError == null ? 0 : (int)entity.MatchingListError;
            viewflightinformation.LinkedFlight = entity.LinkedFlight;
            viewflightinformation.LinkedFlightNumber = entity.LinkedFlightNumber;
            viewflightinformation.UsedFuel = entity.UsedFuel;
            viewflightinformation.JLBLHH = entity.JLBLHH;
            viewflightinformation.JLBLMM = entity.JLBLMM;
            viewflightinformation.PFLR = entity.PFLR;


        }
        public static void FillDto(Models.ViewLegTime entity, ViewModels.ViewFlightInformationDto viewflightinformation, int tzoffset)
        {
            viewflightinformation.Date = entity.Date;
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.Id = entity.ID;
            viewflightinformation.IsBox = false;
            viewflightinformation.HasCrew = false;

            viewflightinformation.HasCrewProblem = false;
            viewflightinformation.AllCrewAssigned = false;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;

            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);

            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;

            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;

            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            // viewflightinformation.FromAirportCityId = entity.FromAirportCityId;

            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            //viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            //viewflightinformation.FromAirportCity = entity.FromAirportCity;
            // viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;

            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = (int)entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.taskID = entity.taskId;


            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);



            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;

            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;





            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;



            viewflightinformation.FPFlightHH = entity.FPFlightHH;
            viewflightinformation.FPFlightMM = entity.FPFlightMM;





        }
        public static void FillDto(Models.ViewPlanFlight entity, ViewModels.ViewFlightInformationDto viewflightinformation, int tzoffset)
        {
            viewflightinformation.Date = entity.Date;
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.Id = entity.ID;
            viewflightinformation.IsBox = false;
            viewflightinformation.HasCrew = false;
            viewflightinformation.BoxId = entity.BoxId;
            viewflightinformation.CalendarId = entity.CalendarId;
            viewflightinformation.HasCrewProblem = false;
            viewflightinformation.AllCrewAssigned = false;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;
            viewflightinformation.BaggageCount = entity.BaggageCount;
            viewflightinformation.CargoUnitID = entity.CargoUnitID;
            viewflightinformation.CargoUnit = entity.CargoUnit;
            viewflightinformation.CargoWeight = entity.CargoWeight;
            viewflightinformation.PaxChild = entity.PaxChild;
            viewflightinformation.PaxInfant = entity.PaxInfant;
            viewflightinformation.PaxAdult = entity.PaxAdult;
            viewflightinformation.FuelArrival = entity.FuelArrival;
            viewflightinformation.FuelDeparture = entity.FuelDeparture;
            viewflightinformation.FuelActual = entity.FuelActual;
            viewflightinformation.FuelPlanned = entity.FuelPlanned;
            viewflightinformation.GWLand = entity.GWLand;
            viewflightinformation.GWTO = entity.GWTO;
            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);
            viewflightinformation.STDDay = ((DateTime)viewflightinformation.STD).Date;
            viewflightinformation.RampDate = entity.RampDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RampDate).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.AssignedRegisterID; //entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;
            viewflightinformation.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;
            viewflightinformation.IsActive = entity.IsActive;
            viewflightinformation.DateActive = entity.DateActive;
            viewflightinformation.FromAirportName = entity.FromAirportName;
            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            viewflightinformation.FromAirportCityId = entity.FromAirportCityId;
            viewflightinformation.ToAirportName = entity.ToAirportName;
            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            viewflightinformation.FromAirportCity = entity.FromAirportCity;
            viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.AssignedRegister; //entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;
            viewflightinformation.FlightStatusBgColor = entity.FlightStatusBgColor;
            viewflightinformation.FlightStatusColor = entity.FlightStatusColor;
            viewflightinformation.FlightStatusClass = entity.FlightStatusClass;
            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.taskID = entity.taskId;
            viewflightinformation.FlightGroupID = entity.FlightGroupID;
            viewflightinformation.PlanId = entity.PlanId;
            viewflightinformation.ManufacturerId = entity.ManufacturerId;
            viewflightinformation.Manufacturer = entity.Manufacturer;
            viewflightinformation.ToCountry = entity.ToCountry;
            viewflightinformation.ToSortName = entity.ToSortName;
            viewflightinformation.ToCity = entity.ToCity;
            viewflightinformation.FromSortName = entity.FromSortName;
            viewflightinformation.FromContry = entity.FromContry;
            viewflightinformation.FromCity = entity.FromCity;
            viewflightinformation.FromLatitude = entity.FromLatitude;
            viewflightinformation.FromLongitude = entity.FromLongitude;
            viewflightinformation.ToLatitude = entity.ToLatitude;
            viewflightinformation.ToLongitude = entity.ToLongitude;
            viewflightinformation.CargoCount = entity.CargoCount;
            viewflightinformation.BaggageWeight = entity.BaggageWeight;
            viewflightinformation.FuelUnitID = entity.FuelUnitID;
            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;
            viewflightinformation.TotalSeat = entity.TotalSeat;
            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;
            viewflightinformation.PaxOver = entity.PaxOver;
            viewflightinformation.TotalPax = entity.TotalPax;
            viewflightinformation.FuelUnit = entity.FuelUnit;
            viewflightinformation.DateStatus = entity.DateStatus == null ? null : (Nullable<DateTime>)((DateTime)entity.DateStatus).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusUserId = entity.FlightStatusUserId;

            viewflightinformation.CancelDate = entity.CancelDate == null ? null : (Nullable<DateTime>)((DateTime)entity.CancelDate).AddMinutes(tzoffset);
            viewflightinformation.CancelReasonId = entity.CancelReasonId;
            viewflightinformation.CancelReason = entity.CancelReason;
            viewflightinformation.CancelRemark = entity.CancelRemark;



            viewflightinformation.RampReasonId = entity.RampReasonId;
            viewflightinformation.RampReason = entity.RampReason;
            viewflightinformation.RampRemark = entity.RampRemark;

            viewflightinformation.RedirectDate = entity.RedirectDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RedirectDate).AddMinutes(tzoffset); ;
            viewflightinformation.RedirectReasonId = entity.RedirectReasonId;
            viewflightinformation.RedirectReason = entity.RedirectReason;
            viewflightinformation.RedirectRemark = entity.RedirectRemark;
            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;

            viewflightinformation.BaseIATA = entity.BaseIATA;
            viewflightinformation.BaseId = entity.BaseId;
            viewflightinformation.BaseName = entity.BaseName;

            viewflightinformation.FPFlightHH = entity.FPFlightHH;
            viewflightinformation.FPFlightMM = entity.FPFlightMM;
            viewflightinformation.Defuel = entity.Defuel;
            viewflightinformation.FPFuel = entity.FPFuel;

            viewflightinformation.SplitDuty = entity.SplitDuty;
            viewflightinformation.MaleFemalError = entity.MaleFemalError;
            viewflightinformation.MatchingListError = entity.MatchingListError;
            viewflightinformation.LinkedFlight = entity.LinkedFlight;
            viewflightinformation.LinkedFlightNumber = entity.LinkedFlightNumber;


        }

        public static ViewFlightInformationDto GetDto(Models.ViewFlightInformation entity, int tzoffset)
        {
            ViewModels.ViewFlightInformationDto viewflightinformation = new ViewFlightInformationDto();
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;
            viewflightinformation.BaggageCount = entity.BaggageCount;
            viewflightinformation.CargoUnitID = entity.CargoUnitID;
            viewflightinformation.CargoUnit = entity.CargoUnit;
            viewflightinformation.CargoWeight = entity.CargoWeight;
            viewflightinformation.PaxChild = entity.PaxChild;
            viewflightinformation.PaxInfant = entity.PaxInfant;
            viewflightinformation.PaxAdult = entity.PaxAdult;
            viewflightinformation.FuelArrival = entity.FuelArrival;
            viewflightinformation.FuelDeparture = entity.FuelDeparture;
            viewflightinformation.FuelActual = entity.FuelActual;
            viewflightinformation.FuelPlanned = entity.FuelPlanned;
            viewflightinformation.GWLand = entity.GWLand;
            viewflightinformation.GWTO = entity.GWTO;
            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;
            viewflightinformation.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;
            viewflightinformation.IsActive = entity.IsActive;
            viewflightinformation.DateActive = entity.DateActive;
            viewflightinformation.FromAirportName = entity.FromAirportName;
            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            // viewflightinformation.FromAirportCityId = entity.FromAirportCityId;
            viewflightinformation.ToAirportName = entity.ToAirportName;
            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            // viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            // viewflightinformation.FromAirportCity = entity.FromAirportCity;
            // viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;
            viewflightinformation.FlightStatusBgColor = entity.FlightStatusBgColor;
            viewflightinformation.FlightStatusColor = entity.FlightStatusColor;
            viewflightinformation.FlightStatusClass = entity.FlightStatusClass;
            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.FlightGroupID = entity.FlightGroupID;
            viewflightinformation.PlanId = entity.PlanId;
            viewflightinformation.ManufacturerId = entity.ManufacturerId;
            viewflightinformation.Manufacturer = entity.Manufacturer;
            //viewflightinformation.ToCountry = entity.ToCountry;
            //viewflightinformation.ToSortName = entity.ToSortName;
            //viewflightinformation.ToCity = entity.ToCity;
            viewflightinformation.FromSortName = entity.FromSortName;
            viewflightinformation.FromContry = entity.FromContry;
            //viewflightinformation.FromCity = entity.FromCity;
            viewflightinformation.FromLatitude = entity.FromLatitude;
            viewflightinformation.FromLongitude = entity.FromLongitude;
            viewflightinformation.ToLatitude = entity.ToLatitude;
            viewflightinformation.ToLongitude = entity.ToLongitude;
            viewflightinformation.CargoCount = entity.CargoCount;
            viewflightinformation.BaggageWeight = entity.BaggageWeight;
            viewflightinformation.FuelUnitID = entity.FuelUnitID;
            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;
            viewflightinformation.TotalSeat = entity.TotalSeat;
            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;
            viewflightinformation.PaxOver = entity.PaxOver;
            viewflightinformation.TotalPax = entity.TotalPax;
            viewflightinformation.FuelUnit = entity.FuelUnit;
            viewflightinformation.DateStatus = entity.DateStatus == null ? null : (Nullable<DateTime>)((DateTime)entity.DateStatus).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusUserId = entity.FlightStatusUserId;
            viewflightinformation.CancelDate = entity.CancelDate;
            viewflightinformation.CancelReasonId = entity.CancelReasonId;
            viewflightinformation.CancelReason = entity.CancelReason;
            viewflightinformation.CancelRemark = entity.CancelRemark;



            viewflightinformation.RampDate = entity.RampDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RampDate).AddMinutes(tzoffset);
            viewflightinformation.RampReasonId = entity.RampReasonId;
            viewflightinformation.RampReason = entity.RampReason;
            viewflightinformation.RampRemark = entity.RampRemark;

            viewflightinformation.RedirectDate = entity.RedirectDate;
            viewflightinformation.RedirectReasonId = entity.RedirectReasonId;
            viewflightinformation.RedirectReason = entity.RedirectReason;
            viewflightinformation.RedirectRemark = entity.RedirectRemark;
            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;

            return viewflightinformation;
        }
    }


    public class ViewFlightsGanttDto
    {
        public int ID { get; set; }
        public string ResKey { get; set; }
        public DateTime? DutyStartLocal { get; set; }
        public DateTime? DutyEndLocal { get; set; }
        public string ResTitle { get; set; }
        public int Id { get; set; }
        public bool IsBox { get; set; }
        public int? Duty { get; set; }
        public double? MaxFDPExtended { get; set; }



        public int IsDutyOver { get; set; }
        public int WOCLError { get; set; }
        public int? Flight { get; set; }
        public bool HasCrew { get; set; }
        public bool HasCrewProblem { get; set; }
        public bool ExtendedBySplitDuty { get; set; }
        // public bool SplitDuty { get; set; }

        public bool AllCrewAssigned { get; set; }
        public int? BoxId { get; set; }
        public string Flights { get; set; }
        public int? CalendarId { get; set; }
        public DateTime? Date { get; set; }
        public List<ViewFlightInformationDto> BoxItems = new List<ViewFlightInformationDto>();
        public int taskID { get; set; }
        public int? FlightPlanId { get; set; }
        public int? BaggageCount { get; set; }
        public int? CargoUnitID { get; set; }
        public string CargoUnit { get; set; }
        public string FuelUnit { get; set; }
        public int? CargoWeight { get; set; }
        public int? PaxChild { get; set; }
        public int? PaxInfant { get; set; }
        public int? FlightStatusUserId { get; set; }
        public int? PaxAdult { get; set; }
        public int? NightTime { get; set; }
        public int? TotalPax { get; set; }
        public int? PaxOver { get; set; }
        public decimal? FuelArrival { get; set; }
        public decimal? FuelDeparture { get; set; }
        public decimal? FuelActual { get; set; }
        public decimal? FuelPlanned { get; set; }
        public decimal? GWLand { get; set; }
        public decimal? GWTO { get; set; }
        public byte? BlockM { get; set; }
        public int? BlockH { get; set; }
        public int? FlightH { get; set; }
        public byte? FlightM { get; set; }
        public DateTime? ChocksIn { get; set; }
        public DateTime? DateStatus { get; set; }
        public DateTime? Landing { get; set; }
        public DateTime? Takeoff { get; set; }
        public DateTime? ChocksOut { get; set; }
        public DateTime? STD { get; set; }
        public DateTime? STA { get; set; }
        public DateTime STDDay { get; set; }
        public int FlightStatusID { get; set; }
        public int? RegisterID { get; set; }
        public int? FlightTypeID { get; set; }
        public int? TypeId { get; set; }
        public int? AirlineOperatorsID { get; set; }
        public string FlightNumber { get; set; }
        public int? FromAirport { get; set; }
        public int? ToAirport { get; set; }
        public DateTime? STAPlanned { get; set; }
        public DateTime? STDPlanned { get; set; }
        public int? FlightHPlanned { get; set; }
        public int? FlightMPlanned { get; set; }
        public string FlightPlan { get; set; }
        public int? CustomerId { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? DateActive { get; set; }
        public string FromAirportName { get; set; }
        public string FromAirportIATA { get; set; }
        public int? FromAirportCityId { get; set; }
        public string ToAirportName { get; set; }
        public string ToAirportIATA { get; set; }
        public int? ToAirportCityId { get; set; }
        public string FromAirportCity { get; set; }
        public string ToAirportCity { get; set; }
        public string AircraftType { get; set; }
        public string Register { get; set; }
        public int? MSN { get; set; }
        public string FlightStatus { get; set; }
        public string FlightStatusBgColor { get; set; }
        public string FlightStatusColor { get; set; }
        public string FlightStatusClass { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string notes { get; set; }
        public int status { get; set; }
        public int progress { get; set; }
        public string taskName { get; set; }
        public DateTime? startDate { get; set; }
        public decimal? duration { get; set; }
        public int taskId { get; set; }
        public int? FlightGroupID { get; set; }
        public int? PlanId { get; set; }
        public int? ManufacturerId { get; set; }
        public string Manufacturer { get; set; }
        public string ToCountry { get; set; }
        public string ToSortName { get; set; }
        public string ToCity { get; set; }
        public string FromSortName { get; set; }
        public string FromContry { get; set; }
        public string FromCity { get; set; }
        public double? FromLatitude { get; set; }
        public double? FromLongitude { get; set; }
        public double? ToLatitude { get; set; }
        public double? ToLongitude { get; set; }
        public int? CargoCount { get; set; }
        public int? BaggageWeight { get; set; }
        public int? FuelUnitID { get; set; }
        public string ArrivalRemark { get; set; }
        public string DepartureRemark { get; set; }
        public int? TotalSeat { get; set; }
        public int? EstimatedDelay { get; set; }
        public int? CancelReasonId { get; set; }
        public string CancelReason { get; set; }
        public string CancelRemark { get; set; }
        public DateTime? CancelDate { get; set; }

        public int? RedirectReasonId { get; set; }
        public string RedirectReason { get; set; }
        public string RedirectRemark { get; set; }
        public DateTime? RedirectDate { get; set; }
        public int? RampReasonId { get; set; }
        public string RampReason { get; set; }
        public string RampRemark { get; set; }
        public DateTime? RampDate { get; set; }

        public int? OToAirportId { get; set; }
        public string OToAirportIATA { get; set; }
        public DateTime? OSTA { get; set; }
        public List<int> resourceId { get; set; }

        public int? BaseId { get; set; }
        public string BaseIATA { get; set; }

        public string BaseName { get; set; }

        public decimal? Defuel { get; set; }
        public decimal? FPFuel { get; set; }
        public bool? SplitDuty { get; set; }
        public bool? IsPositioning { get; set; }
        public int? FPFlightHH { get; set; }
        public int? FPFlightMM { get; set; }

        public int MaleFemalError { get; set; }
        public int? MatchingListError { get; set; }
        public int? LinkedFlight { get; set; }
        public string LinkedFlightNumber { get; set; }
        public decimal? UsedFuel { get; set; }
        public int? JLBLHH { get; set; }
        public int? JLBLMM { get; set; }
        public int? PFLR { get; set; }
        public int? OTypeId { get; set; }

        public int? ChrAdult { get; set; }
        public int? ChrChild { get; set; }
        public int? ChrInfant { get; set; }
        public int? ChrCapacity { get; set; }

        public string ChrCode { get; set; }
        public string ChrTitle { get; set; }


        public int? DefaultChrId { get; set; }
        public string OAircraftType { get; set; }
        public static void Fill(Models.ViewFlightsGantt entity, ViewModels.ViewFlightsGanttDto viewflightinformation)
        {
            entity.ID = viewflightinformation.ID;

            entity.FlightPlanId = viewflightinformation.FlightPlanId;
            entity.BaggageCount = viewflightinformation.BaggageCount;
            entity.CargoUnitID = viewflightinformation.CargoUnitID;
            entity.CargoUnit = viewflightinformation.CargoUnit;
            entity.CargoWeight = viewflightinformation.CargoWeight;
            entity.PaxChild = viewflightinformation.PaxChild;
            entity.PaxInfant = viewflightinformation.PaxInfant;
            entity.PaxAdult = viewflightinformation.PaxAdult;
            entity.FuelArrival = viewflightinformation.FuelArrival;
            entity.FuelDeparture = viewflightinformation.FuelDeparture;
            entity.FuelActual = viewflightinformation.FuelActual;
            entity.FuelPlanned = viewflightinformation.FuelPlanned;
            entity.GWLand = viewflightinformation.GWLand;
            entity.GWTO = viewflightinformation.GWTO;
            entity.BlockM = viewflightinformation.BlockM;
            entity.BlockH = viewflightinformation.BlockH;
            entity.FlightH = viewflightinformation.FlightH;
            entity.FlightM = viewflightinformation.FlightM;
            entity.ChocksIn = viewflightinformation.ChocksIn;
            entity.Landing = viewflightinformation.Landing;
            entity.Takeoff = viewflightinformation.Takeoff;
            entity.ChocksOut = viewflightinformation.ChocksOut;
            entity.STD = viewflightinformation.STD;
            entity.STA = viewflightinformation.STA;
            entity.FlightStatusID = viewflightinformation.FlightStatusID;
            entity.RegisterID = viewflightinformation.RegisterID;
            entity.FlightTypeID = viewflightinformation.FlightTypeID ?? 0;
            entity.TypeId = (int)viewflightinformation.TypeId;
            entity.AirlineOperatorsID = viewflightinformation.AirlineOperatorsID;
            entity.FlightNumber = viewflightinformation.FlightNumber;
            entity.FromAirport = viewflightinformation.FromAirport;
            entity.ToAirport = viewflightinformation.ToAirport;
            entity.STAPlanned = viewflightinformation.STAPlanned;
            entity.STDPlanned = viewflightinformation.STDPlanned;
            entity.FlightHPlanned = viewflightinformation.FlightHPlanned;
            entity.FlightMPlanned = viewflightinformation.FlightMPlanned;
            entity.FlightPlan = viewflightinformation.FlightPlan;
            entity.CustomerId = viewflightinformation.CustomerId;
            entity.IsActive = viewflightinformation.IsActive;
            entity.DateActive = viewflightinformation.DateActive;
            entity.FromAirportName = viewflightinformation.FromAirportName;
            entity.FromAirportIATA = viewflightinformation.FromAirportIATA;
            //entity.FromAirportCityId = viewflightinformation.FromAirportCityId;
            entity.ToAirportName = viewflightinformation.ToAirportName;
            entity.ToAirportIATA = viewflightinformation.ToAirportIATA;
            //  entity.ToAirportCityId = viewflightinformation.ToAirportCityId;
            //  entity.FromAirportCity = viewflightinformation.FromAirportCity;
            //  entity.ToAirportCity = viewflightinformation.ToAirportCity;
            entity.AircraftType = viewflightinformation.AircraftType;
            entity.Register = viewflightinformation.Register;
            entity.MSN = viewflightinformation.MSN;
            entity.FlightStatus = viewflightinformation.FlightStatus;
            entity.FlightStatusBgColor = viewflightinformation.FlightStatusBgColor;
            entity.FlightStatusColor = viewflightinformation.FlightStatusColor;
            entity.FlightStatusClass = viewflightinformation.FlightStatusClass;
            entity.from = viewflightinformation.from;
            entity.to = viewflightinformation.to;
            entity.notes = viewflightinformation.notes;
            entity.status = viewflightinformation.status;
            entity.progress = viewflightinformation.progress;
            entity.taskName = viewflightinformation.taskName;
            entity.startDate = viewflightinformation.startDate;
            entity.duration = viewflightinformation.duration;
            entity.taskId = viewflightinformation.taskId;
            entity.FlightGroupID = viewflightinformation.FlightGroupID;
            entity.PlanId = viewflightinformation.PlanId==null?1:1;
            entity.ManufacturerId = viewflightinformation.ManufacturerId;
            entity.Manufacturer = viewflightinformation.Manufacturer;
            // entity.ToCountry = viewflightinformation.ToCountry;
            // entity.ToSortName = viewflightinformation.ToSortName;
            // entity.ToCity = viewflightinformation.ToCity;
            entity.FromSortName = viewflightinformation.FromSortName;
            entity.FromContry = viewflightinformation.FromContry;
            //  entity.FromCity = viewflightinformation.FromCity;
            entity.FromLatitude = viewflightinformation.FromLatitude;
            entity.FromLongitude = viewflightinformation.FromLongitude;
            entity.ToLatitude = viewflightinformation.ToLatitude;
            entity.ToLongitude = viewflightinformation.ToLongitude;
            entity.CargoCount = viewflightinformation.CargoCount;
            entity.BaggageWeight = viewflightinformation.BaggageWeight;
            entity.FuelUnitID = viewflightinformation.FuelUnitID;
            entity.ArrivalRemark = viewflightinformation.ArrivalRemark;
            entity.DepartureRemark = viewflightinformation.DepartureRemark;
            entity.TotalSeat = viewflightinformation.TotalSeat;
            entity.EstimatedDelay = viewflightinformation.EstimatedDelay ?? 0;
            entity.PaxOver = viewflightinformation.PaxOver ?? 0;
            entity.TotalPax = viewflightinformation.TotalPax;
            entity.FuelUnit = viewflightinformation.FuelUnit;
            entity.DateStatus = viewflightinformation.DateStatus;
            entity.FlightStatusUserId = viewflightinformation.FlightStatusUserId;
            entity.CancelDate = viewflightinformation.CancelDate;
            entity.CancelReasonId = viewflightinformation.CancelReasonId;
            entity.CancelReason = viewflightinformation.CancelReason;
            entity.CancelRemark = viewflightinformation.CancelRemark;
            entity.RedirectDate = viewflightinformation.RedirectDate;
            entity.RedirectReasonId = viewflightinformation.RedirectReasonId;
            entity.RedirectReason = viewflightinformation.RedirectReason;
            entity.RedirectRemark = viewflightinformation.RedirectRemark;
            entity.OSTA = viewflightinformation.OSTA;
            entity.OToAirportIATA = viewflightinformation.OToAirportIATA;
            entity.OToAirportId = viewflightinformation.OToAirportId;

            entity.RampDate = viewflightinformation.RampDate;
            entity.RampReasonId = viewflightinformation.RampReasonId;
            entity.RampReason = viewflightinformation.RampReason;
            entity.RampRemark = viewflightinformation.RampRemark;

            entity.FPFlightHH = viewflightinformation.FPFlightHH;
            entity.FPFlightMM = viewflightinformation.FPFlightMM;
            entity.Defuel = viewflightinformation.Defuel;
            entity.FPFuel = viewflightinformation.FPFuel;





        }
        public static void FillDto(Models.ViewFlightsGantt entity, ViewModels.ViewFlightsGanttDto viewflightinformation, int tzoffset, int? utc = 0)
        {

            tzoffset = Helper.GetTimeOffset((DateTime)entity.STD);
            var tzoffset2 = Helper.GetTimeOffset((DateTime)entity.STD);
            var tzoffset3 = TimeZoneInfo.Local.GetUtcOffset((DateTime)entity.STD).TotalMinutes;
            if (utc == 1)
            { tzoffset = 0; tzoffset3 = 0; }
            viewflightinformation.Date = entity.Date;
            viewflightinformation.OTypeId = entity.OTypeId;
            viewflightinformation.OAircraftType = entity.OAircraftType;
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.Id = entity.ID;
            viewflightinformation.IsBox = false;
            viewflightinformation.HasCrew = false;
            viewflightinformation.BoxId = entity.BoxId;
            viewflightinformation.CalendarId = entity.CalendarId;
            viewflightinformation.HasCrewProblem = false;
            viewflightinformation.AllCrewAssigned = false;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;
            viewflightinformation.BaggageCount = entity.BaggageCount;
            viewflightinformation.CargoUnitID = entity.CargoUnitID;
            viewflightinformation.CargoUnit = entity.CargoUnit;
            viewflightinformation.CargoWeight = entity.CargoWeight;
            viewflightinformation.PaxChild = entity.PaxChild;
            viewflightinformation.PaxInfant = entity.PaxInfant;
            viewflightinformation.PaxAdult = entity.PaxAdult;
            viewflightinformation.FuelArrival = entity.FuelArrival;
            viewflightinformation.FuelDeparture = entity.FuelDeparture;
            viewflightinformation.FuelActual = entity.FuelActual;
            viewflightinformation.FuelPlanned = entity.FuelPlanned;
            viewflightinformation.GWLand = entity.GWLand;
            viewflightinformation.GWTO = entity.GWTO;
            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            if (entity.FromAirportIATA == "NJF" || entity.FromAirportIATA == "BSR")
                viewflightinformation.GWLand = 180;
            else
                viewflightinformation.GWLand = tzoffset2;

            if (entity.ToAirportIATA == "NJF" || entity.ToAirportIATA == "BSR")
                viewflightinformation.GWTO = 180;
            else
                viewflightinformation.GWTO = tzoffset2;


            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset3);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset3); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset3);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset3);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset3);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset3);
            viewflightinformation.RampDate = entity.RampDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RampDate).AddMinutes(tzoffset3);
            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;
            viewflightinformation.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset3);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset3);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;
            viewflightinformation.IsActive = entity.IsActive;
            viewflightinformation.DateActive = entity.DateActive;
            viewflightinformation.FromAirportName = entity.FromAirportName;
            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            // viewflightinformation.FromAirportCityId = entity.FromAirportCityId;
            viewflightinformation.ToAirportName = entity.ToAirportName;
            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            //viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            //viewflightinformation.FromAirportCity = entity.FromAirportCity;
            // viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;
            viewflightinformation.FlightStatusBgColor = entity.FlightStatusBgColor;
            viewflightinformation.FlightStatusColor = entity.FlightStatusColor;
            viewflightinformation.FlightStatusClass = entity.FlightStatusClass;
            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset3);
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.taskID = entity.taskId;
            viewflightinformation.FlightGroupID = entity.FlightGroupID;
            viewflightinformation.PlanId = entity.PlanId;
            viewflightinformation.ManufacturerId = entity.ManufacturerId;
            viewflightinformation.Manufacturer = entity.Manufacturer;
            //viewflightinformation.ToCountry = entity.ToCountry;
            //viewflightinformation.ToSortName = entity.ToSortName;
            //viewflightinformation.ToCity = entity.ToCity;
            viewflightinformation.FromSortName = entity.FromSortName;
            viewflightinformation.FromContry = entity.FromContry;
            //viewflightinformation.FromCity = entity.FromCity;
            viewflightinformation.FromLatitude = entity.FromLatitude;
            viewflightinformation.FromLongitude = entity.FromLongitude;
            viewflightinformation.ToLatitude = entity.ToLatitude;
            viewflightinformation.ToLongitude = entity.ToLongitude;
            viewflightinformation.CargoCount = entity.CargoCount;
            viewflightinformation.BaggageWeight = entity.BaggageWeight;
            viewflightinformation.FuelUnitID = entity.FuelUnitID;
            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;
            viewflightinformation.TotalSeat = entity.TotalSeat;
            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;
            viewflightinformation.PaxOver = entity.PaxOver;
            viewflightinformation.TotalPax = entity.TotalPax;
            viewflightinformation.NightTime = entity.NightTime;


            viewflightinformation.FuelUnit = entity.FuelUnit;
            viewflightinformation.DateStatus = entity.DateStatus == null ? null : (Nullable<DateTime>)((DateTime)entity.DateStatus).AddMinutes(tzoffset3);
            viewflightinformation.FlightStatusUserId = entity.FlightStatusUserId;

            viewflightinformation.CancelDate = entity.CancelDate == null ? null : (Nullable<DateTime>)((DateTime)entity.CancelDate).AddMinutes(tzoffset3);
            viewflightinformation.CancelReasonId = entity.CancelReasonId;
            viewflightinformation.CancelReason = entity.CancelReason;
            viewflightinformation.CancelRemark = entity.CancelRemark;



            viewflightinformation.RampReasonId = entity.RampReasonId;
            viewflightinformation.RampReason = entity.RampReason;
            viewflightinformation.RampRemark = entity.RampRemark;

            viewflightinformation.RedirectDate = entity.RedirectDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RedirectDate).AddMinutes(tzoffset3); ;
            viewflightinformation.RedirectReasonId = entity.RedirectReasonId;
            viewflightinformation.RedirectReason = entity.RedirectReason;
            viewflightinformation.RedirectRemark = entity.RedirectRemark;
            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;

            viewflightinformation.BaseIATA = entity.BaseIATA;
            viewflightinformation.BaseId = entity.BaseId;
            viewflightinformation.BaseName = entity.BaseName;

            viewflightinformation.FPFlightHH = entity.FPFlightHH;
            viewflightinformation.FPFlightMM = entity.FPFlightMM;
            viewflightinformation.Defuel = entity.Defuel;
            viewflightinformation.FPFuel = entity.FPFuel;

            viewflightinformation.SplitDuty = entity.SplitDuty;
            viewflightinformation.MaleFemalError = entity.MaleFemalError == null ? 0 : (int)entity.MaleFemalError;
            viewflightinformation.MatchingListError = entity.MatchingListError == null ? 0 : (int)entity.MatchingListError;
            viewflightinformation.LinkedFlight = entity.LinkedFlight;
            viewflightinformation.LinkedFlightNumber = entity.LinkedFlightNumber;
            viewflightinformation.UsedFuel = entity.UsedFuel;
            viewflightinformation.JLBLHH = entity.JLBLHH;
            viewflightinformation.JLBLMM = entity.JLBLMM;
            viewflightinformation.PFLR = entity.PFLR;

            viewflightinformation.ChrAdult = entity.ChrAdult;
            viewflightinformation.ChrChild = entity.ChrChild;
            viewflightinformation.ChrInfant = entity.ChrInfant;
            viewflightinformation.ChrCapacity = entity.ChrCapacity;
            viewflightinformation.ChrCode = entity.ChrCode;
            viewflightinformation.ChrTitle = entity.ChrTitle;

            viewflightinformation.DefaultChrId = entity.DefaultChrId;


        }
        public static void FillDto(Models.ViewLegTime entity, ViewModels.ViewFlightInformationDto viewflightinformation, int tzoffset)
        {
            viewflightinformation.Date = entity.Date;
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.Id = entity.ID;
            viewflightinformation.IsBox = false;
            viewflightinformation.HasCrew = false;

            viewflightinformation.HasCrewProblem = false;
            viewflightinformation.AllCrewAssigned = false;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;

            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);

            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;

            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;

            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            // viewflightinformation.FromAirportCityId = entity.FromAirportCityId;

            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            //viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            //viewflightinformation.FromAirportCity = entity.FromAirportCity;
            // viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;

            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = (int)entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.taskID = entity.taskId;


            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);



            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;

            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;





            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;



            viewflightinformation.FPFlightHH = entity.FPFlightHH;
            viewflightinformation.FPFlightMM = entity.FPFlightMM;





        }
        public static void FillDto(Models.ViewPlanFlight entity, ViewModels.ViewFlightInformationDto viewflightinformation, int tzoffset)
        {
            viewflightinformation.Date = entity.Date;
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.Id = entity.ID;
            viewflightinformation.IsBox = false;
            viewflightinformation.HasCrew = false;
            viewflightinformation.BoxId = entity.BoxId;
            viewflightinformation.CalendarId = entity.CalendarId;
            viewflightinformation.HasCrewProblem = false;
            viewflightinformation.AllCrewAssigned = false;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;
            viewflightinformation.BaggageCount = entity.BaggageCount;
            viewflightinformation.CargoUnitID = entity.CargoUnitID;
            viewflightinformation.CargoUnit = entity.CargoUnit;
            viewflightinformation.CargoWeight = entity.CargoWeight;
            viewflightinformation.PaxChild = entity.PaxChild;
            viewflightinformation.PaxInfant = entity.PaxInfant;
            viewflightinformation.PaxAdult = entity.PaxAdult;
            viewflightinformation.FuelArrival = entity.FuelArrival;
            viewflightinformation.FuelDeparture = entity.FuelDeparture;
            viewflightinformation.FuelActual = entity.FuelActual;
            viewflightinformation.FuelPlanned = entity.FuelPlanned;
            viewflightinformation.GWLand = entity.GWLand;
            viewflightinformation.GWTO = entity.GWTO;
            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);
            viewflightinformation.STDDay = ((DateTime)viewflightinformation.STD).Date;
            viewflightinformation.RampDate = entity.RampDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RampDate).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.AssignedRegisterID; //entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;
            viewflightinformation.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;
            viewflightinformation.IsActive = entity.IsActive;
            viewflightinformation.DateActive = entity.DateActive;
            viewflightinformation.FromAirportName = entity.FromAirportName;
            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            viewflightinformation.FromAirportCityId = entity.FromAirportCityId;
            viewflightinformation.ToAirportName = entity.ToAirportName;
            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            viewflightinformation.FromAirportCity = entity.FromAirportCity;
            viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.AssignedRegister; //entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;
            viewflightinformation.FlightStatusBgColor = entity.FlightStatusBgColor;
            viewflightinformation.FlightStatusColor = entity.FlightStatusColor;
            viewflightinformation.FlightStatusClass = entity.FlightStatusClass;
            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.taskID = entity.taskId;
            viewflightinformation.FlightGroupID = entity.FlightGroupID;
            viewflightinformation.PlanId = entity.PlanId;
            viewflightinformation.ManufacturerId = entity.ManufacturerId;
            viewflightinformation.Manufacturer = entity.Manufacturer;
            viewflightinformation.ToCountry = entity.ToCountry;
            viewflightinformation.ToSortName = entity.ToSortName;
            viewflightinformation.ToCity = entity.ToCity;
            viewflightinformation.FromSortName = entity.FromSortName;
            viewflightinformation.FromContry = entity.FromContry;
            viewflightinformation.FromCity = entity.FromCity;
            viewflightinformation.FromLatitude = entity.FromLatitude;
            viewflightinformation.FromLongitude = entity.FromLongitude;
            viewflightinformation.ToLatitude = entity.ToLatitude;
            viewflightinformation.ToLongitude = entity.ToLongitude;
            viewflightinformation.CargoCount = entity.CargoCount;
            viewflightinformation.BaggageWeight = entity.BaggageWeight;
            viewflightinformation.FuelUnitID = entity.FuelUnitID;
            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;
            viewflightinformation.TotalSeat = entity.TotalSeat;
            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;
            viewflightinformation.PaxOver = entity.PaxOver;
            viewflightinformation.TotalPax = entity.TotalPax;
            viewflightinformation.FuelUnit = entity.FuelUnit;
            viewflightinformation.DateStatus = entity.DateStatus == null ? null : (Nullable<DateTime>)((DateTime)entity.DateStatus).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusUserId = entity.FlightStatusUserId;

            viewflightinformation.CancelDate = entity.CancelDate == null ? null : (Nullable<DateTime>)((DateTime)entity.CancelDate).AddMinutes(tzoffset);
            viewflightinformation.CancelReasonId = entity.CancelReasonId;
            viewflightinformation.CancelReason = entity.CancelReason;
            viewflightinformation.CancelRemark = entity.CancelRemark;



            viewflightinformation.RampReasonId = entity.RampReasonId;
            viewflightinformation.RampReason = entity.RampReason;
            viewflightinformation.RampRemark = entity.RampRemark;

            viewflightinformation.RedirectDate = entity.RedirectDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RedirectDate).AddMinutes(tzoffset); ;
            viewflightinformation.RedirectReasonId = entity.RedirectReasonId;
            viewflightinformation.RedirectReason = entity.RedirectReason;
            viewflightinformation.RedirectRemark = entity.RedirectRemark;
            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;

            viewflightinformation.BaseIATA = entity.BaseIATA;
            viewflightinformation.BaseId = entity.BaseId;
            viewflightinformation.BaseName = entity.BaseName;

            viewflightinformation.FPFlightHH = entity.FPFlightHH;
            viewflightinformation.FPFlightMM = entity.FPFlightMM;
            viewflightinformation.Defuel = entity.Defuel;
            viewflightinformation.FPFuel = entity.FPFuel;

            viewflightinformation.SplitDuty = entity.SplitDuty;
            viewflightinformation.MaleFemalError = entity.MaleFemalError;
            viewflightinformation.MatchingListError = entity.MatchingListError;
            viewflightinformation.LinkedFlight = entity.LinkedFlight;
            viewflightinformation.LinkedFlightNumber = entity.LinkedFlightNumber;


        }

        public static ViewFlightsGanttDto GetDto(Models.ViewFlightsGantt entity, int tzoffset)
        {
            ViewModels.ViewFlightsGanttDto viewflightinformation = new ViewFlightsGanttDto();
            viewflightinformation.resourceId = new List<int>();
            viewflightinformation.ID = entity.ID;
            viewflightinformation.FlightPlanId = entity.FlightPlanId;
            viewflightinformation.BaggageCount = entity.BaggageCount;
            viewflightinformation.CargoUnitID = entity.CargoUnitID;
            viewflightinformation.CargoUnit = entity.CargoUnit;
            viewflightinformation.CargoWeight = entity.CargoWeight;
            viewflightinformation.PaxChild = entity.PaxChild;
            viewflightinformation.PaxInfant = entity.PaxInfant;
            viewflightinformation.PaxAdult = entity.PaxAdult;
            viewflightinformation.FuelArrival = entity.FuelArrival;
            viewflightinformation.FuelDeparture = entity.FuelDeparture;
            viewflightinformation.FuelActual = entity.FuelActual;
            viewflightinformation.FuelPlanned = entity.FuelPlanned;
            viewflightinformation.GWLand = entity.GWLand;
            viewflightinformation.GWTO = entity.GWTO;
            viewflightinformation.BlockM = entity.BlockM;
            viewflightinformation.BlockH = entity.BlockH;
            viewflightinformation.FlightH = entity.FlightH;
            viewflightinformation.FlightM = entity.FlightM;
            viewflightinformation.ChocksIn = entity.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksIn).AddMinutes(tzoffset);
            viewflightinformation.Landing = entity.Landing == null ? null : (Nullable<DateTime>)((DateTime)entity.Landing).AddMinutes(tzoffset); ;
            viewflightinformation.Takeoff = entity.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)entity.Takeoff).AddMinutes(tzoffset);
            viewflightinformation.ChocksOut = entity.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)entity.ChocksOut).AddMinutes(tzoffset);
            viewflightinformation.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightinformation.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusID = (int)entity.FlightStatusID;
            viewflightinformation.RegisterID = entity.RegisterID;
            viewflightinformation.FlightTypeID = entity.FlightTypeID;
            viewflightinformation.TypeId = entity.TypeId;
            viewflightinformation.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightinformation.FlightNumber = entity.FlightNumber;
            viewflightinformation.FromAirport = entity.FromAirport;
            viewflightinformation.ToAirport = entity.ToAirport;
            viewflightinformation.STAPlanned = entity.STAPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STAPlanned).AddMinutes(tzoffset);
            viewflightinformation.STDPlanned = entity.STDPlanned == null ? null : (Nullable<DateTime>)((DateTime)entity.STDPlanned).AddMinutes(tzoffset);
            viewflightinformation.FlightHPlanned = entity.FlightHPlanned;
            viewflightinformation.FlightMPlanned = entity.FlightMPlanned;
            viewflightinformation.FlightPlan = entity.FlightPlan;
            viewflightinformation.CustomerId = entity.CustomerId;
            viewflightinformation.IsActive = entity.IsActive;
            viewflightinformation.DateActive = entity.DateActive;
            viewflightinformation.FromAirportName = entity.FromAirportName;
            viewflightinformation.FromAirportIATA = entity.FromAirportIATA;
            // viewflightinformation.FromAirportCityId = entity.FromAirportCityId;
            viewflightinformation.ToAirportName = entity.ToAirportName;
            viewflightinformation.ToAirportIATA = entity.ToAirportIATA;
            // viewflightinformation.ToAirportCityId = entity.ToAirportCityId;
            // viewflightinformation.FromAirportCity = entity.FromAirportCity;
            // viewflightinformation.ToAirportCity = entity.ToAirportCity;
            viewflightinformation.AircraftType = entity.AircraftType;
            viewflightinformation.Register = entity.Register;
            viewflightinformation.MSN = entity.MSN;
            viewflightinformation.FlightStatus = entity.FlightStatus;
            viewflightinformation.FlightStatusBgColor = entity.FlightStatusBgColor;
            viewflightinformation.FlightStatusColor = entity.FlightStatusColor;
            viewflightinformation.FlightStatusClass = entity.FlightStatusClass;
            viewflightinformation.from = entity.from;
            viewflightinformation.to = entity.to;
            viewflightinformation.notes = entity.notes;
            viewflightinformation.status = entity.status;
            viewflightinformation.progress = entity.progress;
            viewflightinformation.taskName = entity.taskName;
            viewflightinformation.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);
            viewflightinformation.duration = entity.duration;
            viewflightinformation.taskId = entity.taskId;
            viewflightinformation.FlightGroupID = entity.FlightGroupID;
            viewflightinformation.PlanId = entity.PlanId;
            viewflightinformation.ManufacturerId = entity.ManufacturerId;
            viewflightinformation.Manufacturer = entity.Manufacturer;
            //viewflightinformation.ToCountry = entity.ToCountry;
            //viewflightinformation.ToSortName = entity.ToSortName;
            //viewflightinformation.ToCity = entity.ToCity;
            viewflightinformation.FromSortName = entity.FromSortName;
            viewflightinformation.FromContry = entity.FromContry;
            //viewflightinformation.FromCity = entity.FromCity;
            viewflightinformation.FromLatitude = entity.FromLatitude;
            viewflightinformation.FromLongitude = entity.FromLongitude;
            viewflightinformation.ToLatitude = entity.ToLatitude;
            viewflightinformation.ToLongitude = entity.ToLongitude;
            viewflightinformation.CargoCount = entity.CargoCount;
            viewflightinformation.BaggageWeight = entity.BaggageWeight;
            viewflightinformation.FuelUnitID = entity.FuelUnitID;
            viewflightinformation.ArrivalRemark = entity.ArrivalRemark;
            viewflightinformation.DepartureRemark = entity.DepartureRemark;
            viewflightinformation.TotalSeat = entity.TotalSeat;
            viewflightinformation.EstimatedDelay = entity.EstimatedDelay;
            viewflightinformation.PaxOver = entity.PaxOver;
            viewflightinformation.TotalPax = entity.TotalPax;
            viewflightinformation.FuelUnit = entity.FuelUnit;
            viewflightinformation.DateStatus = entity.DateStatus == null ? null : (Nullable<DateTime>)((DateTime)entity.DateStatus).AddMinutes(tzoffset);
            viewflightinformation.FlightStatusUserId = entity.FlightStatusUserId;
            viewflightinformation.CancelDate = entity.CancelDate;
            viewflightinformation.CancelReasonId = entity.CancelReasonId;
            viewflightinformation.CancelReason = entity.CancelReason;
            viewflightinformation.CancelRemark = entity.CancelRemark;



            viewflightinformation.RampDate = entity.RampDate == null ? null : (Nullable<DateTime>)((DateTime)entity.RampDate).AddMinutes(tzoffset);
            viewflightinformation.RampReasonId = entity.RampReasonId;
            viewflightinformation.RampReason = entity.RampReason;
            viewflightinformation.RampRemark = entity.RampRemark;

            viewflightinformation.RedirectDate = entity.RedirectDate;
            viewflightinformation.RedirectReasonId = entity.RedirectReasonId;
            viewflightinformation.RedirectReason = entity.RedirectReason;
            viewflightinformation.RedirectRemark = entity.RedirectRemark;
            viewflightinformation.OSTA = entity.OSTA;
            viewflightinformation.OToAirportIATA = entity.OToAirportIATA;
            viewflightinformation.OToAirportId = entity.OToAirportId;

            return viewflightinformation;
        }
    }


    public class CPFlight
    {
        public int ID { get; set; }
        public int? TypeID { get; set; }
        //public int? RegisterID { get; set; }
        //public int? FlightTypeID { get; set; }
        public int? FlightStatusID { get; set; }
        public int? AirlineOperatorsID { get; set; }
        // public int? FlightGroupID { get; set; }
        public string FlightNumber { get; set; }
        public int? FromAirportId { get; set; }
        public int? ToAirportId { get; set; }
        public DateTime? STD { get; set; }
        public DateTime? STA { get; set; }
        public DateTime? ChocksOut { get; set; }
        public DateTime? Takeoff { get; set; }
        public DateTime? Landing { get; set; }
        public DateTime? ChocksIn { get; set; }
        //public int? FlightH { get; set; }
        //public byte? FlightM { get; set; }
        // public int? BlockH { get; set; }
        //public byte? BlockM { get; set; }
        //public decimal? GWTO { get; set; }
        // public decimal? GWLand { get; set; }
        // public decimal? FuelPlanned { get; set; }
        //public decimal? FuelActual { get; set; }
        // public decimal? FuelDeparture { get; set; }
        // public decimal? FuelArrival { get; set; }
        // public int? PaxAdult { get; set; }
        //public int? PaxInfant { get; set; }
        //public int? PaxChild { get; set; }
        // public int? CargoWeight { get; set; }
        // public int? CargoUnitID { get; set; }
        //public int? BaggageCount { get; set; }
        public int? CustomerId { get; set; }
        //public int? FlightPlanId { get; set; }
        public DateTime? DateCreate { get; set; }
        // public int? CargoCount { get; set; }
        // public int? BaggageWeight { get; set; }
        // public int? FuelUnitID { get; set; }
        //  public string ArrivalRemark { get; set; }
        // public string DepartureRemark { get; set; }
        // public int? EstimatedDelay { get; set; }
        // public int? FlightStatusUserId { get; set; }

        //public int? LinkedFlight { get; set; }
        // public int? LinkedReason { get; set; }
        // public string LinkedRemark { get; set; }
        public Nullable<int> JLBLHH { get; set; }
        public Nullable<int> JLBLMM { get; set; }
        public Nullable<int> PFLR { get; set; }
        public Nullable<int> CPCrewId { get; set; }
        public string CPRegister { get; set; }
        public Nullable<int> CPPositionId { get; set; }
        public Nullable<int> CPFlightTypeId { get; set; }
        public Nullable<int> CPFDPItemId { get; set; }
        public Nullable<bool> CPDH { get; set; }
    }

    public class ViewPlanItemDto
    {

        public int Id { get; set; }
        public int taskId { get; set; }
        public Nullable<System.DateTime> DateFrom { get; set; }
        public string Day { get; set; }
        public int FromAirport { get; set; }
        public int ToAirport { get; set; }
        public System.DateTime Dep { get; set; }
        public System.DateTime startDateUTC { get; set; }
        public Nullable<System.DateTime> startDate { get; set; }
        public System.DateTime Arr { get; set; }
        public Nullable<System.DateTime> STD { get; set; }
        public Nullable<System.DateTime> STA { get; set; }
        public int TypeId { get; set; }
        public string AircraftType { get; set; }
        public Nullable<System.DateTime> DateTo { get; set; }
        public string FlightNumber { get; set; }
        public string FromAirportIATA { get; set; }
        public string ToAirportIATA { get; set; }
        public int progress { get; set; }
        public Nullable<decimal> duration { get; set; }
        public int EstimatedDelay { get; set; }
        public int DelayOffBlock { get; set; }
        public int DelayTakeoff { get; set; }
        public int DelayOnBlock { get; set; }
        public int DelayLanding { get; set; }
        public int IsDelayOffBlock { get; set; }
        public int IsDelayTakeoff { get; set; }
        public int IsDelayOnBlock { get; set; }
        public int IsDelayLanding { get; set; }
        public int FlightStatusID { get; set; }
        public int status { get; set; }
        public List<decimal> resourceId { get; set; }
        public int FlightTypeID = 109;
        public string DateRangeTitle { get; set; }
        public int FlightPlanId { get; set; }
        public string Line { get; set; }

    }
    public class BaseSummary
    {
        public int? BaseId { get; set; }
        public string BaseIATA { get; set; }
        public string BaseName { get; set; }
        public int Total { get; set; }
        public int TakeOff { get; set; }
        public int Landing { get; set; }
        public int Canceled { get; set; }
        public int Redirected { get; set; }
        public int Diverted { get; set; }
        public int? TotalDelays { get; set; }
        public int? DepartedPax { get; set; }
        public int? ArrivedPax { get; set; }
    }
    public class ViewFlightPlanItemDto
    {
        public int Id { get; set; }
        public bool IsBox { get; set; }
        public bool HasCrew { get; set; }
        public bool HasCrewProblem { get; set; }
        public bool AllCrewAssigned { get; set; }
        public int? BoxId { get; set; }
        public List<ViewFlightPlanItemDto> BoxItems = new List<ViewFlightPlanItemDto>();
        public int taskId { get; set; }
        public int FlightPlanId { get; set; }
        public int? TypeId { get; set; }
        public int RegisterID { get; set; }
        public int? FlightTypeID { get; set; }
        public string FlightType { get; set; }
        public int? AirlineOperatorsID { get; set; }
        public string FlightNumber { get; set; }
        public int FromAirport { get; set; }
        public int ToAirport { get; set; }
        public DateTime? STA { get; set; }
        public DateTime? STD { get; set; }
        public int FlightH { get; set; }
        public int FlightM { get; set; }
        public string Unknown { get; set; }
        public string FlightPlan { get; set; }
        public int CustomerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DateActive { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string Customer { get; set; }
        public string FromAirportName { get; set; }
        public string FromAirportIATA { get; set; }
        public string from { get; set; }
        public int? FromAirportCityId { get; set; }
        public string ToAirportName { get; set; }
        public string ToAirportIATA { get; set; }
        public string to { get; set; }
        public int? ToAirportCityId { get; set; }
        public string notes { get; set; }
        public int status { get; set; }
        public int progress { get; set; }
        public decimal? duration { get; set; }
        public DateTime? startDate { get; set; }
        public string taskName { get; set; }
        public string FromAirportCity { get; set; }
        public string ToAirportCity { get; set; }
        public int? MSN { get; set; }
        public string Register { get; set; }
        public string AircraftType { get; set; }

        public string FlightStatus { get; set; }
        public int? RouteId { get; set; }

        public List<int> resourceId { get; set; }
        public static void Fill(Models.ViewFlightPlanItem entity, ViewModels.ViewFlightPlanItemDto viewflightplanitem)
        {
            entity.Id = viewflightplanitem.Id;
            entity.taskID = viewflightplanitem.taskId;
            entity.FlightPlanId = viewflightplanitem.FlightPlanId;
            entity.TypeId = viewflightplanitem.TypeId;
            entity.RegisterID = viewflightplanitem.RegisterID;
            entity.FlightTypeID = viewflightplanitem.FlightTypeID;
            entity.AirlineOperatorsID = viewflightplanitem.AirlineOperatorsID;
            entity.FlightNumber = viewflightplanitem.FlightNumber;
            entity.FromAirport = viewflightplanitem.FromAirport;
            entity.ToAirport = viewflightplanitem.ToAirport;
            entity.STA = viewflightplanitem.STA;
            entity.STD = viewflightplanitem.STD;
            entity.FlightH = viewflightplanitem.FlightH;
            entity.FlightM = viewflightplanitem.FlightM;
            entity.Unknown = viewflightplanitem.Unknown;
            entity.FlightPlan = viewflightplanitem.FlightPlan;
            entity.CustomerId = viewflightplanitem.CustomerId;
            entity.IsActive = viewflightplanitem.IsActive;
            entity.DateActive = viewflightplanitem.DateActive;
            entity.DateFrom = viewflightplanitem.DateFrom;
            entity.DateTo = viewflightplanitem.DateTo;
            entity.Customer = viewflightplanitem.Customer;
            entity.FromAirportName = viewflightplanitem.FromAirportName;
            entity.FromAirportIATA = viewflightplanitem.FromAirportIATA;
            entity.from = viewflightplanitem.from;
            entity.FromAirportCityId = viewflightplanitem.FromAirportCityId;
            entity.ToAirportName = viewflightplanitem.ToAirportName;
            entity.ToAirportIATA = viewflightplanitem.ToAirportIATA;
            entity.to = viewflightplanitem.to;
            entity.ToAirportCityId = viewflightplanitem.ToAirportCityId;
            entity.notes = viewflightplanitem.notes;
            entity.status = viewflightplanitem.status;
            entity.progress = viewflightplanitem.progress;
            entity.duration = viewflightplanitem.duration;
            entity.startDate = viewflightplanitem.startDate;
            entity.taskName = viewflightplanitem.taskName;
            entity.FromAirportCity = viewflightplanitem.FromAirportCity;
            entity.ToAirportCity = viewflightplanitem.ToAirportCity;
            entity.MSN = viewflightplanitem.MSN;
            entity.Register = viewflightplanitem.Register;
            entity.AircraftType = viewflightplanitem.AircraftType;
            entity.FlightStatus = viewflightplanitem.FlightStatus;
            entity.RouteId = viewflightplanitem.RouteId;
            entity.FlightType = viewflightplanitem.FlightType;
        }
        public static void FillDto(Models.ViewFlightPlanItem entity, ViewModels.ViewFlightPlanItemDto viewflightplanitem, int tzoffset)
        {
            viewflightplanitem.IsBox = false;
            viewflightplanitem.HasCrew = false;
            viewflightplanitem.HasCrewProblem = false;
            viewflightplanitem.AllCrewAssigned = false;
            viewflightplanitem.resourceId = new List<int>();
            viewflightplanitem.Id = entity.Id;
            viewflightplanitem.taskId = entity.taskID;
            viewflightplanitem.FlightPlanId = entity.FlightPlanId;
            viewflightplanitem.TypeId = entity.TypeId;
            viewflightplanitem.RegisterID = entity.RegisterID;
            viewflightplanitem.FlightTypeID = entity.FlightTypeID;
            viewflightplanitem.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightplanitem.FlightNumber = entity.FlightNumber;
            viewflightplanitem.FromAirport = entity.FromAirport;
            viewflightplanitem.ToAirport = entity.ToAirport;
            viewflightplanitem.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);
            viewflightplanitem.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightplanitem.FlightH = entity.FlightH;
            viewflightplanitem.FlightM = entity.FlightM;
            viewflightplanitem.Unknown = entity.Unknown;
            viewflightplanitem.FlightPlan = entity.FlightPlan;
            viewflightplanitem.CustomerId = entity.CustomerId;
            viewflightplanitem.IsActive = entity.IsActive;
            viewflightplanitem.DateActive = entity.DateActive;
            viewflightplanitem.DateFrom = entity.DateFrom;
            viewflightplanitem.DateTo = entity.DateTo;
            viewflightplanitem.Customer = entity.Customer;
            viewflightplanitem.FromAirportName = entity.FromAirportName;
            viewflightplanitem.FromAirportIATA = entity.FromAirportIATA;
            viewflightplanitem.from = entity.from;
            viewflightplanitem.FromAirportCityId = entity.FromAirportCityId;
            viewflightplanitem.ToAirportName = entity.ToAirportName;
            viewflightplanitem.ToAirportIATA = entity.ToAirportIATA;
            viewflightplanitem.to = entity.to;
            viewflightplanitem.ToAirportCityId = entity.ToAirportCityId;
            viewflightplanitem.notes = entity.notes;
            viewflightplanitem.status = (int)entity.status;
            viewflightplanitem.progress = entity.progress;
            viewflightplanitem.duration = entity.duration;
            viewflightplanitem.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);
            viewflightplanitem.taskName = entity.taskName;
            viewflightplanitem.FromAirportCity = entity.FromAirportCity;
            viewflightplanitem.ToAirportCity = entity.ToAirportCity;
            viewflightplanitem.MSN = entity.MSN;
            viewflightplanitem.Register = entity.Register;
            viewflightplanitem.AircraftType = entity.AircraftType;
            viewflightplanitem.FlightStatus = entity.FlightStatus;
            viewflightplanitem.RouteId = entity.RouteId;
            viewflightplanitem.FlightType = entity.FlightType;
        }
    }
    public class ViewFlightPlanItemCalanderDto
    {
        public int Id { get; set; }
        public bool IsBox { get; set; }
        public bool HasCrew { get; set; }
        public bool HasCrewProblem { get; set; }
        public bool AllCrewAssigned { get; set; }
        public int? BoxId { get; set; }
        public List<ViewFlightPlanItemCalanderDto> BoxItems = new List<ViewFlightPlanItemCalanderDto>();
        public int taskId { get; set; }
        public int FlightPlanId { get; set; }
        public int? TypeId { get; set; }
        public int RegisterID { get; set; }
        public int? FlightTypeID { get; set; }
        public string FlightType { get; set; }
        public int? AirlineOperatorsID { get; set; }
        public string FlightNumber { get; set; }
        public int FromAirport { get; set; }
        public int ToAirport { get; set; }
        public DateTime? STA { get; set; }
        public DateTime? STD { get; set; }
        public int FlightH { get; set; }
        public int FlightM { get; set; }
        public string Unknown { get; set; }
        public string FlightPlan { get; set; }
        public int CustomerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DateActive { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string Customer { get; set; }
        public string FromAirportName { get; set; }
        public string FromAirportIATA { get; set; }
        public string from { get; set; }
        public int? FromAirportCityId { get; set; }
        public string ToAirportName { get; set; }
        public string ToAirportIATA { get; set; }
        public string to { get; set; }
        public int? ToAirportCityId { get; set; }
        public string notes { get; set; }
        public int status { get; set; }
        public int progress { get; set; }
        public decimal? duration { get; set; }
        public DateTime? startDate { get; set; }
        public string taskName { get; set; }
        public string FromAirportCity { get; set; }
        public string ToAirportCity { get; set; }
        public int? MSN { get; set; }
        public string Register { get; set; }
        public string AircraftType { get; set; }
        public int CalendarId { get; set; }
        public string FlightStatus { get; set; }
        public int? RouteId { get; set; }

        public List<int> resourceId { get; set; }
        public static void Fill(Models.ViewFlightPlanItemCalander entity, ViewModels.ViewFlightPlanItemCalanderDto viewflightplanitem)
        {
            entity.Id = viewflightplanitem.Id;
            entity.taskID = viewflightplanitem.taskId;
            entity.FlightPlanId = viewflightplanitem.FlightPlanId;
            entity.TypeId = viewflightplanitem.TypeId;
            entity.RegisterID = viewflightplanitem.RegisterID;
            entity.FlightTypeID = viewflightplanitem.FlightTypeID;
            entity.AirlineOperatorsID = viewflightplanitem.AirlineOperatorsID;
            entity.FlightNumber = viewflightplanitem.FlightNumber;
            entity.FromAirport = viewflightplanitem.FromAirport;
            entity.ToAirport = viewflightplanitem.ToAirport;
            entity.STA = viewflightplanitem.STA;
            entity.STD = viewflightplanitem.STD;
            entity.FlightH = viewflightplanitem.FlightH;
            entity.FlightM = viewflightplanitem.FlightM;
            entity.Unknown = viewflightplanitem.Unknown;
            entity.FlightPlan = viewflightplanitem.FlightPlan;
            entity.CustomerId = viewflightplanitem.CustomerId;
            entity.IsActive = viewflightplanitem.IsActive;
            entity.DateActive = viewflightplanitem.DateActive;
            entity.DateFrom = viewflightplanitem.DateFrom;
            entity.DateTo = viewflightplanitem.DateTo;
            entity.Customer = viewflightplanitem.Customer;
            entity.FromAirportName = viewflightplanitem.FromAirportName;
            entity.FromAirportIATA = viewflightplanitem.FromAirportIATA;
            entity.from = viewflightplanitem.from;
            entity.FromAirportCityId = viewflightplanitem.FromAirportCityId;
            entity.ToAirportName = viewflightplanitem.ToAirportName;
            entity.ToAirportIATA = viewflightplanitem.ToAirportIATA;
            entity.to = viewflightplanitem.to;
            entity.ToAirportCityId = viewflightplanitem.ToAirportCityId;
            entity.notes = viewflightplanitem.notes;
            entity.status = viewflightplanitem.status;
            entity.progress = viewflightplanitem.progress;
            entity.duration = viewflightplanitem.duration;
            entity.startDate = viewflightplanitem.startDate;
            entity.taskName = viewflightplanitem.taskName;
            entity.FromAirportCity = viewflightplanitem.FromAirportCity;
            entity.ToAirportCity = viewflightplanitem.ToAirportCity;
            entity.MSN = viewflightplanitem.MSN;
            entity.Register = viewflightplanitem.Register;
            entity.AircraftType = viewflightplanitem.AircraftType;
            entity.FlightStatus = viewflightplanitem.FlightStatus;
            entity.RouteId = viewflightplanitem.RouteId;
            entity.FlightType = viewflightplanitem.FlightType;
        }
        public static void FillDto(Models.ViewFlightPlanItemCalander entity, ViewModels.ViewFlightPlanItemCalanderDto viewflightplanitem, int tzoffset)
        {
            viewflightplanitem.IsBox = false;
            viewflightplanitem.HasCrew = false;
            viewflightplanitem.HasCrewProblem = false;
            viewflightplanitem.AllCrewAssigned = false;
            viewflightplanitem.resourceId = new List<int>();
            viewflightplanitem.Id = entity.Id;
            viewflightplanitem.taskId = entity.taskID;
            viewflightplanitem.FlightPlanId = entity.FlightPlanId;
            viewflightplanitem.TypeId = entity.TypeId;
            viewflightplanitem.RegisterID = entity.RegisterID;
            viewflightplanitem.FlightTypeID = entity.FlightTypeID;
            viewflightplanitem.AirlineOperatorsID = entity.AirlineOperatorsID;
            viewflightplanitem.FlightNumber = entity.FlightNumber;
            viewflightplanitem.FromAirport = entity.FromAirport;
            viewflightplanitem.ToAirport = entity.ToAirport;
            viewflightplanitem.STA = entity.STA == null ? null : (Nullable<DateTime>)((DateTime)entity.STA).AddMinutes(tzoffset);
            viewflightplanitem.STD = entity.STD == null ? null : (Nullable<DateTime>)((DateTime)entity.STD).AddMinutes(tzoffset);
            viewflightplanitem.FlightH = entity.FlightH;
            viewflightplanitem.FlightM = entity.FlightM;
            viewflightplanitem.Unknown = entity.Unknown;
            viewflightplanitem.FlightPlan = entity.FlightPlan;
            viewflightplanitem.CustomerId = entity.CustomerId;
            viewflightplanitem.IsActive = entity.IsActive;
            viewflightplanitem.DateActive = entity.DateActive;
            viewflightplanitem.DateFrom = entity.DateFrom;
            viewflightplanitem.DateTo = entity.DateTo;
            viewflightplanitem.Customer = entity.Customer;
            viewflightplanitem.FromAirportName = entity.FromAirportName;
            viewflightplanitem.FromAirportIATA = entity.FromAirportIATA;
            viewflightplanitem.from = entity.from;
            viewflightplanitem.FromAirportCityId = entity.FromAirportCityId;
            viewflightplanitem.ToAirportName = entity.ToAirportName;
            viewflightplanitem.ToAirportIATA = entity.ToAirportIATA;
            viewflightplanitem.to = entity.to;
            viewflightplanitem.ToAirportCityId = entity.ToAirportCityId;
            viewflightplanitem.notes = entity.notes;
            viewflightplanitem.status = (int)entity.status;
            viewflightplanitem.progress = entity.progress;
            viewflightplanitem.duration = entity.duration;
            viewflightplanitem.startDate = entity.startDate == null ? null : (Nullable<DateTime>)((DateTime)entity.startDate).AddMinutes(tzoffset);
            viewflightplanitem.taskName = entity.taskName;
            viewflightplanitem.FromAirportCity = entity.FromAirportCity;
            viewflightplanitem.ToAirportCity = entity.ToAirportCity;
            viewflightplanitem.MSN = entity.MSN;
            viewflightplanitem.Register = entity.Register;
            viewflightplanitem.AircraftType = entity.AircraftType;
            viewflightplanitem.FlightStatus = entity.FlightStatus;
            viewflightplanitem.RouteId = entity.RouteId;
            viewflightplanitem.FlightType = entity.FlightType;
            viewflightplanitem.CalendarId = entity.CalendarId;
        }
    }


    public class FlightPlanDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string BaseIATA { get; set; }
        public string BaseName { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public DateTime? DateFirst { get; set; }
        public DateTime? DateLast { get; set; }
        public int CustomerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DateActive { get; set; }
        public int? Interval { get; set; }
        public List<int> Months { get; set; }
        public List<int> Days { get; set; }
        public int? IsApproved100 { get; set; }
        public DateTime? DateApproved100 { get; set; }
        public int? IsApproved50 { get; set; }
        public DateTime? DateApproved50 { get; set; }

        public int? IsApproved60 { get; set; }
        public DateTime? DateApproved60 { get; set; }
        public int? IsApproved70 { get; set; }
        public DateTime? DateApproved70 { get; set; }
        public int? IsApproved80 { get; set; }
        public DateTime? DateApproved80 { get; set; }
        public int? IsApproved90 { get; set; }
        public DateTime? DateApproved90 { get; set; }
        public int? BaseId { get; set; }

        public int? VirtualRegisterId { get; set; }
        public int? VirtualTypeId { get; set; }

        public static void Fill(Models.FlightPlan entity, ViewModels.FlightPlanDto flightplan)
        {
            entity.Id = flightplan.Id;
            entity.Title = flightplan.Title;
            entity.DateFrom = flightplan.DateFrom;
            entity.DateTo = flightplan.DateTo;
            entity.DateFirst = flightplan.DateFirst;
            entity.DateLast = flightplan.DateLast;
            entity.CustomerId = flightplan.CustomerId;
            entity.IsActive = flightplan.IsActive;
            entity.DateActive = flightplan.DateActive;
            entity.Interval = flightplan.Interval;
            entity.BaseId = flightplan.BaseId;
        }
        public static void FillDto(Models.FlightPlan entity, ViewModels.FlightPlanDto flightplan)
        {
            flightplan.Id = entity.Id;
            flightplan.Title = entity.Title;
            flightplan.DateFrom = entity.DateFrom;
            flightplan.DateTo = entity.DateTo;
            flightplan.CustomerId = entity.CustomerId;
            flightplan.IsActive = entity.IsActive;
            flightplan.DateActive = entity.DateActive;
            flightplan.Interval = entity.Interval;
            flightplan.BaseId = entity.BaseId;
            flightplan.DateFirst = entity.DateFirst;
            flightplan.DateLast = entity.DateLast;

        }
        public static void FillDto(Models.ViewFlightPlan entity, ViewModels.FlightPlanDto flightplan)
        {
            //xati
            flightplan.Id = entity.Id;
            flightplan.Title = entity.Title;
            flightplan.DateFrom = entity.DateFrom;
            flightplan.DateTo = entity.DateTo;

            flightplan.DateFirst = entity.DateFirst;
            flightplan.DateLast = entity.DateLast;

            flightplan.BaseId = entity.BaseId;
            flightplan.BaseIATA = entity.BaseIATA;
            flightplan.BaseName = entity.BaseName;
            flightplan.VirtualRegisterId = entity.VirtualRegisterId;
            flightplan.VirtualTypeId = entity.VirtualTypeId;

            flightplan.CustomerId = entity.CustomerId;
            flightplan.IsActive = entity.IsActive;
            flightplan.DateActive = entity.DateActive;
            flightplan.Interval = entity.Interval;
            flightplan.IsApproved100 = entity.IsApproved100;
            flightplan.DateApproved100 = entity.DateApproved100;

            flightplan.IsApproved50 = entity.IsApproved50;
            flightplan.DateApproved50 = entity.DateApproved50;

            flightplan.IsApproved60 = entity.IsApproved60;
            flightplan.DateApproved60 = entity.DateApproved60;

            flightplan.IsApproved70 = entity.IsApproved70;
            flightplan.DateApproved70 = entity.DateApproved70;

            flightplan.IsApproved80 = entity.IsApproved80;
            flightplan.DateApproved80 = entity.DateApproved80;

            flightplan.IsApproved90 = entity.IsApproved90;
            flightplan.DateApproved90 = entity.DateApproved90;
        }
    }
    public class FlightPlanItemDto
    {
        public int Id { get; set; }
        public int FlightPlanId { get; set; }
        public int? TypeId { get; set; }
        public int? RegisterID { get; set; }
        public int? FlightTypeID { get; set; }
        public int? AirlineOperatorsID { get; set; }
        public string FlightNumber { get; set; }
        public int FromAirport { get; set; }
        public int ToAirport { get; set; }
        public DateTime? STD { get; set; }
        public DateTime? STA { get; set; }
        public int FlightH { get; set; }
        public int FlightM { get; set; }
        public string Unknown { get; set; }
        public int? StatusId { get; set; }
        public int? RouteId { get; set; }
        public Models.FlightPlanItem PlanItem { get; set; }
        public static void Fill(Models.FlightPlanItem entity, ViewModels.FlightPlanItemDto flightplanitem)
        {
            entity.Id = flightplanitem.Id;
            entity.FlightPlanId = flightplanitem.FlightPlanId;
            entity.TypeId = flightplanitem.TypeId;
            entity.RegisterID = flightplanitem.RegisterID;
            entity.FlightTypeID = flightplanitem.FlightTypeID;
            entity.AirlineOperatorsID = flightplanitem.AirlineOperatorsID;
            entity.FlightNumber = flightplanitem.FlightNumber;
            entity.FromAirport = flightplanitem.FromAirport;
            entity.ToAirport = flightplanitem.ToAirport;
            entity.STD = ((DateTime)flightplanitem.STD);//.AddHours(3).AddMinutes(30);
            entity.STA = ((DateTime)flightplanitem.STA);//.AddHours(3).AddMinutes(30);
            entity.FlightH = flightplanitem.FlightH;
            entity.FlightM = flightplanitem.FlightM;
            entity.Unknown = flightplanitem.Unknown;
            entity.StatusId = flightplanitem.StatusId;
            entity.RouteId = flightplanitem.RouteId;
        }
        public static void FillDto(Models.FlightPlanItem entity, ViewModels.FlightPlanItemDto flightplanitem)
        {
            flightplanitem.Id = entity.Id;
            flightplanitem.FlightPlanId = entity.FlightPlanId;
            flightplanitem.TypeId = entity.TypeId;
            flightplanitem.RegisterID = entity.RegisterID;
            flightplanitem.FlightTypeID = entity.FlightTypeID;
            flightplanitem.AirlineOperatorsID = entity.AirlineOperatorsID;
            flightplanitem.FlightNumber = entity.FlightNumber;
            flightplanitem.FromAirport = entity.FromAirport;
            flightplanitem.ToAirport = entity.ToAirport;
            flightplanitem.STD = entity.STD;
            flightplanitem.STA = entity.STA;
            flightplanitem.FlightH = entity.FlightH;
            flightplanitem.FlightM = entity.FlightM;
            flightplanitem.Unknown = entity.Unknown;
            flightplanitem.StatusId = entity.StatusId;
            flightplanitem.RouteId = entity.RouteId;
        }
    }


    public class FlightPlanningDto
    {
        public int Id { get; set; }
        public int? FlightId { get; set; }
        public string Title { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public DateTime? DateFirst { get; set; }
        public DateTime? DateLast { get; set; }
        public int CustomerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DateActive { get; set; }
        public int? Interval { get; set; }
        public List<int> Months { get; set; }
        public List<int> Days { get; set; }
        public int? IsApproved100 { get; set; }
        public DateTime? DateApproved100 { get; set; }
        public int? IsApproved50 { get; set; }
        public DateTime? DateApproved50 { get; set; }

        public int? IsApproved60 { get; set; }
        public DateTime? DateApproved60 { get; set; }
        public int? IsApproved70 { get; set; }
        public DateTime? DateApproved70 { get; set; }
        public int? IsApproved80 { get; set; }
        public DateTime? DateApproved80 { get; set; }
        public int? IsApproved90 { get; set; }
        public DateTime? DateApproved90 { get; set; }
        public int? BaseId { get; set; }

        public int FlightPlanId { get; set; }
        public int? TypeId { get; set; }
        public int? RegisterID { get; set; }
        public int? FlightTypeID { get; set; }
        public int? AirlineOperatorsID { get; set; }
        public string FlightNumber { get; set; }
        public int FromAirport { get; set; }
        public int ToAirport { get; set; }
        public DateTime? STD { get; set; }
        public DateTime? STA { get; set; }
        public int FlightH { get; set; }
        public int FlightM { get; set; }
        public string Unknown { get; set; }
        public int? StatusId { get; set; }
        public int? RouteId { get; set; }
        public string UserName { get; set; }
        public int? SMSNira { get; set; }
        public string Remark { get; set; }
        public Models.FlightPlanItem PlanItem { get; set; }
    }
    public class FlightPlanRegisterDto
    {
        public string DateFrom { get; set; }
        public string DateTo { get; set; }

    }
    public class FlightPlanSaveDto
    {
        public FlightPlanDto Plan { get; set; }
        public List<FlightPlanItemDto> Items { get; set; }
        public List<int> Deleted { get; set; }

        public bool Apply { get; set; }
    }

    public class FlightPlanRegistersSaveDto
    {
        public int PlanId { get; set; }
        public List<Models.ViewFlightPlanRegister> Items { get; set; }
        public List<int> Deleted { get; set; }


    }

    public class FlightSaveDto
    {
        public int ID { get; set; }

        public int? SendDelaySMS { get; set; }
        public int? SendCancelSMS { get; set; }
        public int? SendNiraSMS { get; set; }
        public int? FlightStatusID { get; set; }

        public DateTime? ChocksOut { get; set; }
        public DateTime? Takeoff { get; set; }
        public DateTime? Landing { get; set; }
        public DateTime? ChocksIn { get; set; }

        public int? BlockH { get; set; }
        public int? BlockM { get; set; }
        public decimal? GWTO { get; set; }
        public decimal? GWLand { get; set; }

        public decimal? FuelDeparture { get; set; }
        public decimal? FuelArrival { get; set; }
        public int? PaxAdult { get; set; }
        public int? NightTime { get; set; }
        public int? PaxInfant { get; set; }
        public int? PaxChild { get; set; }
        public int? PaxMale { get; set; }
        public int? PaxFemale { get; set; }
        public int? CargoWeight { get; set; }
        public int? CargoUnitID { get; set; }
        public int? BaggageCount { get; set; }

        public int? CargoCount { get; set; }
        public int? BaggageWeight { get; set; }
        public int? FuelUnitID { get; set; }
        public string ArrivalRemark { get; set; }
        public string DepartureRemark { get; set; }

        public int? UserId { get; set; }
        public string UserName { get; set; }
        public int? ToAirportId { get; set; }

        public DateTime? STA { get; set; }
        public int? CancelReasonId { get; set; }
        public string CancelRemark { get; set; }
        public DateTime? CancelDate { get; set; }
        public int? OToAirportId { get; set; }
        public DateTime? OSTA { get; set; }
        public string OToAirportIATA { get; set; }
        public int? RedirectReasonId { get; set; }
        public string RedirectRemark { get; set; }
        public DateTime? RedirectDate { get; set; }
        public int? RampReasonId { get; set; }
        public string RampRemark { get; set; }
        public DateTime? RampDate { get; set; }
        public int? FPFlightHH { get; set; }
        public int? FPFlightMM { get; set; }
        public decimal? FPFuel { get; set; }
        public decimal? Defuel { get; set; }
        public decimal? UsedFuel { get; set; }
        public int? JLBLHH { get; set; }
        public int? JLBLMM { get; set; }
        public int? PFLR { get; set; }

        public List<Models.FlightStatusLog> StatusLog = new List<Models.FlightStatusLog>();
        public List<Models.FlightDelay> Delays = new List<Models.FlightDelay>();
        public List<ViewModels.EstimatedDelay> EstimatedDelays = new List<ViewModels.EstimatedDelay>();

        public string ChrCode { get; set; }
        public string ChrTitle { get; set; }
        public int? ChrAdult { get; set; }
        public int? ChrChild { get; set; }
        public int? ChrInfant { get; set; }
        public int? ChrCapacity { get; set; }

        public string CLDepEqRemark { get; set; }

    }
    public class FlightCancelDto
    {
        public int FlightId { get; set; }

        public int? UserId { get; set; }
        public int? CancelReasonId { get; set; }

        public string CancelRemark { get; set; }
        public DateTime? CancelDate { get; set; }
        public DateTime Date { get; set; }



    }
    public class FlightRampDto
    {
        public int FlightId { get; set; }

        public int? UserId { get; set; }
        public int? RampReasonId { get; set; }

        public string RampRemark { get; set; }
        public DateTime? RampDate { get; set; }
        public DateTime Date { get; set; }



    }
    public class FlightRedirectDto
    {
        public int FlightId { get; set; }

        public int? UserId { get; set; }
        public int? RedirectReasonId { get; set; }

        public string RedirectRemark { get; set; }
        public DateTime? RedirectDate { get; set; }
        public DateTime Date { get; set; }

        public int AirportId { get; set; }
        public DateTime STA { get; set; }

        public string OAirportIATA { get; set; }



    }
    public class FlightRegisterDto
    {
        public int FlightId { get; set; }

        public int TypeId { get; set; }
        public int RegisterId { get; set; }





    }


    public class FlightPlanCalanderCrewDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int? FlightPlanId { get; set; }
        public int? CalanderId { get; set; }
        public int? FlightPlanItemId { get; set; }
        public int? BoxId { get; set; }
        public int GroupId { get; set; }
        public string Remark { get; set; }
        public int? AvailabilityId { get; set; }

        public int? ECSplitedId { get; set; }

        public int? ECId { get; set; }
        public static void Fill(Models.FlightPlanCalanderCrew entity, ViewModels.FlightPlanCalanderCrewDto flightplancalandercrew)
        {
            entity.Id = flightplancalandercrew.Id;
            entity.EmployeeId = flightplancalandercrew.EmployeeId;
            entity.FlightPlanId = flightplancalandercrew.FlightPlanId;
            entity.CalanderId = flightplancalandercrew.CalanderId;
            entity.GroupId = flightplancalandercrew.GroupId;
            entity.Remark = flightplancalandercrew.Remark;
            entity.BoxId = flightplancalandercrew.BoxId;
            entity.FlightPlanItemId = flightplancalandercrew.FlightPlanItemId;
            entity.AvailabilityId = flightplancalandercrew.AvailabilityId;
        }
        public static void FillDto(Models.FlightPlanCalanderCrew entity, ViewModels.FlightPlanCalanderCrewDto flightplancalandercrew)
        {
            flightplancalandercrew.Id = entity.Id;
            flightplancalandercrew.EmployeeId = entity.EmployeeId;
            flightplancalandercrew.FlightPlanId = entity.FlightPlanId;
            flightplancalandercrew.CalanderId = entity.CalanderId;
            flightplancalandercrew.GroupId = entity.GroupId;
            flightplancalandercrew.Remark = entity.Remark;
            flightplancalandercrew.BoxId = entity.BoxId;
            flightplancalandercrew.FlightPlanItemId = entity.FlightPlanItemId;
            flightplancalandercrew.AvailabilityId = entity.AvailabilityId;

        }
    }


    public class EstimatedDelay
    {
        public int FlightId { get; set; }
        public int Delay { get; set; }
    }

    public class FlightsFilter
    {
        public List<int?> Status { get; set; }
        public List<int?> Types { get; set; }
        public List<int?> Registers { get; set; }
        public List<int?> From { get; set; }
        public List<int?> To { get; set; }




    }

    public class FlightPlanSummary
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int CustomerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DateActive { get; set; }
        public string Customer { get; set; }
        public int? Interval { get; set; }
        public string IntervalType { get; set; }
        public int? Gaps { get; set; }
        public int? Overlaps { get; set; }
        public int? GapOverlaps { get; set; }
        public string Types { get; set; }
        public int? TotalFlights { get; set; }
        public int DesignedRegisterCount { get; set; }
        public int? CompletedAssignedRegisterCount { get; set; }
        public int? NotCompletedAssignedRegisterCount { get; set; }
        public decimal? RegisterAssignProgress { get; set; }
        public int IsApproved100 { get; set; }
        public DateTime? DateApproved100 { get; set; }
        public int IsApproved50 { get; set; }
        public DateTime? DateApproved50 { get; set; }
        public int IsApproved60 { get; set; }
        public DateTime? DateApproved60 { get; set; }
        public int IsApproved70 { get; set; }
        public DateTime? DateApproved70 { get; set; }
        public int IsApproved80 { get; set; }
        public DateTime? DateApproved80 { get; set; }
        public int IsApproved90 { get; set; }
        public DateTime? DateApproved90 { get; set; }
        public List<int> Months { get; set; }
        public List<int> Days { get; set; }
        public string MonthsStr { get; set; }
        public string DaysStr { get; set; }
        public List<ViewFlighPlanAssignedRegister> AssignedRegisters { get; set; }
        public static void Fill(Models.ViewFlightPlan entity, ViewModels.FlightPlanSummary viewflightplan)
        {
            entity.Id = viewflightplan.Id;
            entity.Title = viewflightplan.Title;
            entity.DateFrom = viewflightplan.DateFrom;
            entity.DateTo = viewflightplan.DateTo;
            entity.CustomerId = viewflightplan.CustomerId;
            entity.IsActive = viewflightplan.IsActive;
            entity.DateActive = viewflightplan.DateActive;
            entity.Customer = viewflightplan.Customer;
            entity.Interval = viewflightplan.Interval;
            entity.IntervalType = viewflightplan.IntervalType;
            entity.Gaps = viewflightplan.Gaps;
            entity.Overlaps = viewflightplan.Overlaps;
            entity.GapOverlaps = viewflightplan.GapOverlaps;
            entity.Types = viewflightplan.Types;
            entity.TotalFlights = viewflightplan.TotalFlights;
            entity.DesignedRegisterCount = viewflightplan.DesignedRegisterCount;
            entity.CompletedAssignedRegisterCount = viewflightplan.CompletedAssignedRegisterCount;
            entity.NotCompletedAssignedRegisterCount = viewflightplan.NotCompletedAssignedRegisterCount;
            entity.RegisterAssignProgress = viewflightplan.RegisterAssignProgress;
            entity.IsApproved100 = viewflightplan.IsApproved100;
            entity.DateApproved100 = viewflightplan.DateApproved100;
            entity.IsApproved50 = viewflightplan.IsApproved50;
            entity.DateApproved50 = viewflightplan.DateApproved50;
            entity.IsApproved60 = viewflightplan.IsApproved60;
            entity.DateApproved60 = viewflightplan.DateApproved60;
            entity.IsApproved70 = viewflightplan.IsApproved70;
            entity.DateApproved70 = viewflightplan.DateApproved70;
            entity.IsApproved80 = viewflightplan.IsApproved80;
            entity.DateApproved80 = viewflightplan.DateApproved80;
            entity.IsApproved90 = viewflightplan.IsApproved90;
            entity.DateApproved90 = viewflightplan.DateApproved90;
        }
        public static void FillDto(Models.ViewFlightPlan entity, ViewModels.FlightPlanSummary viewflightplan)
        {
            viewflightplan.Id = entity.Id;
            viewflightplan.Title = entity.Title;
            viewflightplan.DateFrom = entity.DateFrom;
            viewflightplan.DateTo = entity.DateTo;
            viewflightplan.CustomerId = entity.CustomerId;
            viewflightplan.IsActive = entity.IsActive;
            viewflightplan.DateActive = entity.DateActive;
            viewflightplan.Customer = entity.Customer;
            viewflightplan.Interval = entity.Interval;
            viewflightplan.IntervalType = entity.IntervalType;
            viewflightplan.Gaps = entity.Gaps;
            viewflightplan.Overlaps = entity.Overlaps;
            viewflightplan.GapOverlaps = entity.GapOverlaps;
            viewflightplan.Types = entity.Types;
            viewflightplan.TotalFlights = entity.TotalFlights;
            viewflightplan.DesignedRegisterCount = entity.DesignedRegisterCount;
            viewflightplan.CompletedAssignedRegisterCount = entity.CompletedAssignedRegisterCount;
            viewflightplan.NotCompletedAssignedRegisterCount = entity.NotCompletedAssignedRegisterCount;
            viewflightplan.RegisterAssignProgress = entity.RegisterAssignProgress;
            viewflightplan.IsApproved100 = entity.IsApproved100;
            viewflightplan.DateApproved100 = entity.DateApproved100;
            viewflightplan.IsApproved50 = entity.IsApproved50;
            viewflightplan.DateApproved50 = entity.DateApproved50;
            viewflightplan.IsApproved60 = entity.IsApproved60;
            viewflightplan.DateApproved60 = entity.DateApproved60;
            viewflightplan.IsApproved70 = entity.IsApproved70;
            viewflightplan.DateApproved70 = entity.DateApproved70;
            viewflightplan.IsApproved80 = entity.IsApproved80;
            viewflightplan.DateApproved80 = entity.DateApproved80;
            viewflightplan.IsApproved90 = entity.IsApproved90;
            viewflightplan.DateApproved90 = entity.DateApproved90;
        }
    }

    public class FlightRegisterChangeLogDto
    {
        public int Id { get; set; }
        public int FlightId { get; set; }
        public int OldRegisterId { get; set; }
        public int NewRegisterId { get; set; }
        public DateTime Date { get; set; }
        public int? UserId { get; set; }
        public string UserName { get; set; }
        public int ReasonId { get; set; }
        public string Remark { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public int CustomerId { get; set; }
        public DateTime? intervalFrom { get; set; }
        public DateTime? intervalTo { get; set; }
        public List<int> days { get; set; }
        public int? interval { get; set; }
        public DateTime? RefDate { get; set; }
        public int? RefDays { get; set; }
        public List<int> Flights = new List<int>();
        public static void Fill(Models.FlightRegisterChangeLog entity, ViewModels.FlightRegisterChangeLogDto flightregisterchangelog)
        {
            entity.Id = flightregisterchangelog.Id;
            entity.FlightId = flightregisterchangelog.FlightId;
            entity.OldRegisterId = flightregisterchangelog.OldRegisterId;
            entity.NewRegisterId = flightregisterchangelog.NewRegisterId;
            entity.Date = flightregisterchangelog.Date;
            entity.UserId = flightregisterchangelog.UserId;
            entity.ReasonId = flightregisterchangelog.ReasonId;
            entity.Remark = flightregisterchangelog.Remark;
        }
        public static void FillDto(Models.FlightRegisterChangeLog entity, ViewModels.FlightRegisterChangeLogDto flightregisterchangelog)
        {
            flightregisterchangelog.Id = entity.Id;
            flightregisterchangelog.FlightId = entity.FlightId;
            flightregisterchangelog.OldRegisterId = entity.OldRegisterId;
            flightregisterchangelog.NewRegisterId = entity.NewRegisterId;
            flightregisterchangelog.Date = entity.Date;
            flightregisterchangelog.UserId = entity.UserId;
            flightregisterchangelog.ReasonId = entity.ReasonId;
            flightregisterchangelog.Remark = entity.Remark;
        }
    }


    public class FDPItemDetail
    {
        public int FDPItem { get; set; }
        public bool Off { get; set; }
    }
    public class FDPItemOFFDto
    {
        public int FDPId { get; set; }

        public List<FDPItemDetail> Items { get; set; }


    }

    public class FDPCrew
    {
        //var dto = { fdp: _d.fdpId, crew: _d.CrewId, position: _d.PersonId };
        public int fdp { get; set; }
        public int crew { get; set; }
        public int position { get; set; }

        public int stby { get; set; }
    }

    public class RosterCrew
    {
        public int CrewId { get; set; }
        public string Mobile { get; set; }
        public string Name { get; set; }
        public string FlightNumber { get; set; }
        public Nullable<System.DateTime> DepartureLocal { get; set; }
        public Nullable<System.DateTime> ArrivalLocal { get; set; }
        public Nullable<bool> IsPositioning { get; set; }
        public string FromAirportIATA { get; set; }
        public string ToAirportIATA { get; set; }
    }

    public class CLJLData
    {
        public int? CrewId { get; set; }
        public bool? IsPositioning { get; set; }
        public int? PositionId { get; set; }
        public string Position { get; set; }
        public string Name { get; set; }
        public int? GroupId { get; set; }
        public string JobGroup { get; set; }
        public string JobGroupCode { get; set; }
        public int? GroupOrder { get; set; }
        public int IsCockpit { get; set; }

        public List<string> Legs { get; set; }
        public string LegsStr { get; set; }

        public int? FlightId { get; set; }
        public string PID { get; set; }

        public string Mobile { get; set; }
        public string Address { get; set; }

    }
    public class RosterError
    {
        public int? CrewId { get; set; }
        public string Message { get; set; }
        public List<int> Flights { get; set; }

        public int? Flight { get; set; }
    }
    public class RosterFlight
    {
        public int FlightId { get; set; }
        public int PositionId { get; set; }
        public int RosterPosition { get; set; }
        public bool DH { get; set; }

        public int? Group { get; set; }
        public int? SubGroup { get; set; }

        public double? DiffToNext { get; set; }
        public DateTime? STD { get; set; }
        public DateTime? STA { get; set; }
    }

    public class RosterMethodDto
    {
        public List<RosterColumn> rosterColumns { get; set; }

        public List<DutyDto> rosterDuties { get; set; }
    }

    public class RosterColumn
    {
        public int CrewId { get; set; }
        public List<RosterFlight> Flights { get; set; }

        // public List<ViewFlightInformation> ViewFlights { get; set; }
        public List<ViewLegTime> ViewLegs { get; set; }
    }

    public class RosterFDP
    {
        public string dutyTypeTitle = "FDP";
        public int dutyType = 1165;
        public string DutyType { get { return dutyTypeTitle; } }
        public int DutyTypeId { get { return dutyType; } }
        public int Id { get; set; }
        public string Key { get; set; }
        public int? CrewId { get; set; }

        public List<RosterFDPItem> Items { get; set; }


        public double MaxFDP { get; set; }
        public double MaxFDPExtended { get; set; }

        public double? Duration
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return 0;
                var first = ((DateTime)this.Items.First().Flight.STD).AddMinutes(-60);
                var last = ((DateTime)this.Items.Last().Flight.STA);
                return (last - first).TotalMinutes;
            }
        }
        public double? Duty
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var first = ((DateTime)this.Items.First().Flight.STD).AddMinutes(-60);
                var last = ((DateTime)this.Items.Last().Flight.STA).AddMinutes(30);
                return (last - first).TotalMinutes;
            }
        }
        public bool IsOver { get { return Duration > MaxFDPExtended; } }
        public double OverDuration
        {
            get
            {
                return this.MaxFDPExtended - (double)this.Duration;
            }
        }

        public DateTime? ReportingTime
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var first = ((DateTime)this.Items.First().Flight.STD).AddMinutes(-60);
                return first;
            }
        }
        public DateTime? ReportingTimeLocal
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var first = ((DateTime)this.Items.First().Flight.STD).AddMinutes(-60).AddMinutes(270);
                return first;
            }
        }


        public DateTime? dutyStart = null;
        public DateTime? DutyStart
        {
            get
            {
                if (dutyStart != null)
                    return dutyStart;
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var first = ((DateTime)this.Items.First().Flight.STD).AddMinutes(-60);
                return first;
            }
            set
            {
                dutyStart = value;
            }
        }

        public DateTime? dutyStartLocal = null;
        public DateTime? DutyStartLocal
        {
            get
            {
                if (dutyStartLocal != null)
                    return dutyStartLocal;
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var first = ((DateTime)this.Items.First().Flight.STD).AddMinutes(-60).AddMinutes(270);
                return first;
            }
        }

        DateTime? restTo = null;
        public DateTime? RestTo
        {
            get
            {

                if (restTo != null)
                    return restTo;
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var first = ((DateTime)this.Items.Last().Flight.STA).AddMinutes(30).AddMinutes(12 * 60);
                return first;
            }
            set
            {
                restTo = value;
            }
        }

        DateTime? restToLocal = null;
        public DateTime? RestToLocal
        {
            get
            {
                if (restToLocal != null)
                    return restToLocal;
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var first = ((DateTime)this.Items.Last().Flight.STA).AddMinutes(30).AddMinutes(12 * 60).AddMinutes(270);
                return first;
            }
            set
            {
                restToLocal = value;
            }
        }

        public double? Flight
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                return this.Items.Sum(q => q.Flight.FlightTimeActual != null ? q.Flight.FlightTimeActual : q.Flight.FlightTime);
            }
        }

        public DateTime? FDPEnd
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var last = ((DateTime)this.Items.Last().Flight.STA);
                return last;
            }
        }

        public DateTime? DutyEnd
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var last = ((DateTime)this.Items.Last().Flight.STA).AddMinutes(30);
                return last;
            }
        }


        public DateTime? FDPEndLocal
        {
            get
            {
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var last = ((DateTime)this.Items.Last().Flight.STA).AddMinutes(270);
                return last;
            }
        }
        public DateTime? dutyEndLocal = null;
        public DateTime? DutyEndLocal
        {
            get
            {
                if (dutyEndLocal != null)
                    return dutyEndLocal;
                if (this.Items == null || this.Items.Count == 0)
                    return null;
                var last = ((DateTime)this.Items.Last().Flight.STA).AddMinutes(30).AddMinutes(270);
                return last;
            }
        }

        public int? LastLocationId
        {
            get
            {
                if (this.Items != null && this.Items.Count > 0)
                    return this.Items.Last().Flight.ToAirport;
                else
                    return null;
            }
        }
        public string LastLocation
        {
            get
            {
                if (this.Items != null && this.Items.Count > 0)
                    return this.Items.Last().Flight.ToAirportIATA;
                else
                    return null;
            }
        }

        public int? FirstLocationId
        {
            get
            {
                if (this.Items != null && this.Items.Count > 0)
                    return this.Items.First().Flight.FromAirport;
                else
                    return null;
            }
        }
        public string FirstLocation
        {
            get
            {
                if (this.Items != null && this.Items.Count > 0)
                    return this.Items.First().Flight.FromAirportIATA;
                else
                    return null;
            }
        }

        public bool IsRestOk { get; set; }


        public string remark = null;
        public string Remark
        {
            get
            {
                if (!string.IsNullOrEmpty(remark))
                    return remark;
                if (this.Items == null || this.Items.Count == 0)
                    return string.Empty;
                var result = string.Empty;
                var parts = this.Items.Select(q => q.Flight.FlightNumber).ToList();

                return string.Join(" - ", parts);
            }
            set { remark = value; }
        }


    }

    public class RosterEvent
    {
        public int? CrewId { get; set; }
        public int? Type { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
    }
    public class RosterFDPLight
    {
        bool isFDP = true;
        public bool IsFDP
        {
            get { return isFDP; }
            set { isFDP = value; }
        }
        public string Remark { get; set; }
        public int dutyTypeId = 1165;
        string dutyType = "FDP";
        public string DutyType { get { return dutyType; } set { dutyType = value; } }
        public int DutyTypeId { get { return dutyTypeId; } set { dutyTypeId = value; } }
        public int Id { get; set; }
        public string Key { get; set; }
        public int? CrewId { get; set; }

        public List<RosterFDPItem> Items { get; set; }


        public double MaxFDP { get; set; }
        public double MaxFDPExtended { get; set; }

        public double? Duration { get; set; }
        public double? Duty { get; set; }
        public bool IsOver { get; set; }
        public double OverDuration { get; set; }

        public DateTime? ReportingTime { get; set; }
        public DateTime? ReportingTimeLocal { get; set; }

        public DateTime? DutyStart { get; set; }
        public DateTime? DutyStartLocal { get; set; }

        public DateTime? RestTo { get; set; }
        public DateTime? RestToLocal { get; set; }

        public double? Flight { get; set; }

        public DateTime? FDPEnd { get; set; }

        public DateTime? DutyEnd { get; set; }


        public DateTime? FDPEndLocal { get; set; }

        public DateTime? DutyEndLocal { get; set; }

        public int? LastLocationId { get; set; }
        public string LastLocation { get; set; }

        public int? FirstLocationId { get; set; }
        public string FirstLocation { get; set; }

        public bool IsRestOk { get; set; }


    }


    public class RosterFDPLight2
    {
        bool isFDP = true;
        public bool IsFDP
        {
            get { return isFDP; }
            set { isFDP = value; }
        }
        public string Remark { get; set; }
        public int dutyTypeId = 1165;
        public int dutyType { get; set; }
        public string dutyTypeTitle = "FDP";
        public string DutyType { get { return dutyTypeTitle; } set { dutyTypeTitle = value; } }
        public int DutyTypeId { get { return dutyTypeId; } set { dutyTypeId = value; } }
        public int Id { get; set; }
        public string Key { get; set; }
        public int? CrewId { get; set; }

        public List<RosterFDPItem> Items { get; set; }


        public double MaxFDP { get; set; }
        public double MaxFDPExtended { get; set; }

        public double? Duration { get; set; }
        public double? Duty { get; set; }
        public bool IsOver { get; set; }
        public double OverDuration { get; set; }

        public DateTime? ReportingTime { get; set; }
        public DateTime? ReportingTimeLocal { get; set; }

        public DateTime? DutyStart { get; set; }
        public DateTime? DutyStartLocal { get; set; }
        public DateTime? dutyStartLocal { get; set; }

        public DateTime? RestTo { get; set; }
        public DateTime? RestToLocal { get; set; }

        public double? Flight { get; set; }

        public DateTime? FDPEnd { get; set; }

        public DateTime? DutyEnd { get; set; }


        public DateTime? FDPEndLocal { get; set; }

        public DateTime? DutyEndLocal { get; set; }
        public DateTime? dutyEndLocal { get; set; }

        public int? LastLocationId { get; set; }
        public string LastLocation { get; set; }

        public int? FirstLocationId { get; set; }
        public string FirstLocation { get; set; }

        public bool IsRestOk { get; set; }


    }

    public class RosterErrorItem
    {
        public int? CrewId { get; set; }
        public string Name { get; set; }
        public int TypeId { get; set; }
        public string Remark { get; set; }
        public string Remark2 { get; set; }
        public string Type
        {
            get
            {
                switch (TypeId)
                {
                    case 1:
                        return "Rest/Interruption Error";
                    case 2:
                        return "Location Continuity Error";
                    case 3:
                        return "Over Duty Error";
                    case 4:
                        return "Flight Time/Duty Limitaion Error";
                    case 5:
                        return "RERRP Error";


                    default: return "unknow";
                }
            }
        }

    }

    public class FTL
    {
        public DateTime Date { get; set; }
        public double D7 { get; set; }
        public double D14 { get; set; }
        public double D28 { get; set; }

        public double F28 { get; set; }

        public double FY { get; set; }

    }
    public class RosterFDPItem
    {
        // public ViewFlightInformation Flight { get; set; }
        public ViewLegTime Flight { get; set; }
        public int PositionId { get; set; }
        public int RosterPosition { get; set; }
        public bool DH { get; set; }

        public bool IsSector { get; set; }
        public bool SplitDuty { get; set; }
        public int SplitDutyPairId { get; set; }

        public double? Break { get; set; }



    }

    public class ANormalFDPs
    {
        public string Key { get; set; }
        public double Score { get; set; }
        public List<RosterFDP> FDPs { get; set; }
    }

    public class MaxFDPStats
    {
        public int Sectors { get; set; }
        public DateTime ReportingTime { get; set; }

        public DateTime RestTo { get; set; }

        public double MaxFDP { get; set; }
        public double WOCL { get; set; }
        public double WOCLError { get; set; }

        public double Extended { get; set; }

        public double MaxFDPExtended { get; set; }

        public double Flight { get; set; }

        public DateTime RestFrom { get; set; }

        public double Duration { get; set; }
        public double Duty { get; set; }

        public bool IsOver
        {
            get
            {
                return Duration > MaxFDPExtended;
            }
        }

        public int AllowedExtension { get; set; }
    }

    public class DutyDto
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public string Remark { get; set; }

        public int CrewId { get; set; }

        public int Type { get; set; }

        public int Airline { get; set; }

        public int Id { get; set; }

        public int? LocationId { get; set; }
        public int? GroupId { get; set; }
        public string TypeTitle { get; set; }

    }

    public class SunTimeDto
    {
        public DateTime Date { get; set; }
        public double Lt { get; set; }
        public double Lng { get; set; }

        public DateTime Sunrise { get; set; }
        public DateTime Sunset { get; set; }
        public DateTime SolarNoon { get; set; }
        public int DayLength { get; set; }
        public DateTime CivilTwilightBegin { get; set; }
        public DateTime CivilTwilightEnd { get; set; }
        public DateTime NauticalTwilightBegin { get; set; }
        public DateTime NauticalTwilightEnd { get; set; }
        public DateTime AstronomicalTwilightBegin { get; set; }
        public DateTime AstronomicalTwilightEnd { get; set; }
    }

    public class RosterFDPDtoItem
    {
        public int flightId { get; set; }
        public int dh { get; set; }
        public DateTime std { get; set; }
        public DateTime sta { get; set; }
        public int index { get; set; }
        public int rankId { get; set; }
        public string no { get; set; }
        public string from { get; set; }
        public string to { get; set; }




    }
    public class RosterFDPId
    {
        public int id { get; set; }
        public int dh { get; set; }
    }
    public class RosterFDPDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public List<RosterFDPId> ids { get; set; }
        public int crewId { get; set; }
        public string rank { get; set; }
        public int index { get; set; }
        public List<string> flights { get; set; }
        public int from { get; set; }
        public int to { get; set; }
        public int homeBase { get; set; }
        public string flts { get; set; }
        public string route { get; set; }
        public string key { get; set; }
        public string group { get; set; }
        public string scheduleName { get; set; }
        public string no { get; set; }
        public int? extension { get; set; }
        public decimal? maxFDP { get; set; }

        public bool split { get; set; }

        public bool? IsSplitDuty { get; set; }
        public int? SplitValue { get; set; }

        public int? IsAdmin { get; set; }

        public int? DeletedFDPId { get; set; }

        public List<RosterFDPDtoItem> items { get; set; }

        public double getDuty()
        {
            return (this.items.Last().sta.AddMinutes(30) - this.items.First().std.AddMinutes(-60)).TotalMinutes;
        }
        public double getFlight()
        {
            double flt = 0;
            foreach (var x in this.items)
                flt += (x.sta - x.std).TotalMinutes;
            return flt;
        }
        public static List<RosterFDPDtoItem> getItems(List<string> flts)
        {
            List<RosterFDPDtoItem> result = new List<RosterFDPDtoItem>();
            foreach (var x in flts)
            {
                var parts = x.Split('_');
                var item = new RosterFDPDtoItem();
                item.flightId = Convert.ToInt32(parts[0]);
                item.dh = Convert.ToInt32(parts[1]);
                var stdStr = parts[2];
                var staStr = parts[3];
                item.std = new DateTime(Convert.ToInt32(stdStr.Substring(0, 4)), Convert.ToInt32(stdStr.Substring(4, 2)), Convert.ToInt32(stdStr.Substring(6, 2))
                    , Convert.ToInt32(stdStr.Substring(8, 2))
                    , Convert.ToInt32(stdStr.Substring(10, 2))
                    , 0
                    ).ToUniversalTime();
                item.sta = new DateTime(Convert.ToInt32(staStr.Substring(0, 4)), Convert.ToInt32(staStr.Substring(4, 2)), Convert.ToInt32(staStr.Substring(6, 2))
                   , Convert.ToInt32(staStr.Substring(8, 2))
                   , Convert.ToInt32(staStr.Substring(10, 2))
                   , 0
                   ).ToUniversalTime();
                item.no = parts[4];
                item.from = parts[5];
                item.to = parts[6];

                result.Add(item);
            }

            return result;
        }

        public static int getRank(string rank)
        {
            if (rank.StartsWith("IP"))
                return 12000;
            if (rank.StartsWith("P1"))
                return 1160;
            if (rank.StartsWith("P2"))
                return 1161;
            if (rank.ToUpper().StartsWith("SAFETY"))
                return 1162;
            if (rank.ToUpper().StartsWith("FE"))
                return 1165;
            if (rank.StartsWith("ISCCM"))
                return 10002;
            if (rank.StartsWith("SCCM"))
                return 1157;
            if (rank.StartsWith("CCM"))
                return 1158;
            if (rank.StartsWith("OBS"))
                return 1153;
            if (rank.StartsWith("CHECK"))
                return 1154;
            if (rank.StartsWith("00103"))
                return 12001;
            if (rank.StartsWith("004"))
                return 12002;
            if (rank.StartsWith("005"))
                return 12003;

            return -1;

        }
        public static string getRankStr(int rank)
        {
            if (rank == 12000)
                return "IP";
            if (rank == 1160)
                return "P1";
            if (rank == 1161)
                return "P2";
            if (rank == 1162)
                return "SAFETY";
            if (rank == 10002)
                return "ISCCM";
            if (rank == 1157)
                return "SCCM";
            if (rank == 1158)
                return "CCM";
            if (rank == 1153)
                return "OBS";
            if (rank == 1154)
                return "CHECK";
            return "";
        }


    }


}