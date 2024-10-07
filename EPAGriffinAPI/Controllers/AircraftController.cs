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
using System.Web.Http.ModelBinding;
using EPAGriffinAPI.DAL;
using System.Text;
using System.Configuration;
using Newtonsoft.Json;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AircraftController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/aircrafttypes/all")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewAircraftType> GetAircraftTypes()
        {
            try
            {
                return unitOfWork.AircraftTypeRepository.GetViewAircraftTypes();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }
 
        }

        [Route("odata/manufactureres/all")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewManufacturer> GetAircraftManufactureres()
        {
            try
            {
                return unitOfWork.AircraftTypeRepository.GetViewAircraftManufactureres();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/aircrafts/customer/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewMSN> GetMSNsByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.MSNRepository.GetViewMSNs().Where(q => q.CustomerId == cid);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/aircrafts/customer/type/{cid}/{tid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewMSN> GetMSNsByCustomerTypeId(int cid,int tid)
        {
            try
            {
                return unitOfWork.MSNRepository.GetViewMSNs().Where(q => q.CustomerId == cid && q.AircraftTypeId==tid);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/aircrafts/customer/virtual/type/{cid}/{tid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewMSN> GetVirtualMSNsByCustomerTypeId(int cid, int tid)
        {
            try
            {
                return unitOfWork.MSNRepository.GetViewMSNs().Where(q => q.CustomerId == cid && q.AircraftTypeId == tid && q.isvirtual==true);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/aircrafts/available/customer/type/{cid}/{tid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewMSN> GetRealAvailableMSNsByCustomerTypeId(int cid, int tid)
        {
            try
            {
                if (tid==-1)
                    return unitOfWork.MSNRepository.GetViewMSNs().Where(q => q.CustomerId == cid &&   q.isvirtual == false);
                else
                   return unitOfWork.MSNRepository.GetViewMSNs().Where(q => q.CustomerId == cid && q.AircraftTypeId == tid && q.isvirtual == false);
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
