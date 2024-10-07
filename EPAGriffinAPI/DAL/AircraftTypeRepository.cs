using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;

namespace EPAGriffinAPI.DAL
{
    public class AircraftTypeRepository : GenericRepository<AircraftType>
    {
        public AircraftTypeRepository(EPAGRIFFINEntities context)
          : base(context)
        {
        }
        public IQueryable<ViewAircraftType> GetViewAircraftTypes()
        {
            return this.GetQuery<ViewAircraftType>();
        }

        public IQueryable<ViewManufacturer> GetViewAircraftManufactureres()
        {
            return this.GetQuery<ViewManufacturer>();
        }


    }
}