using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
namespace EPAGriffinAPI.ViewModels
{
    public class Airport
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
        // [Required(ErrorMessage = "IATA is required")]
        public string IATA { get; set; }
        public string ICAO { get; set; }
        [Required(ErrorMessage = "City is required")]
        public int CityId { get; set; }

        // public string ImportId { get; set; }
        // public string Type { get; set; }
        public static void Fill(Models.Airport entity, ViewModels.Airport airport)
        {
            entity.Id = airport.Id;
            entity.Name = airport.Name;
            entity.IATA = airport.IATA;
            entity.ICAO = airport.ICAO;
            entity.CityId = airport.CityId;
            // entity.ImportId = airport.ImportId;
            //entity.Type = airport.Type;
        }
    }

    public class RouteDto
    {
        public int Id { get; set; }
        public int AirlineId { get; set; }
        public int SourceAirportId { get; set; }
        public int DestinationAirportId { get; set; }


        public int FlightH { get; set; }
        public int FlightM { get; set; }


        // public string ImportId { get; set; }
        // public string Type { get; set; }
        public static void Fill(Models.FlightRoute entity, ViewModels.RouteDto route)
        {
            entity.Id = route.Id;
            entity.SourceAirportId = route.SourceAirportId;
            entity.DestinationAirportId = route.DestinationAirportId;
            entity.AirlineId = route.AirlineId;
            entity.FlightH = route.FlightH;
            entity.FlightM = route.FlightM;
            // entity.ImportId = airport.ImportId;
            //entity.Type = airport.Type;
        }
    }



    public class DelayCodeDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public string Remark { get; set; }
        public int? AirlineId { get; set; }
        public int DelayCategoryId { get; set; }

        public static void Fill(Models.DelayCode entity, ViewModels.DelayCodeDto dc)
        {
            entity.Id = dc.Id;
            entity.Title = dc.Title;
            entity.Code = dc.Code;
            entity.AirlineId = dc.AirlineId;
            entity.Remark = dc.Remark;
            entity.DelayCategoryId = dc.DelayCategoryId;
             
        }
    }
}