using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.OData;
using EPAGriffinAPI.Models;
using System.Web.Http.Description;
using System.Collections.Generic;
using System;
using System.Data.Entity.Validation;
using System.Web.Http.Cors;
using EPAGriffinAPI.DAL;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class GeoController : ODataController
    {
        //EPAGRIFFINEntities db = new EPAGRIFFINEntities();
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/cities/all")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCity> GetCities()
        {
            try
            {
                return unitOfWork.ViewCityRepository.GetQuery();
               // return db.ViewAirports.AsNoTracking();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }




        }

        [Route("odata/countries")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<Country> GetCountries()
        {
            try
            {
                return unitOfWork.CountryRepository.GetQuery();
                // return db.ViewAirports.AsNoTracking();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }




        }

        [Route("odata/cities/country/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCity> GetCitiesByCountry(int cid)
        {
            try
            {
                return unitOfWork.ViewCityRepository.GetQuery().Where(q=>q.CountryId==cid);
                // return db.ViewAirports.AsNoTracking();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }




        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                //db.Dispose();
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
