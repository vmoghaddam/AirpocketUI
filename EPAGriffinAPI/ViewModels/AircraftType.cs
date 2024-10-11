using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class AircraftType
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int ManufacturerId { get; set; }
        public string Remark { get; set; }
        public string Manufacturer { get; set; }
    }
}