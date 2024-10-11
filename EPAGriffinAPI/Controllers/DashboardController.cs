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

namespace EPAGriffinAPI.Controllers
{
    public class DashboardController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/dashboard/fuel")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<RptFuelLeg> GetFuelRecoeds()
        {

            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            return unitOfWork.DashboardRepository.GetRptFuelLegs();


        }

        [Route("odata/dashboard/total/{cid}/{mid}")]
       
        // [Authorize]
        public async Task<ViewModels.IDashboard>  GetDashboardLibraryByCustomerId(int cid,int mid)
        {
            try
            {
                ViewModels.IDashboard dto;
                if (mid == 2)
                {
                    dto = await unitOfWork.DashboardRepository.GetDashboardLibrary(cid);
                    return dto;
                }
                if (mid == 1)
                {
                    dto = await unitOfWork.DashboardRepository.GetDashboardProfile(cid);
                    return dto;
                }
                return null;
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }


        [Route("odata/dashboard/app/{cid}/{eid}")]

        // [Authorize]
        public async Task<ViewModels.IDashboard> GetAppDashboard(int cid, int eid)
        {
            try
            {
                ViewModels.IDashboard dto = await unitOfWork.DashboardRepository.GetAppDashboard(cid,eid);
                
                    return dto;
                
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/dashboard/app/ftl/{eid}")]

        // [Authorize]
        public async Task<Models.ViewCrewTime> GetAppDashboardFTL( int eid)
        {
            try
            {
                Models.ViewCrewTime dto = await unitOfWork.DashboardRepository.GetAPPDashboardFTL( eid);

                return dto;

            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/dashboard/flight/{cid}/")]

        // [Authorize]
        public async Task<IHttpActionResult> GetDashboardFlightByCustomerId(int cid, DateTime date)
        {
            date = date.Date;
            var sum = await unitOfWork.FlightRepository.GetFlightsSummary(cid, date);
            
            var result = new
            {
                count = sum.count,
                departed = sum.departed,
                arrived = sum.arrived,
                canceled = sum.canceled,
                redirected = sum.redirected,
                plannedtime = sum.plannedtime,
                actualtime = sum.actualtime,
                delay1 = sum.delay1,
                delay2 = sum.delay2,
                delaytotal = sum.delaytotal,
                delaytotalstr = sum.delaytotalstr,
                paxadult = sum.paxadult,
                paxchild = sum.paxchild,
                paxinfant = sum.paxinfant,
                paxtotal = sum.paxtotal,
                fuel = sum.fuel,
                cargo = sum.cargo,
                topdelays=sum.topdelays,
                paxload = sum.paxload,
            };


            return Ok(result);

        }


        [Route("bi/fuel/monthly/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelMonthlyByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelMonthlyByYear(year);

            return Ok(result);

        }
        [Route("bi/fuel/monthly/types/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelMonthlyTypesByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelTypesByYearNew(year);

            return Ok(result);

        }
        [Route("bi/fuel/monthly/routes/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelMonthlyRoutesByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelRoutesByYearNew(year);

            return Ok(result);

        }
        [Route("bi/fuel/monthly/registers/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelMonthlyRegistersByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelRegistersByYearNew(year);

            return Ok(result);

        }

        [Route("bi/fuel/daily/year/month/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelDailyByYearMonth(string year,string month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelDailyByYearMonth(year,month);

            return Ok(result);

        }
        [Route("bi/fuel/daily/type/year/month/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelDailyTypeByYearMonth(string year, string month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelDailyTypeByYearMonth(year, month);

            return Ok(result);

        }
        [Route("bi/fuel/daily/route/year/month/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelDailyRouteByYearMonth(string year, string month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelDailyRouteByYearMonth(year, month);

            return Ok(result);

        }

        [Route("bi/fuel/daily/register/year/month/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelDailyRegisterByYearMonth(string year, string month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelDailyRegisterByYearMonth(year, month);

            return Ok(result);

        }

        [Route("bi/fuel/routes/year/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelRoutesByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelRoutesYearly(year);

            return Ok(result);

        }

        [Route("bi/fuel/types/year/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelTypesByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelTypesYearly (year);

            return Ok(result);

        }
        [Route("bi/fuel/route/monthly/{year}/{route}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelRouteMonthlyByYear(int year,string route)
        {
            var result = await unitOfWork.DashboardRepository.GetRptFuelRouteMonthly(year,route);

            return Ok(result);

        }
        [Route("bi/fuel/daily/{from}/{to}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptFuelDaily(string from,string to)
        {
            var fromparts = from.Split('-');
            var toparts = to.Split('-');
            var dfrom = (new DateTime(Convert.ToInt32(fromparts[0]), Convert.ToInt32(fromparts[1]), Convert.ToInt32(fromparts[2]))).Date;
            var dto = (new DateTime(Convert.ToInt32(toparts[0]), Convert.ToInt32(toparts[1]), Convert.ToInt32(toparts[2]))).Date;//.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.DashboardRepository.GetRptFuelDaily(dfrom,dto);

            return Ok(result);

        }
        //======   DELAY  ======================//

        [Route("bi/delay/monthly/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayMonthlyByYear(int year )
        {
            var result = await unitOfWork.DashboardRepository.GetRptDelayMonthlyByYear(year);

            return Ok(result);

        }
        [Route("bi/delay/daily/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayDailyByYearMonth(int year,int month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptDelayDailyByYearMonth(year, month);

            return Ok(result);

        }
        [Route("bi/delay/daily/{yms}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayDailyByYMS(string yms)
        {
            var result = await unitOfWork.DashboardRepository.GetRptDelayDailyByYearMonth(yms);

            return Ok(result);

        }
        [Route("bi/delay/items/{year}/{month}/{day}/{cat}/{apt}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayItems(int year, int month,int day,string cat,string apt)
        {
            var result = await unitOfWork.DashboardRepository.GetRptDelayItems(year, month,day,cat,apt);

            return Ok(result);

        }
        [Route("bi/delay/items/{yms}/{cat}/{apt}/{range}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayItemsYMS(string yms, string cat, string apt, int range)
        {
            var result = await unitOfWork.DashboardRepository.GetRptDelayItems(yms, cat, apt,range);

            return Ok(result);

        }
        [Route("bi/delay/categories/monthly/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayCategoriesMonthlyByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptCategoriesDelayMonthlyByYear (year);

            return Ok(result);

        }
        [Route("bi/delay/categories/daily/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayCategoriesDailyByYearMonth(int year,int month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptCategoriesDelayDailyByYearMonth(year,month);

            return Ok(result);

        }

        [Route("bi/delay/categories/daily/{yms}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayCategoriesDailyByYMS(string yms)
        {
            var result = await unitOfWork.DashboardRepository.GetRptCategoriesDelayDailyByYearMonth(yms);

            return Ok(result);

        }
        [Route("bi/delay/airports/daily/{yms}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayAirportsDailyByYMS(string yms)
        {
            var result = await unitOfWork.DashboardRepository.GetRptAirportsDelayDailyByYearMonth(yms);

            return Ok(result);

        }
        [Route("bi/delay/airports/monthly/summary/{yms}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetMonthAirportsDelaySummary(string yms)
        {
            var result = await unitOfWork.DashboardRepository.GetMonthAirportsDelaySummary(yms);

            return Ok(result);

        }
        [Route("bi/delay/categories/monthly/summary/{yms}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetMonthCategoriesSummary(string yms)
        {
            var result = await unitOfWork.DashboardRepository.GetMonthCategoriesSummary(yms);

            return Ok(result);

        }
        [Route("bi/delay/categories")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCategories()
        {
            var result = await unitOfWork.DashboardRepository.GetCatNames();

            return Ok(result);

        }
        [Route("bi/airports")]

        // [Authorize]
        public async Task<IHttpActionResult> GetAirports()
        {
            var result = await unitOfWork.DashboardRepository.GetAirports();

            return Ok(result);

        }
        [Route("bi/delay/categories/daily/ymscat/{ymscat}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayCategoriesDailyByYMSCat(string ymscat)
        {
            var result = await unitOfWork.DashboardRepository.GetRptCategoriesDelayDailyByYearMonthCat(ymscat);

            return Ok(result);

        }

        [Route("bi/delay/technicals/monthly/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayTechnicalsMonthlyByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptTechnicalsDelayMonthlyByYear(year);

            return Ok(result);

        }
        [Route("bi/delay/technicals/daily/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayTechnicalsDailyByYearMonth(int year,int month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptTechnicalsDelayDailyByYearMonth(year,month);

            return Ok(result);

        }


        [Route("bi/delay/airports/monthly/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayAirportsMonthlyByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptAirportsDelayMonthlyByYear(year);

            return Ok(result);

        }
        [Route("bi/delay/airports/daily/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayAirportsDailyByYearMonth(int year,int month)
        {
            var result = await unitOfWork.DashboardRepository.GetRptAirportsDelayDailyByYearMonth(year, month);

            return Ok(result);

        }


        [Route("bi/delay/monthly/cat/airport/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayCatAirportMonthlyByYear(int year)
        {
            var result = await unitOfWork.DashboardRepository.GetRptCatAirportsDelayMonthlyByYear(year,"-","-");

            return Ok(result);

        }
        


        [Route("bi/delay/monthly/cat/airport/{year}/{airport}/{cat}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayCatAirportMonthlyByYear(int year,string airport,string cat)
        {
            var result = await unitOfWork.DashboardRepository.GetRptCatAirportsDelayMonthlyByYear(year,airport,cat);

            return Ok(result);

        }

        [Route("bi/delay/daily/cat/airport/{year}/{month}/{airport}/{cat}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRptDelayCatAirportDailyByYearMonth(int year,int month, string airport, string cat)
        {
            var result = await unitOfWork.DashboardRepository.GetRptCatAirportsDelayDailyByYearMonth(year,month, airport, cat);

            return Ok(result);

        }

        [Route("bi/delay/detail/monthly/airport/{year}/{month}/{apt}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetAirportDelayedFlights(int year, int month,int apt)
        {
            var result = await unitOfWork.DashboardRepository.GetDlyGrpFlights(year, month,apt);

            return Ok(result);

        }

        [Route("bi/delay/detail/monthly/{year}/{month}/{apt}/{min}/{max}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetDelayedFlights(int year, int month, int apt,int min,int max)
        {
            var result = await unitOfWork.DashboardRepository.GetDlyGrpFlights(year, month, apt,min,max);

            return Ok(result);

        }

        [Route("bi/delay/detail/monthly/cat/{year}/{month}/{cat}/{apt}/{min}/{max}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetDlyGrpFlightCats(int year, int month,string cat, int apt, int min, int max)
        {
            var result = await unitOfWork.DashboardRepository.GetDlyGrpFlightCats(year, month,cat,"-", apt, min, max);

            return Ok(result);

        }

        [Route("bi/delay/detail/monthly/cat/reg/{year}/{month}/{cat}/{reg}/{apt}/{min}/{max}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetDlyGrpFlightCats(int year, int month, string cat,string reg, int apt, int min, int max)
        {
            var result = await unitOfWork.DashboardRepository.GetDlyGrpFlightCats(year, month, cat, reg, apt, min, max);

            return Ok(result);

        }

        [Route("bi/delay/detail/flight/{flight}")]
        public async Task<IHttpActionResult> GetFlightDelayDetail(int flight)
        {
            var result = await unitOfWork.DashboardRepository.GetFlightDelays(flight);

            return Ok(result);

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
