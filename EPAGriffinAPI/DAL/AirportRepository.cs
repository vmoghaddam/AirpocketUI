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
    public class AirportRepository: GenericRepository<Airport>
    {
        public AirportRepository(EPAGRIFFINEntities context)
            : base(context)
        {
        }

        public IQueryable<ViewAirport> GetViewAirports()
        {
            return this.GetQuery<ViewAirport>();
        }

        public virtual    Airport  GetByName(int id,string name)
        {
            name = name.ToLower();
            return  dbSet.FirstOrDefault (q=>q.Id!=id && q.Name.ToLower()==name);
        }

        public virtual  CustomActionResult  Validate(ViewModels.Airport dto)
        {
            var checkByName =   GetByName(dto.Id, dto.Name);
            if (checkByName != null)
                return Exceptions.getDuplicateException("AIRPORT-01", "Name");

               return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.Airport entity)
        {
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

    }
}