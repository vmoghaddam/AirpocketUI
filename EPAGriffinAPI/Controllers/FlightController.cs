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
using EPAGriffinAPI.ViewModels;
using RestSharp;
using RestSharp.Authenticators;
using static EPAGriffinAPI.DAL.FlightRepository;
using System.IO;
using System.Web;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    //[FilterIP]
    public class FlightController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        [Route("odata/fdp/log")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFDPLog> GetViewFDPLog()
        {

            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            return unitOfWork.FlightRepository.GetViewFDPLog();


        }

        [Route("odata/flight/crews/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightCrewNewX> GetViewFlightCrews(int id)
        {

            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            return unitOfWork.FlightRepository.GetViewFlightCrewNewXs().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);


        }
        [Route("odata/coords")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<Coord> GetCoords()
        {

            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            return unitOfWork.FlightRepository.GetCoords();


        }
        [Route("odata/coords/last")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetLastCoord()
        {

            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            var coord = await unitOfWork.FlightRepository.GetCoords().OrderByDescending(q => q.Id).FirstOrDefaultAsync();
            return new CustomActionResult(HttpStatusCode.OK, coord);


        }


        [Route("odata/routes")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewRoute> GetViewRoutes()
        {

            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            var result = unitOfWork.FlightRepository.GetViewRoute().OrderBy(q => q.FromAirportIATA).ToList();
            return result.AsQueryable();


        }

        [Route("odata/flight/crews/archive/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightCrewArchive> GetViewFlightCrewsArchive(int id)
        {
            return unitOfWork.FlightRepository.GetViewFlightCrewArchives().Where(q => q.FlightId == id).OrderBy(q => q.GroupOrder);
        }

        [Route("odata/fdr/report")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFDRReport> GetViewFDRReport(DateTime df, DateTime dt, int? from = null, int? to = null, string ip = "", string cpt = "", string fo = "", string regs = "", string types = "")
        {
            var _df = df.Date;
            var _dt = dt.Date;//.AddHours(24);
            var query = from x in unitOfWork.FlightRepository.GetViewFDRReport()
                        where x.STDDay >= _df && x.STDDay <= _dt
                        select x;
            if (from != null)
            {
                query = query.Where(q => q.FromAirport == from);
            }
            if (to != null)
            {
                query = query.Where(q => q.ToAirport == to);
            }
            if (!string.IsNullOrEmpty(ip))
            {
                var ipids = ip.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => ipids.Contains(q.IPId));
            }

            if (!string.IsNullOrEmpty(cpt))
            {
                var cptids = cpt.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => cptids.Contains(q.P1Id));
            }

            if (!string.IsNullOrEmpty(fo))
            {
                var foids = fo.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => foids.Contains(q.P2Id));
            }

            if (!string.IsNullOrEmpty(regs))
            {
                var regids = regs.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => regids.Contains(q.RegisterID));
            }

            if (!string.IsNullOrEmpty(types))
            {
                var typeids = types.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => typeids.Contains(q.TypeId));
            }

            var result = query.OrderBy(q => q.STDDay).ThenBy(q => q.AircraftType).ThenBy(q => q.Register).ThenBy(q => q.STD);

            return result;
        }


        [Route("odata/fin/daily/report")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFin> GetFinDailyReport(DateTime df, DateTime dt, string route = "", string regs = "", string types = "")
        {
            var _df = df.Date;
            var _dt = dt.Date;//.AddHours(24);
            var query = from x in unitOfWork.FlightRepository.GetViewFin()
                        where x.STDDay >= _df && x.STDDay <= _dt
                        select x;

            if (!string.IsNullOrEmpty(route))
            {
                var rids = route.Split('_').ToList();
                query = query.Where(q => rids.Contains(q.Route));
            }



            if (!string.IsNullOrEmpty(regs))
            {
                var regids = regs.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => regids.Contains(q.RegisterID));
            }

            if (!string.IsNullOrEmpty(types))
            {
                var typeids = types.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => typeids.Contains(q.TypeId));
            }

            var result = query.OrderBy(q => q.STDDay).ThenBy(q => q.AircraftType).ThenBy(q => q.Register).ThenBy(q => q.STD);

            return result;
        }


        [Route("odata/fin/monthly/report/{yf}/{yt}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetFinMonthlyReport(int yf, int yt)
        {
            var result = await unitOfWork.FlightRepository.GetFinMonthlyReport(yf, yt);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/reg/flights/monthly/report/{year}/{month}/{fleet}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetRegFlightsMonthlyReport(int year, int month, string fleet)
        {
            var result = await unitOfWork.FlightRepository.GetRegFlightMonthlyReport(year, month, fleet);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/flights/monthly/report/{year}")]
        public async Task<IHttpActionResult> GetRegFlightsYearlyReport(int year)
        {
            var result = await unitOfWork.FlightRepository.GetFlightMonthlyReport(year);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        //[Route("odata/crew/fixtime/monthly/report/{year}/{month}/{rank}")]

        //// [Authorize]
        //public async Task<IHttpActionResult> GetCrewFixTimeMonthlyReport(int year, int month,string rank)
        //{
        //    var result = await unitOfWork.FlightRepository.GetCrewFixTimeMonthlyReport(year, month,rank);
        //    return new CustomActionResult(HttpStatusCode.OK, result);
        //}

        [Route("odata/crew/fixtime/period/report/{year}/{period}/{rank}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReport(int year, string period, string rank)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReport(year, period, rank);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }



        [Route("odata/crew/fixtime/period/report/daily/{from}/{to}/{rank}/{cid}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportDaily(string from, string to, string rank, int cid)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReportDaily(from, to, rank, cid);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/crew/fixtime/create")]

        // [Authorize]
        public async Task<IHttpActionResult> GetreateFixTime()
        {
            var result = await unitOfWork.FlightRepository.CreateFixTimeRoute();
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/crew/fixtime/period/report/crew/{year}/{period}/{crew}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportCrew(int year, string period, int crew)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReportCrew(year, period, crew);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/crew/fixtime/period/report/crew/daily/{crew}/{from}/{to}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportCrewDaily(int crew, string from, string to)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReportCrewDaily(from, to, crew);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/crew/fixtime/period/report/crew/nofdp/{year}/{period}/{crew}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportCrewNoFDP(int year, string period, int crew)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReportCrewNoFDP(year, period, crew);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/crew/fixtime/period/report/crew/nofdp/daily/{crew}/{from}/{to}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportCrewNoFDPDaily(int crew, string from, string to)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReportCrewNoFDPDaily(from, to, crew);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        //GetCrewFixTimePeriodReportCrewOther
        [Route("odata/crew/fixtime/period/report/crew/other/{year}/{period}/{crew}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportCrewOther(int year, string period, int crew)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReportCrewOther(year, period, crew);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/crew/fixtime/period/report/crew/other/daily/{crew}/{from}/{to}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportCrewOtherDaily(int crew, string from, string to)
        {
            var result = await unitOfWork.FlightRepository.GetCrewFixTimePeriodReportCrewOtherDaily(from, to, crew);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/crew/fixtime/period/report/nofdp/{year}/{period}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetCrewFixTimePeriodReportNoFDP(int year, string period)
        {
            var result = await unitOfWork.FlightRepository.GetFixTimeExtraList(year, period);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/fixtime/routes")]
        //mimi
        // [Authorize]
        public async Task<IHttpActionResult> GetFixTimeRoutes()
        {
            var result = await unitOfWork.FlightRepository.GetFixTimeRoutes();
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/fixtime/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFixTime(dynamic dto)
        {
            // return Ok(client);
            var route = Convert.ToString(dto.route);
            var hh = Convert.ToInt32(dto.hh);
            var mm = Convert.ToInt32(dto.mm);
            var edit = Convert.ToInt32(dto.edit) == 1;
            var userName = Convert.ToString(dto.userName);


            var result = await unitOfWork.FlightRepository.saveFixTime(route, hh, mm, userName, edit);

            return Ok(result);
        }

        [Route("odata/fixtime/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFixTimeDelete(dynamic dto)
        {
            // return Ok(client);
            var route = Convert.ToString(dto.route);
            var userName = Convert.ToString(dto.userName);

            var result = await unitOfWork.FlightRepository.deleteFixTime(route, userName);

            return Ok(result);
        }


        [Route("odata/flight/nocrews")]
        //mimi
        // [Authorize]
        public async Task<IHttpActionResult> GetNoCrews()
        {
            var result = await unitOfWork.FlightRepository.GetNoCrews();
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/forma/{yf}/{yt}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetFormAReport(int yf, int yt)
        {
            var result = await unitOfWork.FlightRepository.GetFormAReport(yf, yt);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/forma/month/{year}/{month}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetFormAReportMonth(int year, int month)
        {
            var result = await unitOfWork.FlightRepository.GetFormAReportMonth(year, month);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }



        [Route("odata/forma/yearly/{yf}/{yt}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetFormAYearlyReport(int yf, int yt)
        {
            var result = await unitOfWork.FlightRepository.GetFormAYearlyReport(yf, yt);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/forma/year/{year}")]

        // [Authorize]
        public async Task<IHttpActionResult> GetFormAReportYear(int year)
        {
            var result = await unitOfWork.FlightRepository.GetFormAReportYear(year);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        //magu5
        [Route("odata/delays/flight/summary")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetDelaysFlightSummary(DateTime df, DateTime dt)
        {

            var result = await unitOfWork.FlightRepository.GetRptDelayReportFlightSummary(dt, df);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }
        [Route("odata/delays/report")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightDelay> GetDelaysReport(DateTime df, DateTime dt, string route = "", string regs = "", string types = "", string flts = "", string cats = "", int range = 1)
        {
            var _df = df.Date;
            var _dt = dt.Date;//.AddHours(24);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.STDDay >= _df && x.STDDay <= _dt
                        select x;
            if (!string.IsNullOrEmpty(cats))
            {
                var cts = cats.Split('_').ToList();
                query = query.Where(q => cts.Contains(q.MapTitle2));
            }
            if (!string.IsNullOrEmpty(route))
            {
                var rids = route.Split('_').ToList();
                query = query.Where(q => rids.Contains(q.Route));
            }



            if (!string.IsNullOrEmpty(regs))
            {
                var regids = regs.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => regids.Contains(q.RegisterID));
            }

            if (!string.IsNullOrEmpty(types))
            {
                var typeids = types.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
                query = query.Where(q => typeids.Contains(q.TypeId));
            }
            //malakh
            if (!string.IsNullOrEmpty(flts))
            {
                var fltids = flts.Split(',').Select(q => q.Trim().Replace(" ", "")).ToList();
                query = query.Where(q => fltids.Contains(q.FlightNumber));
            }

            switch (range)
            {
                case 1:

                    break;
                case 2:
                    query = query.Where(q => q.Delay <= 30);
                    break;
                case 3:
                    query = query.Where(q => q.Delay > 30);
                    break;
                case 4:
                    query = query.Where(q => q.Delay >= 31 && q.Delay <= 60);
                    break;
                case 5:
                    query = query.Where(q => q.Delay >= 61 && q.Delay <= 120);
                    break;
                case 6:
                    query = query.Where(q => q.Delay >= 121 && q.Delay <= 180);
                    break;
                case 7:
                    query = query.Where(q => q.Delay >= 181);
                    break;
                default: break;
            }





            var result = query.OrderBy(q => q.STDDay).ThenBy(q => q.AircraftType).ThenBy(q => q.Register).ThenBy(q => q.STD);

            return result;
        }

        //noob
        //monk
        [Route("odata/delays/periodic/reportold/{period}/{cats}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetDelaysReport(DateTime df, DateTime dt, int period, string cats)
        {
            var _cats = cats.Split('_').ToList();
            var result = await unitOfWork.FlightRepository.GetRptDelayReportPeriodic(dt, df, period, _cats);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }
        [Route("odata/delays/periodic/report/{period}/{cats}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetDelaysReport2(DateTime df, DateTime dt, int period, string cats,int range)
        {
            var _cats = cats.Split('_').ToList();
            //var result = await unitOfWork.FlightRepository.GetRptDelayReportPeriodic2(dt, df, period, _cats,range);
            var result = await unitOfWork.FlightRepository.GetRptDelayReportPeriodicInt(dt, df, period, _cats, range);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/delays/periodic/report/int/{period}/{cats}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetDelaysReport2Int(DateTime df, DateTime dt, int period, string cats, int range)
        {
            var _cats = cats.Split('_').ToList();
            var result = await unitOfWork.FlightRepository.GetRptDelayReportPeriodicInt2(dt, df, period, _cats, range);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }

        [Route("odata/delays/report/airports")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetDelaysAirportReport(DateTime df, DateTime dt)
        {

            var result = await unitOfWork.FlightRepository.GetDelaysAirportReport(df, dt);
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/delays/mapped")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetDelaysMapped()
        {

            var result = await unitOfWork.FlightRepository.GetDelayMapTitles();
            return new CustomActionResult(HttpStatusCode.OK, result);
        }


        [Route("odata/citypair/report")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFinMonthlyRoute> GetCityPairReport(int year, int month, int? dom = -1)
        {

            var query = from x in unitOfWork.FlightRepository.GetViewFinMonthlyRoute()
                        where x.Year == year && x.Month == month
                        select x;

            if (dom == 1)
                query = query.Where(q => q.IsDom == true);
            if (dom == 0)
                query = query.Where(q => q.IsDom == false);


            return query;
        }
        [Route("odata/citypair/yearly/report")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFinYearlyRoute> GetCityPairYearlyReport(int year)
        {

            var query = from x in unitOfWork.FlightRepository.GetViewFinYearlyRoute()
                        where x.Year == year
                        select x;




            return query;
        }

        [Route("odata/crew/flights")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetCrewsFlights(DateTime dt)
        {

            var day = dt.Date;
            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            var result = await unitOfWork.FlightRepository.GetCrewFlights(day);
            return Ok(result);

        }

        public class ReportResult
        {
            public List<ViewFlightInformation> DS1 { get; set; }
            public List<ViewFlightInformation> DS2 { get; set; }
        }

        [Route("odata/report/test")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetReportTest()
        {
            var flights = await unitOfWork.FlightRepository.GetViewFlights().OrderBy(q => q.STDDay).Take(50).ToListAsync();
            var result = new List<ReportResult>();
            for (int i = 1; i <= 3; i++)
            {
                result.Add(new ReportResult()
                {
                    DS1 = flights.Skip((i - 1) * 7).Take(7).ToList(),
                    DS2 = flights.Skip((i - 1) * 7).Take(7).ToList(),
                });
            }

            result.Add(new ReportResult()
            {
                DS1 = flights.OrderByDescending(q => q.STDDay).Take(3).ToList(),
                DS2 = flights.OrderByDescending(q => q.STDDay).Take(3).ToList(),
            });

            return Ok(result);

        }

        [Route("odata/flight/change/history/{id}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetFlightChangeHistory(int id)
        {
            var result = await unitOfWork.FlightRepository.GetViewFlightChangeHistories().Where(q => q.FlightId == id).OrderBy(q => q.Date).ToListAsync();


            return Ok(result);

        }

        [Route("odata/flight/crews/new/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightCrewNewX> GetViewFlightCrewsNew(int id)
        {

            return unitOfWork.FlightRepository.GetViewFlightCrewNewXs().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);

        }

        [Route("odata/flight/fdps/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightFDP> GetViewFlightFDPs(int id)
        {

            return unitOfWork.FlightRepository.GetViewFlightFDPs().Where(q => q.FlightId == id).OrderBy(q => q.DutyStart);

        }


        [Route("odata/flights/actypes/{customer}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightsAcType> GetViewFlightsAcTypes(int customer)
        {

            return unitOfWork.FlightRepository.GetViewFlightsAcTypes().Where(q => q.CustomerId == customer);

        }

        [Route("odata/flights/routes/airline/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightRoute> GetViewFlightRoutes(int id)
        {

            return unitOfWork.FlightRepository.GetViewFlightRoutes();
            //.Where(q => q.AirlineId == id);

        }


        [Route("odata/routes/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostRoute(ViewModels.RouteDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var result = (FlightRoute)await unitOfWork.FlightRepository.AddRoute(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = result.Id;
            return Ok(dto);
        }

        [Route("odata/routes/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteAirport(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            await unitOfWork.FlightRepository.DeleteRoute(id);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(true);
        }
        //bana
        [Route("odata/crew/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrew> GetViewCrew(int cid)
        {

            return unitOfWork.FlightRepository.GetViewCrew().Where(q => q.CustomerId == cid);

        }


        [Route("odata/dispatch/sms/employees/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewDispatchSMSEmployee> GetViewDispatchSMSEmployee(int cid)
        {

            return unitOfWork.FlightRepository.GetViewDispatchSMSEmployee().Where(q => q.CustomerId == cid);

        }

        //bana
        [Route("odata/crew/valid/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewValid> GetViewValidCrew(int cid)
        {

            return unitOfWork.FlightRepository.GetViewCrewValid();

        }

        //sharon
        [Route("odata/roster/crew/valid/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewValidFTL> GetViewCrewValidFTL(int cid, DateTime dt)
        {

            return unitOfWork.FlightRepository.GetValidCrewForRoster(cid, dt);

        }

        [Route("odata/ftl/crew/{crewId}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetFTLByCrew(int crewId, DateTime dt)
        {
            //afrang
            var _dt = dt.Date;
            var result = await unitOfWork.FlightRepository.GetViewDayDutyFlight().Where(q => q.CrewId == crewId && q.Date == _dt).FirstOrDefaultAsync();
            return Ok(result);

        }

        [Route("odata/crew/dutyflight")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewDayDutyFlight> GetViewDayDutyFlight(DateTime df)
        {
            df = df.Date;
            return unitOfWork.FlightRepository.GetViewDayDutyFlight().Where(q => q.Date == df);

        }
        [Route("odata/crew/ordered/group/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrew> GetViewCrewGroupOrderd(int cid)
        {

            return unitOfWork.FlightRepository.GetViewCrew().Where(q => q.CustomerId == cid).OrderBy(q => q.GroupOrder).ThenBy(q => q.ScheduleName);

        }
        [Route("odata/crew/cabin/ordered/group/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrew> GetViewCrewCabinGroupOrderd(int cid)
        {

            return unitOfWork.FlightRepository.GetViewCrew().Where(q => q.CustomerId == cid && q.JobGroupCode.StartsWith("00102")).OrderBy(q => q.GroupOrder).ThenBy(q => q.ScheduleName);

        }
        [Route("odata/crew/cockpit/ordered/group/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrew> GetViewCrewcockpitGroupOrderd(int cid)
        {

            return unitOfWork.FlightRepository.GetViewCrew().Where(q => q.CustomerId == cid && q.JobGroupCode.StartsWith("00101")).OrderBy(q => q.GroupOrder).ThenBy(q => q.ScheduleName);

        }


        //
        [Route("odata/crew/valid/cabin/ordered/group/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrew> GetViewCrewCabinGroupOrderdValid(int cid)
        {

            return unitOfWork.FlightRepository.GetViewCrew().Where(q => q.CustomerId == cid && q.JobGroupCode.StartsWith("00102") && q.IsValid == true).OrderBy(q => q.GroupOrder).ThenBy(q => q.ScheduleName);

        }
        [Route("odata/crew/valid/cockpit/ordered/group/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrew> GetViewCrewcockpitGroupOrderdValid(int cid)
        {

            return unitOfWork.FlightRepository.GetViewCrew().Where(q => q.CustomerId == cid && q.JobGroupCode.StartsWith("00101") && q.IsValid == true).OrderBy(q => q.GroupOrder).ThenBy(q => q.ScheduleName);

        }
        //

        [Route("odata/fdps/cabin/{year}/{month}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewDutyFDPDetail> GetViewDutyFDPDetailCabin(int year, int month)
        {

            return unitOfWork.FlightRepository.GetViewDutyFDPDetail().Where(q => q.DateStartYear == year && (q.DateStartMonth == month || q.DateEndMonth == month) && q.JobGroupCode.StartsWith("00102"));

        }
        [Route("odata/fdps/cockpit/{year}/{month}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewDutyFDPDetail> GetViewDutyFDPDetailCockpit(int year, int month)
        {

            return unitOfWork.FlightRepository.GetViewDutyFDPDetail().Where(q => q.DateStartYear == year && (q.DateStartMonth == month || q.DateEndMonth == month) && q.JobGroupCode.StartsWith("00101"));

        }

        //doolmask
        [Route("odata/fdp/crew/{crewid}/{year}/{month}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFDPRest> GetViewFDP(int crewid, int year, int month)
        {

            return unitOfWork.FlightRepository.GetViewFDPRest().Where(q => q.CrewId == crewid && q.DateStartYear == year && q.DateStartMonth == month);

        }

        [Route("odata/fdp/{year}/{month}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFDP> GetViewFDPYearMonth(int year, int month)
        {

            return unitOfWork.FlightRepository.GetViewFDP().Where(q => q.DateStartYear == year && q.DateStartMonth == month && q.CrewId == null);

        }

        [Route("odata/route/{from}/{to}")]
        [EnableQuery]
        // [Authorize]
        public IHttpActionResult GetViewFlightRoute(int from, int to)
        {


            var result = unitOfWork.FlightRepository.GetViewFlightRoutes().Where(q => q.FromAirportId == from && q.ToAirportId == to).FirstOrDefault();
            return Ok(result);

        }
        //nono
        [Route("odata/fuel/report/")]
        [EnableQuery]

        public IQueryable<ViewFlightFuel> GetViewFlightFuel(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date;
            var result = unitOfWork.FlightRepository.GetViewFlightFuel().Where(q => q.Date >= df && q.Date <= dt).ToList();
            return result.AsQueryable();

        }

        [Route("odata/app/fuel/report/")]
        [EnableQuery]

        public IQueryable<AppFuel> GetAppFlightFuel(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date;
            var result = unitOfWork.FlightRepository.GetAppFlightFuel().Where(q => q.STDDay >= df && q.STDDay <= dt).ToList();
            return result.AsQueryable();

        }


        [Route("odata/crew/report/main")]
        [EnableQuery]

        public IQueryable<ViewCrewTimeDetail> GetViewCrewTimeDetails(DateTime date, string jc)
        {
            date = date.Date;
            var result = unitOfWork.FlightRepository.GetViewCrewTimeDetail().Where(q => q.CDate == date);
            if (!string.IsNullOrEmpty(jc))
            {
                result = result.Where(q => q.JobGroupCode.StartsWith(jc));
            }
            return result.OrderBy(q => q.JobGroupCode).ThenBy(q => q.Name);

        }

        [Route("odata/roster/daily/crew")]
        [EnableQuery]

        public IQueryable<ViewRotserDailyCrew> GetRosterDaily(DateTime date)
        {
            date = date.Date;
            var result = unitOfWork.FlightRepository.GetViewRotserDailyCrew().Where(q => q.DepartureLocal == date).OrderBy(q => q.JobGroupCode).ThenBy(q => q.GroupOrder).ToList();

            return result.AsQueryable();

        }
        [Route("odata/roster/daily/crew/flight/{id}")]
        [EnableQuery]

        public IQueryable<ViewDailyRosterFlight> GetRosterDailyFlights(DateTime date, int id)
        {
            date = date.Date;
            var result = unitOfWork.FlightRepository.GetViewDailyRosterFlight().Where(q => q.DepartureDate == date && q.CrewId == id).OrderBy(q => q.DepartureLocal).ToList();

            return result.AsQueryable();

        }
        //report flight
        [Route("odata/flight/report/security")]
        [EnableQuery]

        public IQueryable<ViewFlightSecurity> GetFlightReportSecurity(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date;
            var result = unitOfWork.FlightRepository.GetViewFlightSecurity().Where(q => q.STDDay >= df && q.STDDay <= dt);

            return result.OrderBy(q => q.STD);

        }
        [Route("odata/flight/report/security/dh")]
        [EnableQuery]

        public IQueryable<ViewFlightSecurityDH> GetFlightReportSecurityDH(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date;
            var result = unitOfWork.FlightRepository.GetViewFlightSecurityDH().Where(q => q.STDDay >= df && q.STDDay <= dt && (q.IP != null
            || q.CPT != null
            || q.CPT2 != null
            || q.FO != null
            || q.FO2 != null
            || q.Safety != null
            || q.OBSP1 != null
            || q.OBSP2 != null
            || q.IP2 != null
            || q.ISCCM != null
            || q.Purser != null
            || q.Purser2 != null
            || q.Purser3 != null
            || q.FA1 != null
             || q.FA2 != null
              || q.FA3 != null
               || q.FA4 != null
               || q.CACheck1 != null
                 || q.CACheck2 != null
                   || q.CACheck3 != null
                   || q.CACheck4 != null
                   || q.CAOBS1 != null
                    || q.CAOBS2 != null
                     || q.CAOBS3 != null
                      || q.CAOBS4 != null
            ));

            return result.OrderBy(q => q.STD);

        }


        [Route("odata/crew/ip")]
        [EnableQuery]
        //nookp
        public IQueryable<ViewCrewCode> GetCrewIPs()
        {
            var ips = unitOfWork.FlightRepository.GetViewCrewCode().Where(q => q.JobGroupCode == "0010103" || q.JobGroupCode == "0010104" || q.JobGroupCode == "0010105");
            return ips;

        }

        [Route("odata/crew/captain")]
        [EnableQuery]
        //nookp
        public IQueryable<ViewCrewCode> GetCrewCaptains()
        {
            var ips = unitOfWork.FlightRepository.GetViewCrewCode().Where(q => q.JobGroupCode == "0010101" || q.JobGroupCode == "0010103" || q.JobGroupCode == "0010104"
             || q.JobGroupCode == "0010105");
            return ips;

        }

        [Route("odata/crew/fo")]
        [EnableQuery]
        //nookp
        public IQueryable<ViewCrewCode> GetCrewFos()
        {
            var ips = unitOfWork.FlightRepository.GetViewCrewCode().Where(q => q.JobGroupCode == "0010102" || q.JobGroupCode == "0010103" || q.JobGroupCode == "0010104"
             || q.JobGroupCode == "0010105" || q.JobGroupCode == "0010101");
            return ips;

        }

        [Route("odata/report/flights")]
        [EnableQuery]
        //nookp
        public IQueryable<ViewFlightCockpit> GetFlightCockpit(DateTime? df, DateTime? dt, int? ip, int? cpt, int? status)
        {
            //nooz
            //this.context.Database.CommandTimeout = 160;
            df = df != null ? ((DateTime)df).Date : DateTime.MinValue.Date;
            dt = dt != null ? ((DateTime)dt).Date : DateTime.MaxValue.Date;
            var query = from x in unitOfWork.FlightRepository.GetViewFlightCockpit()
                            // where x.FlightStatusID != 1 && x.FlightStatusID != 4
                        select x;
            query = query.Where(q => q.STDDay >= df && q.STDDay <= dt);
            if (ip != null)
                query = query.Where(q => q.IPId == ip);
            if (cpt != null)
                query = query.Where(q => q.CaptainId == cpt);
            if (status != null)
            {
                //       { Id: 1, Title: 'Done' },
                //{ Id: 2, Title: 'Scheduled' },
                //{ Id: 3, Title: 'Canceled' },
                //{ Id: 4, Title: 'Starting' },
                // { Id: 5, Title: 'All' },
                List<int> sts = new List<int>();
                switch ((int)status)
                {
                    case 1:
                        sts.Add(15);
                        sts.Add(3);
                        query = query.Where(q => sts.Contains(q.FlightStatusID));
                        break;
                    case 2:
                        sts.Add(1);
                        query = query.Where(q => sts.Contains(q.FlightStatusID));
                        break;
                    case 3:
                        sts.Add(4);
                        query = query.Where(q => sts.Contains(q.FlightStatusID));
                        break;
                    case 4:
                        sts.Add(20);
                        sts.Add(21);
                        sts.Add(22);
                        sts.Add(4);
                        sts.Add(2);
                        sts.Add(23);
                        sts.Add(24);
                        sts.Add(25);
                        query = query.Where(q => sts.Contains(q.FlightStatusID));

                        break;
                    case 5:
                        break;
                    default:
                        break;
                }
            }
            var result = query.OrderBy(q => q.STD).ToList();

            // return result.OrderBy(q => q.STD);
            return result.AsQueryable();

        }
        [Route("odata/flights/plan/item/permits/{id}/{calanderId}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlanItemPermit> GetViewFlightPlanItemPermit(int id, int calanderId)
        {

            return unitOfWork.FlightRepository.GetViewFlightPlanItemPermits().Where(q => q.Id == id && q.CalanderId == calanderId);

        }

        [Route("odata/flights/plan/permits/{id}/{calanderId}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlanItemPermit> GetViewFlightPlanPermit(int id, int calanderId)
        {

            return unitOfWork.FlightRepository.GetViewFlightPlanItemPermits().Where(q => q.FlightPlanId == id && q.CalanderId == calanderId);

        }



        [Route("odata/flights/plan/permits/")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<FlightPermit> GetPlanPermits()
        {

            return unitOfWork.FlightRepository.GetFlightPermits();

        }


        [Route("odata/flights/{cid}/{airport}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightInformation> GetViewFlights(int cid, int airport)
        {

            var flightsQuery = unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid);
            if (airport != -1)
                flightsQuery = flightsQuery.Where(q => q.FromAirport == airport || q.ToAirport == airport);
            return flightsQuery;

        }
        [Route("odata/flights/grouped/{cid}/{from}/{to}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetFlightsGrouped(int cid, string from, string to)
        {

            var result = await this.unitOfWork.FlightRepository.GetFlightsGrouped(cid, from, to);
            return Ok(result);

        }

        [Route("odata/flights/register/{cid}/{airport}/{register}/{from}/{to}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightInformation> GetViewFlightsByRegister(int cid, int airport, int register, string from, string to)
        {

            var flightsQuery = unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.RegisterID == register);
            if (airport != -1)
                flightsQuery = flightsQuery.Where(q => q.FromAirport == airport || q.ToAirport == airport);
            if (from != "-1" && to != "-1")
            {
                DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormatUTC(from).Date;
                DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormatUTC(to).Date.AddHours(23).AddMinutes(59).AddSeconds(59).AddMilliseconds(999);
                flightsQuery = flightsQuery.Where(q => q.STA >= dateFrom && q.STA <= dateTo);
            }
            return flightsQuery;

        }


        [Route("odata/flights/irregular/{cid}/{airport}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightInformation> GetViewIrregularFlights(int cid, int airport)
        {

            var flightsQuery = unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.FlightPlanId == null);
            if (airport != -1)
                flightsQuery = flightsQuery.Where(q => q.FromAirport == airport || q.ToAirport == airport);
            return flightsQuery;

        }
        [Route("odata/flights/{cid}/{airport}/{std}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightInformation> GetViewFlights(int cid, int airport, string std)
        {
            DateTime dateSTD = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormatUTC(std).Date;
            DateTime dateStD2 = dateSTD.AddHours(23).AddMinutes(59).AddSeconds(59).AddMilliseconds(999);
            var flightsQuery = unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STDDay >= dateSTD && q.STDDay <= dateStD2);
            if (airport != -1)
                flightsQuery = flightsQuery.Where(q => q.FromAirport == airport || q.ToAirport == airport);
            return flightsQuery;

        }
        [Route("odata/flights/abnormal/{cid}/{airport}/{std}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightInformation> GetViewAbnormalFlights(int cid, int airport, string std)
        {
            DateTime dateSTD = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormatUTC(std).Date;
            DateTime dateStD2 = dateSTD.AddHours(23).AddMinutes(59).AddSeconds(59).AddMilliseconds(999);
            var flightsQuery = unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STDDay >= dateSTD && q.STDDay <= dateStD2
             && (q.FlightStatusID == 4 || q.FlightStatusID == 7 || q.FlightStatusID == 17 || q.RedirectReasonId != null)
            );
            if (airport != -1)
                flightsQuery = flightsQuery.Where(q => q.FromAirport == airport || q.ToAirport == airport);
            return flightsQuery;

        }
        [Route("odata/flightplans/registers/assigned/{id}/{tzoffset}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlighPlanAssignedRegister> GetViewFlightPlanRegisterAssigneds(int id, int tzoffset)
        {

            var result = unitOfWork.FlightRepository.GetViewFlightPlanAssignedRegisters().Where(q => q.FlightPlanId == id).ToList();
            foreach (var x in result)
            {
                x.STA = ((DateTime)x.STA).AddMinutes(tzoffset);
                x.STD = ((DateTime)x.STD).AddMinutes(tzoffset);
            }
            return result.AsQueryable();

        }

        [Route("odata/flights/routes/destination/airline/{id}/{from}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightRoute> GetViewFlightRoutesDestination(int id, int from)
        {

            return unitOfWork.FlightRepository.GetViewFlightRoutes().Where(q => q.AirlineId == id && q.FromAirportId == from);

        }
        [Route("odata/flights/routes/from/airline/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewRouteFromAirport> GetViewRouteFromAirport(int id)
        {

            return unitOfWork.FlightRepository.GetViewRouteFromAirport().Where(q => q.AirlineId == id);

        }
        [Route("odata/flights/registers/{customer}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightsRegister> GetViewFlightsRegisters(int customer)
        {

            return unitOfWork.FlightRepository.GetViewFlightsRegisters().Where(q => q.CustomerId == customer);

        }
        [Route("odata/flights/from/{customer}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightsFrom> GetViewFlightsFrom(int customer)
        {

            return unitOfWork.FlightRepository.GetViewFlightsFrom().Where(q => q.CustomerId == customer);

        }
        [Route("odata/flights/to/{customer}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightsTo> GetViewFlightsTo(int customer)
        {

            return unitOfWork.FlightRepository.GetViewFlightsTo().Where(q => q.CustomerId == customer);

        }

        [Route("odata/flights/delaycodes")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewDelayCode> GetFlightDelayCodes()
        {

            var result = unitOfWork.FlightRepository.GetViewDelayCodes().OrderBy(q => q.DelayCategoryId).ThenBy(q => q.CodeNumber).ThenBy(q => q.Code).ToList();
            return result.AsQueryable();




        }
        [Route("odata/flights/delaycodes/{id}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetFlightDelayCode(int id)
        {
            try
            {
                var result = await unitOfWork.FlightRepository.GetViewDelayCodes().FirstOrDefaultAsync(q => q.Id == id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/flights/delaycodecats")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<DelayCodeCategory> GetFlightDelayCodeCats()
        {
            try
            {
                var result = unitOfWork.FlightRepository.GetDelayCodeCategory().OrderBy(q => q.Id).ThenBy(q => q.Title).ToList();
                return result.AsQueryable();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/delaycodes/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostDelayCode(ViewModels.DelayCodeDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var validate = unitOfWork.FlightRepository.ValidateDelayCode(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;
            var result = (DelayCode)await unitOfWork.FlightRepository.AddDelayCode(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = result.Id;
            return Ok(dto);
        }

        [Route("odata/delaycodes/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteDelayCode(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            await unitOfWork.FlightRepository.DeleteDelayCode(id);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(true);
        }
        //nook


        [Route("odata/flights/delaycodes/{flightId}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightDelayCode> GetFlightDelayCodes(int flightId)
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewFlightDelayCode(flightId).OrderBy(q => q.DelayCodeId);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }


        [Route("odata/flights/customer/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightInformation> GetFlightsByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/flights/box/{bid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightInformation> GetFlightsByBoxId(int bid)
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewFlights().Where(q => q.BoxId == bid).OrderBy(q => q.STD);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/flight/{id}/{tzoffset}")]
        public async Task<IHttpActionResult> GetViewFlightDto(int id, int tzoffset)
        {
            var flight = await unitOfWork.FlightRepository.GetViewFlights().FirstOrDefaultAsync(q => q.ID == id);
            if (flight == null)
                return NotFound();
            var dto = ViewModels.ViewFlightInformationDto.GetDto(flight, tzoffset);


            return Ok(dto);
        }
        [Route("odata/cp/flight/{id}/{tzoffset}")]
        public async Task<IHttpActionResult> GetViewFlightCP(int id, int tzoffset)
        {
            var flight = await unitOfWork.FlightRepository.GetViewFlights().FirstOrDefaultAsync(q => q.ID == id);
            if (flight == null)
                return NotFound();
            // var dto = ViewModels.ViewFlightInformationDto.GetDto(flight, tzoffset);
            flight.ChocksIn = flight.ChocksIn == null ? null : (Nullable<DateTime>)((DateTime)flight.ChocksIn).AddMinutes(tzoffset);
            flight.Landing = flight.Landing == null ? null : (Nullable<DateTime>)((DateTime)flight.Landing).AddMinutes(tzoffset); ;
            flight.Takeoff = flight.Takeoff == null ? null : (Nullable<DateTime>)((DateTime)flight.Takeoff).AddMinutes(tzoffset);
            flight.ChocksOut = flight.ChocksOut == null ? null : (Nullable<DateTime>)((DateTime)flight.ChocksOut).AddMinutes(tzoffset);
            flight.STD = flight.STD == null ? null : (Nullable<DateTime>)((DateTime)flight.STD).AddMinutes(tzoffset);
            flight.STA = flight.STA == null ? null : (Nullable<DateTime>)((DateTime)flight.STA).AddMinutes(tzoffset);

            return Ok(flight);
        }

        [Route("odata/crew/summary/{id}")]
        public async Task<IHttpActionResult> GetCrewSummary(int id)
        {

            var result = await unitOfWork.FlightRepository.GetCrewSummary(id);


            return Ok(result.data);
        }


        [Route("odata/flightplans/customer/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlan> GetFlightPlansByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/flightplans/calendar/{cid}/{type}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlanCalander> GetFlightPlansCalendarByCustomerId(int cid, int type)
        {

            try
            {
                switch (type)
                {
                    case -1:
                        return unitOfWork.FlightRepository.GetViewFlightPlansCalendar().Where(q => q.CustomerId == cid);
                    case 50:
                        return unitOfWork.FlightRepository.GetViewFlightPlansCalendar().Where(q => q.CustomerId == cid && q.IsApproved50 == 1);
                    case 60:
                        return unitOfWork.FlightRepository.GetViewFlightPlansCalendar().Where(q => q.CustomerId == cid && q.IsApproved60 == 1);
                    case 70:
                        return unitOfWork.FlightRepository.GetViewFlightPlansCalendar().Where(q => q.CustomerId == cid && q.IsApproved70 == 1);
                    default:
                        return null;
                }

            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }


        }


        [Route("odata/flight/plans/items/calendar/{cid}/{type}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlanItemCalander> GetFlightPlanItemsCalendarByCustomerId(int cid, int type)
        {

            try
            {
                switch (type)
                {
                    case -1:
                        return unitOfWork.FlightRepository.GetViewFlightPlanItemsCalander().Where(q => q.CustomerId == cid);
                    case 50:
                        return unitOfWork.FlightRepository.GetViewFlightPlanItemsCalander().Where(q => q.CustomerId == cid && q.IsApproved50 == 1);
                    case 60:
                        return unitOfWork.FlightRepository.GetViewFlightPlanItemsCalander().Where(q => q.CustomerId == cid && q.IsApproved60 == 1);
                    case 70:
                        return unitOfWork.FlightRepository.GetViewFlightPlanItemsCalander().Where(q => q.CustomerId == cid && q.IsApproved70 == 1);
                    default:
                        return null;
                }

            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }


        }


        [Route("odata/flightplans/opened/customer/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlan> GetOpenedFlightPlansByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid && q.IsApproved50 == 0);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }





        [Route("odata/flightplans/items/opened/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlanItem> GetOpenedFlightPlanItemsByCustomerId(int cid)
        {
            try
            {
                var xxxxxx = unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.CustomerId == cid && q.IsApproved50 == 0).ToList();
                //return unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.CustomerId == cid && q.IsApproved50 == 0);
                return xxxxxx.AsQueryable();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/flightplans/approved/customer/{cid}/{type}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlan> GetFlightPlansByCustomerId(int cid, int type)
        {
            try
            {
                switch (type)
                {
                    case -1:
                        return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid);
                    case 50:
                        return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid && q.IsApproved50 == 1);
                    case 60:
                        return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid && q.IsApproved60 == 1);
                    case 70:
                        return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid && q.IsApproved70 == 1);
                    default:
                        return null;
                }

            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        //gati
        [Route("odata/plan/items/approved/{cid}/{type}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlanItem> GetFlightPlanItemsByCustomerId(int cid, int type)
        {
            try
            {
                switch (type)
                {
                    case -1:
                        // return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid);
                        return unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.CustomerId == cid);
                    case 50:
                        // return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid && q.IsApproved50 == 1);
                        return unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.CustomerId == cid && q.IsApproved50 == 1);

                    case 60:
                        // return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid && q.IsApproved60 == 1);
                        return unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.CustomerId == cid && q.IsApproved60 == 1);
                    case 70:
                        // return unitOfWork.FlightRepository.GetViewFlightPlans().Where(q => q.CustomerId == cid && q.IsApproved70 == 1);
                        return unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.CustomerId == cid && q.IsApproved70 == 1);
                    default:
                        return null;
                }

            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/flightplan/base/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightPlanBase(dynamic dto)
        {
            var cid = Convert.ToInt32(dto.CustomerId);
            var date = ((DateTime)dto.Date).Date;
            var register = Convert.ToInt32(dto.RegisterId);
            var result = await unitOfWork.FlightRepository.GetPlanBase(cid, date, register);
            return Ok(result.data);
        }

        [Route("odata/flightplan/last/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightPlanLastItem(dynamic dto)
        {
            var cid = Convert.ToInt32(dto.CustomerId);
            var date = ((DateTime)dto.Date).Date;
            var register = Convert.ToInt32(dto.RegisterId);
            var offset = Convert.ToInt32(dto.Offset);
            var result = await unitOfWork.FlightRepository.GetPlanLastItem(cid, date, register, offset);
            return Ok(result);
        }
        //dook
        [Route("odata/flightplan/last/id")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightPlanLastItemById(dynamic dto)
        {

            var id = Convert.ToInt32(dto.Id);
            var offset = Convert.ToInt32(dto.Offset);
            var result = await unitOfWork.FlightRepository.GetPlanLastItem(id, offset);
            return Ok(result);
        }
        [Route("odata/flightplan/items/")]
        [AcceptVerbs("POST", "GET")]
        public IHttpActionResult GetFlightPlanItems(dynamic dto)
        {
            var cid = Convert.ToInt32(dto.CustomerId);
            var date = ((DateTime)dto.Date).Date;
            var register = Convert.ToInt32(dto.RegisterId);
            var offset = Convert.ToInt32(dto.Offset);
            var result = unitOfWork.FlightRepository.GetPlanItems(cid, date, register, offset);
            return Ok(result);
        }
        [Route("odata/flightplan/items/id")]
        [AcceptVerbs("POST", "GET")]
        public IHttpActionResult GetFlightPlanItemsById(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);

            var offset = Convert.ToInt32(dto.Offset);
            var result = unitOfWork.FlightRepository.GetPlanItemsById(id, offset);
            return Ok(result);
        }

        [Route("odata/flightplan/{id}")]

        public async Task<IHttpActionResult> GetFlightPlan(int id)
        {
            var result = await unitOfWork.FlightRepository.GetFlightPlanById(id);
            return Ok(result);
        }
        [Route("odata/flight/plan/item/{id}/{tzoffset}")]

        public async Task<IHttpActionResult> GetFlightPlanItem(int id, int tzoffset)
        {
            var x = await unitOfWork.FlightRepository.GetViewFlightPlanItems().FirstOrDefaultAsync(q => q.Id == id);
            if (x == null)
                return NotFound();
            x.STA = ((DateTime)x.STA).AddMinutes(tzoffset);
            x.STD = ((DateTime)x.STD).AddMinutes(tzoffset);
            return Ok(x);
        }
        [Route("odata/plan/item/{id}/{tzoffset}")]

        public async Task<IHttpActionResult> GetPlanItemBoard(int id, int tzoffset)
        {
            ViewPlanItem x = await unitOfWork.FlightRepository.GetViewPlanItemsBoard().FirstOrDefaultAsync(q => q.Id == id);
            if (x == null)
                return NotFound();
            // x.STA = ((DateTime)x.STA).AddMinutes(tzoffset);
            // x.STD = ((DateTime)x.STD).AddMinutes(tzoffset);
            return Ok(x);
        }
        [Route("odata/flightplan/summary/{id}/{tzoffset}")]
        public async Task<IHttpActionResult> GetFlightPlanSummary(int id, int tzoffset)
        {
            var result = await unitOfWork.FlightRepository.GetFlightPlanSummary(id, tzoffset);
            return Ok(result);
        }
        [Route("odata/flightplan/view/{id}")]
        public async Task<IHttpActionResult> GetViewFlightPlan(int id)
        {
            var _plan = await unitOfWork.FlightRepository.GetViewFlightPlans().FirstOrDefaultAsync(q => q.Id == id);
            var ms = await unitOfWork.FlightRepository.GetFlightPlanMonth(id);
            var ds = await unitOfWork.FlightRepository.GetFlightPlanDays(id);
            dynamic result = new { plan = _plan, Month = ms, Days = ds };


            return Ok(result);
        }

        [Route("odata/plan/checkerrors/{id}")]
        public IHttpActionResult GetFlightPlanErrors(int id)
        {
            var errors = unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.FlightPlanId == id && q.StatusId != 1).Count();
            var firstFlight = unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.FlightPlanId == id).OrderBy(q => q.STD).FirstOrDefault();
            var lastflight = unitOfWork.FlightRepository.GetViewFlightPlanItems().Where(q => q.FlightPlanId == id).OrderByDescending(q => q.STD).FirstOrDefault();
            var plan = unitOfWork.FlightRepository.GetViewFlightPlans().FirstOrDefault(q => q.Id == id);
            if (firstFlight.FromAirport != plan.BaseId)
                errors++;
            if (lastflight.ToAirport != plan.BaseId)
                errors++;


            return Ok(errors);
        }


        [Route("odata/flights/updated/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByCustomerId(dynamic dto)
        {


            var result = await unitOfWork.FlightRepository.GetUpdatedFlights(
                 (int)dto.airport,
                 (DateTime)dto.baseDate,
                 (DateTime)dto.from,
                 (DateTime)dto.to,
                 (int)dto.customer,
                 (int)dto.tzoffset,
                 (int)dto.userid
                );
            var data = result.data;
            return Ok(data);
        }

        [Route("odata/flights/updated/new/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByCustomerIdNew(dynamic dto)
        {


            var result = await unitOfWork.FlightRepository.GetUpdatedFlightsNew(
                 (int)dto.airport,
                 (DateTime)dto.baseDate,
                 (DateTime)dto.from,
                 (DateTime)dto.to,
                 (int)dto.customer,
                 (int)dto.tzoffset,
                 (int)dto.userid
                );
            var data = result.data;
            return Ok(data);
        }


        [Route("odata/plan/gantt/customer/{cid}/{from}/{to}/{tzoffset}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetPlanGanttByCustomerId(int cid, string from, string to, int tzoffset)
        {
            DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);
            var result = await unitOfWork.FlightRepository.GetPlanGantt2(cid, dateFrom, dateTo, tzoffset, null, null);
            return Ok(result);
        }

        //fuckc
        [Route("odata/flights/gantt/customer/{cid}/{from}/{to}/{tzoffset}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByCustomerId(int cid, string from, string to, int tzoffset)
        {

            DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);
            //var result = await unitOfWork.FlightRepository.GetFlightGantt(cid, dateFrom, dateTo, tzoffset, null, null);
            //GetFlightGanttFleet
            var result = await unitOfWork.FlightRepository.GetFlightGanttFleet(cid, dateFrom, dateTo, tzoffset, null, null);
            return Ok(result);
        }
        [Route("odata/flights/gantt/utc/customer/{cid}/{from}/{to}/{tzoffset}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByCustomerIdUTC(int cid, string from, string to, int tzoffset)
        {
            DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);
            //var result = await unitOfWork.FlightRepository.GetFlightGantt(cid, dateFrom, dateTo, tzoffset, null, null);
            //GetFlightGanttFleet
            var result = await unitOfWork.FlightRepository.GetFlightGanttFleet(cid, dateFrom, dateTo, tzoffset, null, null, 1);
            return Ok(result);
        }


        [Route("odata/flights/gantt/{fids}/{tzoffset}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByFlights(string fids, int tzoffset)
        {
            //DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            // DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);
            var result = await unitOfWork.FlightRepository.GetFlightGantt(fids, tzoffset);
            return Ok(result);
        }

        [Route("odata/flights/gantt/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByFlights2(dynamic filter)
        {
            int tzoffset = Convert.ToInt32(filter.tzoffset);
            string fids = Convert.ToString(filter.fids);
            //DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            // DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);
            var result = await unitOfWork.FlightRepository.GetFlightGantt(fids, tzoffset);
            return Ok(result);
        }


        [Route("odata/board/summary/{cid}/{year}/{month}/{day}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetBoardSummary(int cid, int year, int month, int day)
        {
            var date = new DateTime(year, month, day);
            var result = await unitOfWork.FlightRepository.GetBoardSummary(date.Date);
            return Ok(result);
        }

        [Route("odata/delayed/check/{user}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetDelayedCheck(string user)
        {

            var result = await unitOfWork.FlightRepository.FindDelayedFlights(user);
            return Ok(result);
        }

        [Route("odata/board/summary/total/{cid}/{year}/{month}/{day}/{year2}/{month2}/{day2}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetBoardSummaryTotal(int cid, int year, int month, int day, int year2, int month2, int day2)
        {
            var date = new DateTime(year, month, day);
            var date2 = new DateTime(year2, month2, day2);
            var result = await unitOfWork.FlightRepository.GetBoardSummaryTotal(date.Date, date2.Date);
            return Ok(result);
        }

        [Route("odata/flights/gantt/customer/{cid}/{from}/{to}/{tzoffset}/{airport}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByCustomerId(int cid, string from, string to, int tzoffset, int airport, int utc
            , ViewModels.FlightsFilter filter)
        {
            DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);
            var result = await unitOfWork.FlightRepository.GetFlightGantt(cid, dateFrom, dateTo, tzoffset, airport, filter, utc);
            return Ok(result);
        }

        [Route("odata/flights/gantt2/customer/{cid}/{from}/{to}/{tzoffset}/{airport}/{utc}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightsGanttByCustomerId2(int cid, string from, string to, int tzoffset, int airport, int utc
            , ViewModels.FlightsFilter filter)
        {
            DateTime dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            DateTime dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);
            var result = await unitOfWork.FlightRepository.GetFlightGantt(cid, dateFrom, dateTo, tzoffset, airport, filter, utc);
            return Ok(result);
        }

        [Route("odata/flightplanitems/gantt/plan/{pid}/{tzoffset}")]
        public async Task<IHttpActionResult> GetFlightPlanItemsGanttByPlanId(int pid, int tzoffset)
        {
            var result = await unitOfWork.FlightRepository.GetPlanGantt(pid, tzoffset);
            return Ok(result);
        }

        [Route("odata/plan/items/gantt/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightPlanItemsGanttByPlanId(dynamic dto)
        {
            //DateTime date, int tzoffset,bool design,int cid
            var cid = Convert.ToInt32(dto.CustomerId);
            var date = ((DateTime)dto.Date).Date;
            var tzoffset = Convert.ToInt32(dto.Offset);
            var design = Convert.ToBoolean(dto.Design);

            var result = await unitOfWork.FlightRepository.GetPlanItemsGantt(date, tzoffset, design, cid);
            return Ok(result);
        }
        //xati
        [Route("odata/plan/items/gantt/crewtest/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightPlanItemsGanttByPlanIdCrewTest(dynamic dto)
        {
            //DateTime date, int tzoffset,bool design,int cid
            var cid = Convert.ToInt32(dto.CustomerId);
            var date = ((DateTime)dto.Date).Date;
            var dateTo = ((DateTime)dto.DateTo).Date;
            var tzoffset = Convert.ToInt32(dto.Offset);
            var design = Convert.ToBoolean(dto.Design);
            var planid = Convert.ToInt32(dto.PlanId);
            //  var result = await unitOfWork.FlightRepository.GetPlanItemsGanttCrewTest(date, tzoffset, design, cid,planid);
            // var result = await unitOfWork.FlightRepository.GetPlanItemsGanttCrewTestByFlights(date, dateTo, tzoffset, design, cid, planid);
            var result = await unitOfWork.FlightRepository.GetAssignCrewFlights(date, dateTo, tzoffset, design, cid, planid);

            return Ok(result);
        }

        [Route("odata/plan/items/gantt/crew/assign/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlightPlanItemsGanttByPlanIdCrewAssign(dynamic dto)
        {
            //DateTime date, int tzoffset,bool design,int cid
            var cid = Convert.ToInt32(dto.CustomerId);
            var date = ((DateTime)dto.Date).Date;
            var dateTo = ((DateTime)dto.DateTo).Date;
            var tzoffset = Convert.ToInt32(dto.Offset);
            var design = Convert.ToBoolean(dto.Design);
            var planid = Convert.ToInt32(dto.PlanId);
            //  var result = await unitOfWork.FlightRepository.GetPlanItemsGanttCrewTest(date, tzoffset, design, cid,planid);
            // var result = await unitOfWork.FlightRepository.GetPlanItemsGanttCrewTestByFlights(date, dateTo, tzoffset, design, cid, planid);
            var result = await unitOfWork.FlightRepository.GetAssignCrewFlightsReg(date, dateTo, tzoffset, design, cid, planid);

            return Ok(result);
        }


        [Route("odata/fights/")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFlights(dynamic dto)
        {
            //DateTime date, int tzoffset,bool design,int cid
            var cid = Convert.ToInt32(dto.CustomerId);
            var date = ((DateTime)dto.Date).Date;
            var dateTo = ((DateTime)dto.DateTo).Date;
            var tzoffset = Convert.ToInt32(dto.Offset);

            //  var result = await unitOfWork.FlightRepository.GetPlanItemsGanttCrewTest(date, tzoffset, design, cid,planid);
            // var result = await unitOfWork.FlightRepository.GetPlanItemsGanttCrewTestByFlights(date, dateTo, tzoffset, design, cid, planid);
            var result = await unitOfWork.FlightRepository.Getflights(date, dateTo, tzoffset, cid);

            return Ok(result);
        }

        [Route("odata/crew/fdp/assigned/{fdp}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCrewAssignFDP> GetViewCrewAssignFDP(int fdp)
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewCrewAssignFDP().Where(q => q.TemplateId == fdp);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }


        [Route("odata/fdp/children/{id}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetFDPChildren(int id)
        {
            var result = await unitOfWork.FlightRepository.GetFDPChildren(id);

            return Ok(result);
        }
        //NotifyFDPCrews
        [Route("odata/fdp/notify/{id}")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> NotifyFDPCrews(int id)
        {
            var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);

            return Ok(result);
        }

        [Route("odata/notify/roster/daily")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> NotifyRosterDaily(dynamic dto)
        {
            //var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);
            var day = Convert.ToDateTime(dto.Day).Date;
            var str = (string)(dto.Ids);
            var ids = str.Split('_').Select(q => Convert.ToInt32(q)).ToList();
            var _test = Convert.ToInt32(dto.Test);
            var result = await unitOfWork.FlightRepository.NotifyRosterDaily(day, ids, _test == 1);
            await unitOfWork.SaveAsync();
            return Ok(true);
        }

        [Route("odata/notify/delay/{id}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> NotifyDelayedFlight(int id)
        {
            //var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);

            var result = await unitOfWork.FlightRepository.NotifyDelayedFlight(id);
            //await unitOfWork.SaveAsync();
            return Ok(true);
        }

        [Route("odata/notify/delay2/{id}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> NotifyDelayedFlight2(int id)
        {
            //var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);

            var result = await unitOfWork.FlightRepository.NotifyDelayedFlight2(id);
            //await unitOfWork.SaveAsync();
            return Ok(true);
        }

        [Route("odata/smsgroup/add/{name}/{mobile}/{type}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> AddSMSGroup(string name, string mobile, int type)
        {
            //var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);

            var result = await unitOfWork.FlightRepository.AddSMSGroup(name, mobile, type);
            //await unitOfWork.SaveAsync();
            return Ok(result);
        }

        [Route("odata/smsgroup/delete/{mobile}/{type}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> AddSMSGroup(string mobile, int type)
        {
            //var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);

            var result = await unitOfWork.FlightRepository.DeleteSMSGroup(mobile, type);
            //await unitOfWork.SaveAsync();
            return Ok(result);
        }
        //internal async Task<dynamic> NotifyDelayedFlight2(int id,string from,string to,string no,int h,int m)
        [Route("odata/notify/delay2/{id}/{from}/{to}/{no}/{h}/{m}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> NotifyDelayedFlight2(int id, string from, string to, string no, int h, int m)
        {
            //var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);

            var result = await unitOfWork.FlightRepository.NotifyDelayedFlight2(id, from, to, no, h, m);
            //await unitOfWork.SaveAsync();
            return Ok(true);
        }
        [Route("odata/notify/delay3/{id}/{from}/{to}/{no}/{h}/{m}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> NotifyDelayedFlight3(int id, string from, string to, string no, int h, int m)
        {
            //var result = await unitOfWork.FlightRepository.NotifyFDPCrews(id);

            var result = await unitOfWork.FlightRepository.NotifyDelayedFlight3(id, from, to, no, h, m);
            //await unitOfWork.SaveAsync();
            return Ok(true);
        }
        [Route("odata/crew/assign/valid/{fdp}/{isvalid}/{cockpit}")]
        [AcceptVerbs("POST", "GET")]
        public IHttpActionResult GetValidCrewForFDP(int fdp, int isvalid, int cockpit)
        {
            //00101 cockpit
            var result = unitOfWork.FlightRepository.GetValidCrewForFDP(fdp, isvalid, cockpit);

            return Ok(result);
        }
        [Route("odata/fdp/assign/valid/{pid}/{year}/{month}")]
        [AcceptVerbs("POST", "GET")]
        public IHttpActionResult GetValidFDPForCrew(int pid, int year, int month)
        {
            //00101 cockpit
            var result = unitOfWork.FlightRepository.GetValidFDPForCrew(pid, year, month);

            return Ok(result);
        }
        [Route("odata/fdp/assign/valid/{pid}/{year}/{month}/{day}")]
        [AcceptVerbs("POST", "GET")]
        public IHttpActionResult GetValidFDPForCrewDay(int pid, int year, int month, int day)
        {
            //00101 cockpit
            var result = unitOfWork.FlightRepository.GetValidFDPForCrew(pid, year, month, day);

            return Ok(result);
        }
        [Route("odata/fdp/isrerrpvalid/{pid}")]
        [AcceptVerbs("POST", "GET")]
        [EnableQuery]

        public IHttpActionResult IsRERRPValid(DateTime start, DateTime end, int pid)
        {
            var result = unitOfWork.FlightRepository.IsRERRPValid(pid, start, end);

            return Ok(result);

        }

        [Route("odata/fdp/isevent/{pid}/{type}")]
        [AcceptVerbs("POST", "GET")]
        [EnableQuery]

        public IHttpActionResult IsEventValid(DateTime start, DateTime end, int pid, int type)
        {
            var result = unitOfWork.FlightRepository.IsEventValid(pid, start, end, type);

            return Ok(result);

        }
        //hasrat
        [Route("odata/crew/assign/fdp")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostAssignFDPToCrew(dynamic dto)
        {
            var fdp = Convert.ToInt32(dto.fdp);
            var crew = Convert.ToInt32(dto.crew);
            var position = Convert.ToInt32(dto.position);
            var stby = Convert.ToInt32(dto.stby);

            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = (FDP)await unitOfWork.FlightRepository.AssignFDPToCrew(fdp, crew, position, stby);
            if (result == null)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var matchError = await unitOfWork.FlightRepository.GetFDPMatchingListError((int)result.TemplateId);
            var rs = new
            {
                fdp = result,
                matchingError = matchError,
            };
            return Ok(rs);
        }

        [Route("odata/crews/assign/fdp")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostAssignFDPToCrews(List<ViewModels.FDPCrew> dto)
        {


            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = await unitOfWork.FlightRepository.AssignFDPToCrews(dto);
            //  if (result == null)
            //      return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            //var matchError = await unitOfWork.FlightRepository.GetFDPMatchingListError((int)result.TemplateId);
            //var rs = new
            //{
            //    fdp = result,
            //    matchingError = matchError,
            //};
            return Ok(true);
        }
        [Route("odata/crew/assign/fdp2")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostAssignFDPToCrew2(dynamic dto)
        {
            var fdp = Convert.ToInt32(dto.fdp);
            var crew = Convert.ToInt32(dto.crew);
            var position = Convert.ToInt32(dto.position);
            var stby = Convert.ToInt32(dto.stby);

            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = (FDP)await unitOfWork.FlightRepository.AssignFDPToCrew(fdp, crew, position, stby);
            if (result == null)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var view = await unitOfWork.FlightRepository.GetViewFDP().FirstOrDefaultAsync(q => q.Id == result.Id);

            return Ok(view);
        }
        //boos
        [Route("odata/crew/assign/fdp2/detail")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostAssignFDPToCrew2Detail(dynamic dto)
        {
            var fdp = Convert.ToInt32(dto.fdp);
            var crew = Convert.ToInt32(dto.crew);
            var position = Convert.ToInt32(dto.position);
            var stby = Convert.ToInt32(dto.stby);

            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = (FDP)await unitOfWork.FlightRepository.AssignFDPToCrew(fdp, crew, position, stby);
            if (result == null)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var view = await unitOfWork.FlightRepository.GetViewDutyFDPDetail().Where(q => q.FDPId == result.Id).ToListAsync();

            return Ok(view);
        }

        [Route("odata/crew/assign/fdp/position")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUpdateFDPPosition(dynamic dto)
        {
            var fdp = Convert.ToInt32(dto.fdp);

            var position = Convert.ToInt32(dto.position);

            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = await unitOfWork.FlightRepository.UpdateFDPPosition(fdp, position);
            if (!string.IsNullOrEmpty(result))
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);
        }

        [Route("odata/aogs/{id}")]
        [EnableQuery]

        public IQueryable<ViewRegisterGround> GetAOG(int id)
        {

            var result = unitOfWork.FlightRepository.GetViewRegisterGround().Where(q => q.RegisterId == id);

            return result.OrderBy(q => q.DateFrom);

        }

        [Route("odata/aog/save")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostSaveAog(dynamic dto)
        {

            var result = (RegisterGround)unitOfWork.FlightRepository.AddAog(dto);

            if (result == null)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var view = await unitOfWork.FlightRepository.GetViewRegisterGround().FirstOrDefaultAsync(q => q.Id == result.Id);

            return Ok(view);
        }


        [Route("odata/duty/save")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostSaveDuty(dynamic dto)
        {

            var result = (FDP)unitOfWork.FlightRepository.AddDuty(dto);

            if (result == null)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            //var view = await unitOfWork.FlightRepository.GetViewFDPRest().FirstOrDefaultAsync(q => q.Id == result.Id);
            var view = await unitOfWork.FlightRepository.GetViewCrewDuty().FirstOrDefaultAsync(q => q.Id == result.Id);

            return Ok(view);
        }
        [Route("odata/duty/save/detail")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostSaveDutyDetail(dynamic dto)
        {

            var result = (FDP)unitOfWork.FlightRepository.AddDuty(dto);

            if (result == null)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var view = await unitOfWork.FlightRepository.GetViewDutyFDPDetail().Where(q => q.FDPId == result.Id).ToListAsync();

            return Ok(view);
        }
        [Route("odata/fdp/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostDeleteFDP(dynamic dto)
        {
            var fdp = Convert.ToInt32(dto.fdp);



            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = await unitOfWork.FlightRepository.DeleteFDP(fdp);
            //if (!string.IsNullOrEmpty(result))
            //   return new CustomActionResult(HttpStatusCode.NotAcceptable, result);
            var templateId = Convert.ToInt32(result);


            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            //var matchError = (int)await unitOfWork.FlightRepository.GetFDPMatchingListError(templateId);
            //var rs = new
            //{
            //    matchingError = matchError,
            //};

            //return Ok(rs);
            return Ok(result);
        }

        public class DeletedFDPs
        {
            public List<int> Ids { get; set; }
        }
        [Route("odata/fdps/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostDeleteFDPs(DeletedFDPs dto)
        {



            var result = await unitOfWork.FlightRepository.DeleteFDPs(dto.Ids);


            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(result);
        }

        [Route("odata/aog/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostDeleteAOG(dynamic dto)
        {
            var Id = Convert.ToInt32(dto.Id);

            var result = await unitOfWork.FlightRepository.DeleteAOG(Id);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);
        }


        [Route("odata/fdpitems/onoff")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostOnOffFDPItems(List<ViewModels.FDPItemOFFDto> fdps)
        {

            var result = unitOfWork.FlightRepository.OnOffFDPItems(fdps);
            if (!string.IsNullOrEmpty(result))
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);
        }



        [Route("odata/plan/items/box")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostBoxItems(dynamic dto)
        {
            List<int> ids = JsonConvert.DeserializeObject<List<int>>(JsonConvert.SerializeObject(dto.ids));
            // int cid = Convert.ToInt32(dto.cid);

            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = await unitOfWork.FlightRepository.boxFlights(ids, true);//unitOfWork.FlightRepository.boxFlights(ids, cid);
            if (!string.IsNullOrEmpty(result))
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);
        }

        [Route("odata/fdp/create")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCreateFDP(dynamic dto)
        {
            List<int> ids = JsonConvert.DeserializeObject<List<int>>(JsonConvert.SerializeObject(dto.ids));
            List<int> posIds = JsonConvert.DeserializeObject<List<int>>(JsonConvert.SerializeObject(dto.posIds));
            int cid = Convert.ToInt32(dto.cid);

            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = (FDP)await unitOfWork.FlightRepository.boxFlights2(ids, posIds);//unitOfWork.FlightRepository.boxFlights(ids, cid);
            if (result == null)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, result);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);
        }


        [Route("odata/plan/items/unbox")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUnBoxItems(dynamic dto)
        {
            var id = Convert.ToInt32(dto.id);
            //  var result = await unitOfWork.FlightRepository.unboxPlanItems(id);
            var result = await unitOfWork.FlightRepository.unboxFlights(id);


            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);
        }

        [Route("odata/flightplanitems/plan/{pid}/{tzoffset}")]
        public IQueryable<ViewFlightPlanItem> GetFlightPlanItemsByPlanId(int pid, int tzoffset)
        {

            return unitOfWork.FlightRepository.GetViewFlightPlanItems(pid).OrderBy(q => q.TypeId).ThenBy(q => q.Register).ThenBy(q => q.STD);
        }
        [Route("odata/flights/routes/averagetime/{from}/{to}")]
        public async Task<IHttpActionResult> GetRouteAverageTime(int from, int to)
        {
            var result = await unitOfWork.FlightRepository.GetFlightAVG(from, to);
            return Ok(result);
        }


        [Route("odata/flightplan/apply/customer/{cid}/{id}")]

        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> PostApplyPlan(int cid, int id)
        {

            var result = await unitOfWork.FlightRepository.ApplyPlan(id, cid);
            if (result.Code != HttpStatusCode.OK)
                return result;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(id);
        }
        [Route("odata/flightplan/close/{id}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> PostClosePlan(int id)
        {

            var result = await unitOfWork.FlightRepository.CloseFlightPlan(id);
            if (result.Code != HttpStatusCode.OK)
                return result;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(id);
        }
        [Route("odata/flightplan/approve/60/{id}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> PostApprovePlan60(int id)
        {

            var result = await unitOfWork.FlightRepository.ApproveFlightPlan(id, 60);
            if (result.Code != HttpStatusCode.OK)
                return result;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(id);
        }
        [Route("odata/flightplan/approve/70/{id}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> PostApprovePlan70(int id)
        {

            var result = await unitOfWork.FlightRepository.ApproveFlightPlan(id, 70);
            if (result.Code != HttpStatusCode.OK)
                return result;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(id);
        }
        [Route("odata/flightplan/register/overlaps/{pid}/{vid}/{rid}/{from?}/{to?}")]
        [AcceptVerbs("POST", "GET")]
        public async Task<IHttpActionResult> GetCheckPlanRegister(int pid, int vid, int rid, string from = null, string to = null)
        {
            DateTime? dateFrom = null;
            DateTime? dateTo = null;
            if (!string.IsNullOrEmpty(from))
                dateFrom = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(from);
            if (!string.IsNullOrEmpty(to))
                dateTo = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(to);


            var result = await unitOfWork.FlightRepository.CheckPlanRegister(pid, vid, rid, dateFrom, dateTo);
            // if (result.Code != HttpStatusCode.OK)
            //    return result;
            // var saveResult = await unitOfWork.SaveAsync();
            // if (saveResult.Code != HttpStatusCode.OK)
            //    return saveResult;
            return Ok(result);

        }



        [Route("odata/flightplan/registers/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanRegisters(ViewModels.FlightPlanRegistersSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var items = dto.Items;
            var newItems = unitOfWork.FlightRepository.InsertFlightPlanRegisters(dto.Items, dto.Deleted);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var result = new List<ViewModels.OldNewPair>();
            var c = 0;
            foreach (var x in newItems)
            {
                result.Add(new ViewModels.OldNewPair() { NewId = x.Id, OldId = items[c].Id });
                c++;
            }


            return Ok(result);
        }
        //rati
        [Route("odata/flightplan/register/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanRegister(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var id = Convert.ToInt32(dto.Id);
            var planId = Convert.ToInt32(dto.PlanId);
            var registerId = Convert.ToInt32(dto.RegisterId);
            var virtualId = Convert.ToInt32(dto.VirtualId);
            var date = ((DateTime)dto.Date);
            var CalendarId = Convert.ToInt32(dto.CalendarId);
            var item = unitOfWork.FlightRepository.InsertFlightPlanRegister(id, date, planId, registerId, virtualId, CalendarId);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(item);
        }
        [Route("odata/flightplan/register/lock")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanRegisterLock(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var id = Convert.ToInt32(dto.id);

            FlightPlanRegister item = await unitOfWork.FlightRepository.GetFlightPlanRegisterById(id);
            item.IsLocked = true;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(item);
        }



        [Route("odata/flightplan/register/unlock")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanRegisterUnLock(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var id = Convert.ToInt32(dto.Id);

            FlightPlanRegister item = await unitOfWork.FlightRepository.GetFlightPlanRegisterById(id);
            item.IsLocked = false;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(item);
        }

        [Route("odata/flight/plan/register/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteFlightPlanRegister(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            FlightPlanRegister item = await unitOfWork.FlightRepository.GetFlightPlanRegisterById(id);
            await unitOfWork.FlightRepository.ResetFlightsRegister(item.CalendarId);

            unitOfWork.FlightRepository.Delete(item);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);
        }

        [Route("odata/flightplan/registers/approve")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanRegistersApprove(ViewModels.Dto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.ApproveFlightPlanRegisters(dto.Id);
            if (!result)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, "");
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(true);
        }



        [Route("odata/flightplan/calander/apply")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanCalanderApply(ViewModels.Dto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.ApproveFlightPlanRegisterCalander(dto.Id);
            if (!result)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, "");
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(true);
        }

        [Route("odata/flightplan/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlan(ViewModels.FlightPlanDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            dto.DateFrom = ((DateTime)dto.DateFrom).Date;
            dto.DateTo = ((DateTime)dto.DateTo).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            dto.DateFirst = ((DateTime)dto.DateFirst).Date;
            var validate = unitOfWork.FlightRepository.ValidateFlightPlan(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            FlightPlan entity = null;

            if (dto.Id == -1)
            {
                entity = new FlightPlan();
                unitOfWork.FlightRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.FlightRepository.GetPlanById(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            ViewModels.FlightPlanDto.Fill(entity, dto);

            if (dto.Id != -1)
            {
                unitOfWork.FlightRepository.ClearPlanMonths(dto.Id);
                unitOfWork.FlightRepository.ClearPlanDays(dto.Id);
            }

            if (dto.Months != null)
                foreach (var x in dto.Months)
                    unitOfWork.FlightRepository.Insert(new FlightPlanMonth() { FlightPlan = entity, Month = x });

            if (dto.Days != null)
                foreach (var x in dto.Days)
                    unitOfWork.FlightRepository.Insert(new FlightPlanDay() { FlightPlan = entity, Day = x });

            unitOfWork.FlightRepository.CreatePlanCalendar(dto.Id, entity, dto.Months, dto.Days);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(entity);
        }

        //crewati
        [Route("odata/flights/plan/crew/{id}/{calanderId}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightPlanCalanderCrew> GetViewFlightPlanCalanderCrew(int id, int calanderId)
        {

            return unitOfWork.FlightRepository.GetViewFlightPlanCalanderCrew().Where(q => q.FlightPlanId == id && q.CalanderId == calanderId).OrderBy(q => q.JobGroupCode).ThenBy(q => q.Name);

        }
        [Route("odata/flight/crew/2/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightCrew2> GetFlightViewBoxCrew(int id)
        {

            return unitOfWork.FlightRepository.GetViewFlightCrew2().Where(q => q.FlightId == id).OrderBy(q => q.Position).ThenBy(q => q.Name);

        }


        [Route("odata/crew/report/flights/app/{id}")]
        [EnableQuery]
        //shonosk
        public IHttpActionResult GetCrewFlightsReportApp(DateTime from, DateTime to, int id)
        {
            var query = unitOfWork.FlightRepository.GetCrewFlightsReportApp(from, to, id);
            //this.context.Database.CommandTimeout = 160;
            ////var dfrom = new DateTime(2019, 11, 30);
            ////var dto = (new DateTime(2019, 12, 20)).Date.AddHours(23).AddMinutes(59).AddSeconds(59); //dfrom.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            //var dfrom = from.Date;
            //var dto=to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            //var query = (from x in unitOfWork.FlightRepository.GetViewFlightCrewNews()
            //             join f in unitOfWork.FlightRepository.GetViewFlights() on x.FlightId equals f.ID
            //             where x.CrewId == id && f.STD >= dfrom && f.STD <= dto
            //             //&& x.FlightStatusID==15
            //             orderby f.STD
            //             select new
            //             {
            //                 Date = ((DateTime)f.STD),
            //                 f.FlightNumber,
            //                 x.Position,
            //                 f.FromAirportIATA,
            //                 f.ToAirportIATA,
            //                 STD = f.STD,
            //                 f.STA,
            //                 ChocksIn = f.ChocksIn,
            //                 ChocksOut = f.ChocksOut,
            //                 Takeoff = f.Takeoff,
            //                 Landing = f.Landing,
            //                 //FlightTime = f.FlightH * 60 + f.FlightM,
            //                 f.FlightStatus,
            //                 f.FlightStatusID,
            //                 f.Fixtime,
            //                 f.SITATime,
            //                 f.BlockTime,
            //                 f.FlightTimeActual,
            //                 f.Register,
            //                 f.FlightH,
            //                 f.FlightM,
            //                 Duty = 0,
            //                 ActualFlightHOffBlock = 0,
            //                 ActualFlightMOffBlock = 0,
            //             }).ToList();

            return Ok(query);

        }

        [Route("odata/crew/flights/app/{id}")]
        [EnableQuery]
        //shonosk
        public IHttpActionResult GetCrewFlightsReportAppX(DateTime from, DateTime to, int id)
        {
            var query = unitOfWork.FlightRepository.GetCrewFlightsReportAppX(from, to, id);


            return Ok(query);

        }

        [Route("odata/crew/flights/crew/fdp/{crewid}/{fdpid}")]
        [EnableQuery]
        //shonosk
        public IHttpActionResult GetCrewFlightsReportAppXByFDP(int crewid, int fdpid)
        {
            var query = unitOfWork.FlightRepository.GetCrewFlightsReportAppXByFDP(crewid, fdpid);


            return Ok(query);

        }

        [Route("odata/crew/report/flights/app/grouped/{id}")]
        [EnableQuery]
        //shonosk
        public IHttpActionResult GetCrewFlightsReportAppGrouped(int id)
        {
            var query = unitOfWork.FlightRepository.GetCrewFlightsReportAppGrouped(id);


            return Ok(query);

        }

        //gigi
        public class FlightTimeReport
        {
            public DateTime Date { get; set; }
            public string FlightNumber { get; set; }
            public string Position { get; set; }
            public string FromAirportIATA { get; set; }
            public string ToAirportIATA { get; set; }
            public DateTime? STD { get; set; }
            public DateTime? STA { get; set; }
            public DateTime? ChocksIn { get; set; }
            public DateTime? ChocksOut { get; set; }
            public DateTime? Takeoff { get; set; }
            public DateTime? Landing { get; set; }
            public int? FlightTime { get; set; }
            public int? FlightH { get; set; }
            public int? FlightM { get; set; }
            public int? Duty { get; set; }
            public int? ActualFlightHOffBlock { get; set; }
            public int? ActualFlightMOffBlock { get; set; }
            public double? BlockTime { get; set; }
            public double? ScheduledFlightTime { get; set; }
            public double? FixTime { get; set; }
            public double? SITATime { get; set; }
            public int? FlightId { get; set; }
            public bool? IsPositioning { get; set; }

        }
        //poosk
        [Route("odata/crew/report/flights/{id}")]
        [EnableQuery]

        public IHttpActionResult GetCrewFlightsReport(DateTime from, DateTime to, int id)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = (from x in unitOfWork.FlightRepository.GetViewLegCrew()
                         where x.CrewId == id && x.STDLocal >= dfrom && x.STDLocal <= dto
                         //flypersia
                         //&& x.FlightStatusID != 1 
                         && x.FlightStatusID != 4
                         orderby x.STDLocal
                         select x).ToList();
            //var query = (from x in unitOfWork.FlightRepository.GetViewFlightCrewNews()
            //             join f in unitOfWork.FlightRepository.GetViewFlights() on x.FlightId equals f.ID
            //             where x.CrewId == id && f.STD >= dfrom && f.STD <= dto
            //             && f.FlightStatusID != 1 && f.FlightStatusID != 4
            //             orderby f.STD
            //             select new
            //             {
            //                 Date = ((DateTime)f.STD),
            //                 x.FlightId,
            //                 f.FlightNumber,
            //                 x.Position,
            //                 f.FromAirportIATA,
            //                 f.ToAirportIATA,
            //                 STD = f.STD,
            //                 f.STA,
            //                 ChocksIn = f.ChocksIn,
            //                 ChocksOut = f.ChocksOut,
            //                 Takeoff = f.Takeoff,
            //                 Landing = f.Landing,
            //                 FlightTime = f.FlightH * 60 + f.FlightM,
            //                 f.FlightH,
            //                 f.FlightM,
            //                 Duty = 0,
            //                 ActualFlightHOffBlock = 0,
            //                 ActualFlightMOffBlock = 0,
            //                 f.Arrival,
            //                 f.Departure,
            //                 BlockTime = (x.IsPositioning == true ? 0 : 1) * f.BlockTime,
            //                 ScheduledFlightTime = (x.IsPositioning == true ? 0 : 1) * f.FlightTime,
            //                 FixTime = (x.IsPositioning == true || x.PositionId==1153 ? 0 : 1) * f.FixTime,
            //                 SITATime = (x.IsPositioning == true ? 0 : 1) * f.SITATime,
            //                 x.IsPositioning
            //             }).ToList();
            //var result = new List<FlightTimeReport>();
            //foreach (var f in query)
            //{
            //    var item = new FlightTimeReport()
            //    {
            //        ActualFlightHOffBlock = f.ActualFlightHOffBlock,
            //        ActualFlightMOffBlock = f.ActualFlightMOffBlock,
            //        BlockTime = f.BlockTime, //((DateTime)f.Arrival - (DateTime)f.Departure).TotalMinutes,
            //        ChocksIn = f.ChocksIn,
            //        ChocksOut = f.ChocksOut,
            //        Date = f.Date,
            //        Duty = 0,
            //        FixTime = f.FixTime, //((DateTime)f.STA - (DateTime)f.STD).TotalMinutes,
            //        FlightH = f.FlightH,
            //        FlightM = f.FlightM,
            //        FlightNumber = f.FlightNumber,
            //        FlightTime = f.FlightTime,
            //        FromAirportIATA = f.FromAirportIATA,
            //        Landing = f.Landing,
            //        Position = f.Position,
            //        ScheduledFlightTime = f.ScheduledFlightTime, //((DateTime)f.STA - (DateTime)f.STD).TotalMinutes,
            //        STA = f.STA,
            //        STD = f.STD,
            //        Takeoff = f.Takeoff,
            //        ToAirportIATA = f.ToAirportIATA,
            //        FlightId = f.FlightId,
            //        IsPositioning = f.IsPositioning,
            //        SITATime = f.SITATime,

            //    };
            //    result.Add(item);
            //}

            return Ok(query);

        }



        [Route("odata/crew/report/flights/app2/{id}")]
        [EnableQuery]
        //looi
        public async Task<IHttpActionResult> GetCrewFlightsReportApp2(DateTime from, DateTime to, int id, int? airline = null, int? status = null, int? fromAirport = null, int? toAirport = null)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);

            var result = await unitOfWork.FlightRepository.GetAppFlightsReport2(dfrom, dto, id, airline, status, fromAirport, toAirport);

            return Ok(result);

        }

        [Route("odata/crew/flights/app2/")]
        [EnableQuery]
        //looi
        public async Task<IHttpActionResult> GetCrewFlightsApp2(int id, string dt, string df, int status, int airline, int report, int from, int to)
        ///(DateTime from, DateTime to, int id, int? airline = null, int? status = null, int? fromAirport = null, int? toAirport = null)
        {
            var df_year = Convert.ToInt32(df.Substring(0, 4));
            var df_month = Convert.ToInt32(df.Substring(4, 2));
            var df_day = Convert.ToInt32(df.Substring(6, 2));

            var dt_year = Convert.ToInt32(dt.Substring(0, 4));
            var dt_month = Convert.ToInt32(dt.Substring(4, 2));
            var dt_day = Convert.ToInt32(dt.Substring(6, 2));

            var dateFrom = (new DateTime(df_year, df_month, df_day)).Date;
            var dateTo = (new DateTime(dt_year, dt_month, dt_day)).Date.AddHours(23).AddMinutes(59).AddSeconds(59);



            var result = await unitOfWork.FlightRepository.GetAppFlights2(dateFrom, dateTo, id, airline, status, report, from, to);

            return Ok(result);

        }

        class CrewFlightsTotalReport
        {
            public int? CrewId { get; set; }
            public string Name { get; set; }
            public string ScheduleName { get; set; }
            public string JobGroup { get; set; }
            public string JobGroupCode { get; set; }
            public int? GroupId { get; set; }
            public int GroupOrder { get; set; }
            public int Legs { get; set; }
            public int? BlockTime { get; set; }
            public int? FlightTime { get; set; }
            public int? FlightTimeActual { get; set; }
            public int? FixTime { get; set; }
            public int? SITATime { get; set; }

            public int DH { get; set; }
            public int LayOver { get; set; }
        }
        [Route("odata/crew/report/flights/total/")]
        [EnableQuery]

        public IHttpActionResult GetCrewFlightsTotalReport(DateTime from, DateTime to)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            ///////
            var queryTotal = from x in unitOfWork.FlightRepository.GetViewFlightCrewNewXTime()
                             where x.STDDay >= dfrom && x.STDDay <= dto
                             //flypersia
                             //&& x.FlightStatusID != 1 
                             && x.FlightStatusID != 4
                             group x by new { x.CrewId, x.Name, x.ScheduleName, x.JobGroup, x.JobGroupCode, x.GroupId, x.GroupOrder } into grp
                             select new CrewFlightsTotalReport()
                             {
                                 CrewId = grp.Key.CrewId,
                                 Name = grp.Key.Name,
                                 ScheduleName = grp.Key.ScheduleName,
                                 JobGroup = grp.Key.JobGroup,
                                 JobGroupCode = grp.Key.JobGroupCode,
                                 GroupId = grp.Key.GroupId,
                                 GroupOrder = grp.Key.GroupOrder,
                                 Legs = grp.Count(),
                                 BlockTime = grp.Sum(q => q.BlockTime),
                                 FlightTime = grp.Sum(q => q.FlightTime),
                                 FlightTimeActual = grp.Sum(q => q.FlightTimeActual),
                                 FixTime = grp.Sum(q => q.FixTime),
                                 SITATime = grp.Sum(q => q.SITATime),

                             };
            ///


            /////////////////////////


            var result = queryTotal.OrderBy(q => q.GroupOrder).ThenBy(q => q.ScheduleName).ToList();

            var qdh = (from x in unitOfWork.FlightRepository.GetViewPositioning()
                       where x.STDDay >= dfrom && x.STDDay <= dto
                       group x by new { x.CrewId } into grp
                       select new { grp.Key.CrewId, dh = grp.Count() }).ToList();
            var qlo = (from x in unitOfWork.FlightRepository.GetViewLayOver()
                       where x.STDDay >= dfrom && x.STDDay <= dto && x.IsLayOver == 1
                       group x by new { x.CrewId } into grp
                       select new { grp.Key.CrewId, lo = grp.Count() }).ToList();

            foreach (var x in result)
            {
                var _dh = qdh.FirstOrDefault(q => q.CrewId == x.CrewId);
                var _lo = qlo.FirstOrDefault(q => q.CrewId == x.CrewId);
                x.DH = _dh == null ? 0 : _dh.dh;
                x.LayOver = _lo == null ? 0 : _lo.lo;
            }
            return Ok(result);

        }

        [Route("odata/delays")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightDelay> GetViewFlightDelays()
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewFlightDelays();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/delays2")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightDelay> GetViewFlightDelays2(DateTime? df, DateTime? dt)
        {
            try
            {
                df = df != null ? ((DateTime)df).Date : DateTime.MinValue.Date;
                dt = dt != null ? ((DateTime)dt).Date : DateTime.MaxValue.Date;
                var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                            where x.Code != "93" && x.Date >= df && x.Date <= dt
                            select x;
                return query;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/delays/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFlightDelay> GetViewFlightDelays(int id)
        {
            try
            {
                return unitOfWork.FlightRepository.GetViewFlightDelays().Where(q => q.FlightId == id).OrderByDescending(q => q.DelayHH).ThenByDescending(q => q.DelayMM);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/summary/{cid}")]
        [EnableQuery]
        //gigi
        //public async Task<IHttpActionResult> GetTotalDelaysByCode(DateTime from, DateTime to, int cid)
        public async Task<IHttpActionResult> GetSummary(DateTime from, DateTime to, int cid)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var flights = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && q.FlightStatusID != 6).CountAsync();
            var arrived = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && (q.FlightStatusID == 3 || q.FlightStatusID == 15)).CountAsync();
            var cancled = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && q.FlightStatusID == 4).CountAsync();
            var blockTime = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && q.FlightStatusID != 4).Select(q => q.BlockTime).SumAsync();
            var flightTime = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && q.FlightStatusID != 4).Select(q => q.FlightTime).SumAsync();
            var fixTime = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && q.FlightStatusID != 4).Select(q => q.FixTime).SumAsync();

            //jooji
            //var _delay = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && q.FlightStatusID != 4).Select(q => q.DelayOffBlock).SumAsync();
            var delay = await (from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                               where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.DelayCodeId != 97 && x.FlightStatusID != 4
                               select x.DelayMM).SumAsync();


            var seat = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && (q.FlightStatusID == 3 || q.FlightStatusID == 15)).Select(q => q.TotalSeat).SumAsync();
            var pax = await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.CustomerId == cid && q.STD >= dfrom && q.STA <= dto && (q.FlightStatusID == 3 || q.FlightStatusID == 15)).Select(q => q.TotalPax).SumAsync();
            // delayRatio = Math.Round(summary.Delay * 1.0 / summary.BlockTime, 1, MidpointRounding.AwayFromZero) * 100;
            double? delayRatio = null;
            if (blockTime != 0)
                delayRatio = Math.Round((int)delay * 1.0 / (int)blockTime, 1, MidpointRounding.AwayFromZero) * 100;
            double? paxLoad = null;
            if (seat != 0)
                paxLoad = Math.Round((int)pax * 1.0 / (int)seat, 1, MidpointRounding.AwayFromZero) * 100;
            var result = new
            {
                flights,
                arrived,
                cancled,
                blockTime,
                flightTime,
                fixTime,
                delay,
                seat,
                pax,
                paxLoad,
                delayRatio,
            };
            //var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
            //            where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid
            //            group x by new { x.DelayCodeId, x.Category, x.Title, x.Code, x.DelayCategoryId, x.DelayRemark } into grp
            //            select new
            //            {
            //                grp.Key.DelayCodeId,
            //                grp.Key.Category,
            //                grp.Key.Title,
            //                grp.Key.Code,
            //                grp.Key.DelayCategoryId,
            //                grp.Key.DelayRemark,
            //                Flights = grp.Count(),
            //                TotalDelay = grp.Sum(q => q.DelayMM),
            //                DurationOffBlock = grp.Sum(q => q.ActualFlightHOffBlock * 60 + q.ActualFlightMOffBlock),
            //                DurationTakeOff = grp.Sum(q => q.ActualFlightHTakeoff * 60 + q.ActualFlightMTakeoff)
            //            };
            //var result = query.OrderByDescending(q => q.TotalDelay).ThenBy(q => q.Code);
            //if (skip != null && top != null)
            //    return result.Skip((int)skip).Take((int)top);
            //else
            //if (top != null)
            //    return result.Take((int)top);

            return Ok(result);

        }

        [Route("odata/delays/total/code/{cid}")]
        [EnableQuery]

        //public async Task<IHttpActionResult> GetTotalDelaysByCode(DateTime from, DateTime to, int cid)
        public IQueryable<dynamic> GetTotalDelaysByCode(DateTime from, DateTime to, int cid, int? top = null, int? skip = null)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.DelayCodeId != 97
                        group x by new { x.DelayCodeId, x.Category, x.Title, x.Code, x.DelayCategoryId, x.DelayRemark } into grp
                        select new
                        {
                            grp.Key.DelayCodeId,
                            grp.Key.Category,
                            grp.Key.Title,
                            grp.Key.Code,
                            grp.Key.DelayCategoryId,
                            grp.Key.DelayRemark,
                            Flights = grp.Count(),
                            TotalDelay = grp.Sum(q => q.DelayMM),
                            DurationOffBlock = grp.Sum(q => q.ActualFlightHOffBlock * 60 + q.ActualFlightMOffBlock),
                            DurationTakeOff = grp.Sum(q => q.ActualFlightHTakeoff * 60 + q.ActualFlightMTakeoff)
                        };
            var result = query.OrderByDescending(q => q.TotalDelay).ThenBy(q => q.Code);
            if (skip != null && top != null)
                return result.Skip((int)skip).Take((int)top);
            else
            if (top != null)
                return result.Take((int)top);

            return result;

        }

        [Route("odata/delays/details/code/{cid}/{code}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetTotalDelaysByCodeDetails(DateTime from, DateTime to, int cid, int code)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.DelayCodeId == code
                        select x;
            var result = await query.OrderByDescending(q => q.DelayMM).ThenBy(q => q.FlightNumber).ToListAsync();

            return Ok(result);

        }


        [Route("odata/jldata/{id}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetJLData(int id)
        {
            var result = await unitOfWork.FlightRepository.GetJLData(id);

            return Ok(result);

        }
        [Route("odata/jldata/legs/{legs}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetJLDataByLegs(string legs)
        {
            var ids = legs.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var result = await unitOfWork.FlightRepository.GetJLData(ids);

            return Ok(result);

        }
        [Route("odata/cldata/{id}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetCLData(int id)
        {
            var result = await unitOfWork.FlightRepository.GetCLData(id);

            return Ok(result);

        }

        [Route("odata/cldata/legs/{legs}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetCLDataByLegs(string legs)
        {
            var ids = legs.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var result = await unitOfWork.FlightRepository.GetCLData(ids);

            return Ok(result);

        }
        [Route("odata/line/flights/{id}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetFlightsLine(int id)
        {

            var result = await unitOfWork.FlightRepository.GetFlightsLine(id);

            return Ok(result);

        }
        //GetFDPReportingTime
        [Route("odata/fdps/reporting/{id}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetFDPReportingTime(int id)
        {
            var result = await unitOfWork.FlightRepository.GetFDPReportingTime(id);

            return Ok(result);

        }
        //============================================//

        [Route("odata/delays/total/source/{cid}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetTotalDelaysBySourceAirport(DateTime from, DateTime to, int cid)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.DelayCodeId != 97
                        group x by new { x.FromAirport, x.FromAirportIATA, x.DelayCodeId, x.Category, x.Title, x.Code, x.DelayCategoryId, x.DelayRemark } into grp
                        select new
                        {
                            grp.Key.FromAirport,
                            grp.Key.FromAirportIATA,
                            grp.Key.DelayCodeId,
                            grp.Key.Category,
                            grp.Key.Title,
                            grp.Key.Code,
                            grp.Key.DelayCategoryId,
                            grp.Key.DelayRemark,
                            Flights = grp.Count(),
                            TotalDelay = grp.Sum(q => q.DelayMM),
                            DurationOffBlock = grp.Sum(q => q.ActualFlightHOffBlock * 60 + q.ActualFlightMOffBlock),
                            DurationTakeOff = grp.Sum(q => q.ActualFlightHTakeoff * 60 + q.ActualFlightMTakeoff)
                        };
            var result = await query.OrderByDescending(q => q.TotalDelay).ThenBy(q => q.FromAirportIATA).ThenBy(q => q.Code).ToListAsync();

            return Ok(result);

        }
        [Route("odata/delays/details/source/{cid}/{source}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetTotalDelaysBySourceDetails(DateTime from, DateTime to, int cid, int source)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.FromAirport == source
                        select x;
            var result = await query.OrderByDescending(q => q.DelayMM).ThenBy(q => q.Code).ThenBy(q => q.FlightNumber).ToListAsync();

            return Ok(result);

        }
        //==================================================//

        [Route("odata/delays/total/register/{cid}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetTotalDelaysByRegister(DateTime from, DateTime to, int cid)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.DelayCodeId != 97
                        group x by new { x.RegisterID, x.Register, x.DelayCodeId, x.Category, x.Title, x.Code, x.DelayCategoryId, x.DelayRemark } into grp
                        select new
                        {
                            grp.Key.RegisterID,
                            grp.Key.Register,
                            grp.Key.DelayCodeId,
                            grp.Key.Category,
                            grp.Key.Title,
                            grp.Key.Code,
                            grp.Key.DelayCategoryId,
                            grp.Key.DelayRemark,
                            Flights = grp.Count(),
                            TotalDelay = grp.Sum(q => q.DelayMM),
                            DurationOffBlock = grp.Sum(q => q.ActualFlightHOffBlock * 60 + q.ActualFlightMOffBlock),
                            DurationTakeOff = grp.Sum(q => q.ActualFlightHTakeoff * 60 + q.ActualFlightMTakeoff)
                        };
            var result = await query.OrderByDescending(q => q.TotalDelay).ThenBy(q => q.Register).ThenBy(q => q.Code).ToListAsync();

            return Ok(result);

        }
        [Route("odata/delays/details/register/{cid}/{register}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetTotalDelaysByRegisterDetails(DateTime from, DateTime to, int cid, int register)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.RegisterID == register
                        select x;
            var result = await query.OrderByDescending(q => q.DelayMM).ThenBy(q => q.Code).ThenBy(q => q.FlightNumber).ToListAsync();

            return Ok(result);

        }
        //================================================//
        [Route("odata/delays/total/route/{cid}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetTotalDelaysByRoute(DateTime from, DateTime to, int cid)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.ID != 97
                        group x by new { x.Route, x.DelayCodeId, x.Category, x.Title, x.Code, x.DelayCategoryId, x.DelayRemark } into grp
                        select new
                        {
                            grp.Key.Route,

                            grp.Key.DelayCodeId,
                            grp.Key.Category,
                            grp.Key.Title,
                            grp.Key.Code,
                            grp.Key.DelayCategoryId,
                            grp.Key.DelayRemark,
                            Flights = grp.Count(),
                            TotalDelay = grp.Sum(q => q.DelayMM),
                            DurationOffBlock = grp.Sum(q => q.ActualFlightHOffBlock * 60 + q.ActualFlightMOffBlock),
                            DurationTakeOff = grp.Sum(q => q.ActualFlightHTakeoff * 60 + q.ActualFlightMTakeoff)
                        };
            var result = await query.OrderByDescending(q => q.TotalDelay).ThenBy(q => q.Route).ThenBy(q => q.Code).ToListAsync();

            return Ok(result);

        }
        [Route("odata/delays/details/route/{cid}/{route}")]
        [EnableQuery]

        public async Task<IHttpActionResult> GetTotalDelaysByRegisterDetails(DateTime from, DateTime to, int cid, string route)
        {
            var dfrom = from.Date;
            var dto = to.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var query = from x in unitOfWork.FlightRepository.GetViewFlightDelays()
                        where x.Date >= dfrom && x.Date <= dto && x.CustomerId == cid && x.Route == route
                        select x;
            var result = await query.OrderByDescending(q => q.DelayMM).ThenBy(q => q.Code).ThenBy(q => q.FlightNumber).ToListAsync();

            return Ok(result);

        }
        //=============================================//
        [Route("odata/box/crew/{boxid}")]
        [EnableQuery]
        // [Authorize]
        public IHttpActionResult GetViewBoxCrew(int boxid)
        {
            var crew = unitOfWork.FlightRepository.GetViewBoxCrews().Where(q => q.BoxId == boxid).OrderBy(q => q.Position).ThenBy(q => q.Name).ToList();
            var query = (from x in crew
                         group x by x.Position into g
                         select new { Title = g.Key, Value = g.Count() }).ToList();
            var _allassigned = unitOfWork.FlightRepository.IsBoxCrewAllAssigned(boxid);
            dynamic result = new
            {
                Crew = crew,
                Summary = query,
                HasCrewProblem = crew.Where(q => q.AvailabilityId != 1).Count() > 0,
                AllCrewAssigned = _allassigned,
            };
            return Ok(result);
            // return unitOfWork.FlightRepository.GetViewBoxCrews().Where(q => q.BoxId == boxid);

        }
        //oks
        [Route("odata/flights/plan/crew/box/{bid}")]
        // [EnableQuery]
        // [Authorize]
        public IHttpActionResult GetViewFlightPlanCalanderCrewBox(int bid)
        {
            var crew = unitOfWork.FlightRepository.GetViewFlightPlanCalanderCrew().Where(q => q.BoxId == bid).OrderBy(q => q.JobGroupCode).ThenBy(q => q.Name).ToList();
            var query = (from x in crew
                         group x by x.JobGroup into g
                         select new { Title = g.Key, Value = g.Count() }).ToList();
            var _allassigned = unitOfWork.FlightRepository.IsBoxCrewAllAssigned(bid);
            dynamic result = new
            {
                Crew = crew,
                Summary = query,
                HasCrewProblem = crew.Where(q => q.AvStatusId > 1).Count() > 0,
                AllCrewAssigned = _allassigned,
            };
            return Ok(result);

        }


        [Route("odata/crew/available/{cid}/{type}/{boxid}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetCrewAvailable(int cid, int type, int boxid)
        {
            try
            {
                //DateTime date = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormatUTC(day).Date;
                var box = await unitOfWork.FlightRepository.GetBoxByID(boxid);
                var boxCrewIds = await unitOfWork.FlightRepository.GetViewFlightPlanCalanderCrew().Where(q => q.BoxId == boxid).Select(q => q.PersonId).ToListAsync();
                var query = from x in unitOfWork.PersonRepository.GetViewCrews()
                                // join y in unitOfWork.PersonRepository.GetViewPersonAircraftType() on x.PersonId equals y.PersonId
                            where x.CustomerId == cid && !boxCrewIds.Contains(x.PersonId)

                            select x;
                if (type != -1)
                    query = from x in query
                            join y in unitOfWork.PersonRepository.GetViewPersonAircraftType() on x.PersonId equals y.PersonId
                            where y.AircraftTypeId == type

                            select x;
                //ViewFlightPlanCalanderCrew
                var dutyQuery = (from x in unitOfWork.FlightRepository.GetViewFlightPlanCalanderCrew()
                                 where (
                                 x.STD >= box.STD && x.STA <= box.STA
                                 ) ||
                                 (
                                 box.STD >= x.STD && box.STA <= x.STA
                                 ) ||
                                 (x.BoxId != box.Id && x.Date == box.Date)
                                 select x.PersonId).ToList();

                var result = query.ToList();
                var pids = new List<string> { "66", "64" };
                foreach (var x in result)
                {
                    //get availability
                    x.AvStatus = "Available";
                    x.AvStatusId = 1;
                    if (x.CurrentLocationAirportId != box.FromAirportId)
                    {
                        x.AvStatusId = 2;
                        x.AvStatus = "Location";
                    }
                    if (dutyQuery.IndexOf(x.PersonId) != -1)
                    {
                        x.AvStatus = "Duty";
                        x.AvStatusId = 3;
                    }
                    if (pids.IndexOf(x.PID) != -1)
                    {
                        x.AvStatus = "Rest";
                        x.AvStatusId = 4;
                    }
                }

                // return query.OrderBy(x=>x.Name);
                return Ok(result);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        //dool
        [Route("odata/crew/over/{date}/{pid}/{duty}/{flight}")]
        [EnableQuery]

        public dynamic GetOverDuty(string date, int pid, int duty, int flight)
        {

            var _result = unitOfWork.FlightRepository.GetOverDuty(date, pid, duty, flight).AsQueryable();
            if (_result == null || _result.Count() == 0)
                return new
                {
                    status = true,
                };
            var _first = _result.First();
            var overType = new List<string>();
            if (_first.Day1_Duty > 780)
                overType.Add("Duty-Day");
            if (_first.Day7_Duty > 3600)
                overType.Add("Duty-Day 7");
            if (_first.Day14_Duty > 6600)
                overType.Add("Duty-Day 14");
            if (_first.Day28_Duty > 11400)
                overType.Add("Duty-Day 28");

            if (_first.Day28_Flight > 6000)
                overType.Add("Flight-Day 28");
            if (_first.Year_Flight > 60000)
                overType.Add("Flight-Year");
            dynamic dto = new
            {
                status = false,
                result = _result,
                first = _first,
                remark = overType,
            };
            return dto;

        }


        [Route("odata/crew/rest/validation/{boxid}/{pid}")]
        [EnableQuery]
        public async Task<dynamic> GetNextRestValidation(int boxid, int pid)
        {
            var box = await unitOfWork.FlightRepository.GetViewBoxByID(boxid);
            var query = (from x in unitOfWork.FlightRepository.GetViewBoxCrews()
                         where x.BoxId != boxid && pid == x.EmployeeId && (x.DefaultStart >= box.RestFrom && x.DefaultStart <= box.RestUntil)
                         select x).ToList();
            var firstbox = unitOfWork.FlightRepository.GetViewBoxCrews().OrderBy(q => q.DefaultStart).Select(q => q.DefaultStart).FirstOrDefault();
            var temp = true;
            if (firstbox != null && ((DateTime)box.DefaultStart - (DateTime)firstbox).TotalHours >= 168)
            {
                var date168 = ((DateTime)box.DefaultStart).AddHours(-168);
                var rest168 = (from x in unitOfWork.FlightRepository.GetEmployeeCalendar()
                               where x.EmployeeId == pid && x.StatusId == 1166 && x.Date >= date168 && x.Date <= box.DefaultStart
                               select x).Count();
                if (rest168 == 0)
                    temp = false;
            }

            return new
            {
                nextRest = query,
                dayoff = temp,
            };
        }
        //jool
        [Route("odata/crew/rest/check/{date}/{pid}")]
        [EnableQuery]
        public int GetRestCheck(string date, int pid)
        {
            //DateTime value = new DateTime(2017, 1, 18);
            // var dates = date.Split('-').Select(q=>Convert.ToInt32(q)).ToList();
            //var _date =( new DateTime(dates[0], dates[1], dates[2])).Date;
            var y = Convert.ToInt32(date.Substring(0, 4));
            var m = Convert.ToInt32(date.Substring(4, 2));
            var d = Convert.ToInt32(date.Substring(6, 2));

            var _date = (new DateTime(y, m, d)).Date;
            var _dateTo = _date.AddHours(23).AddMinutes(59).AddSeconds(59);

            var query = (from x in unitOfWork.FlightRepository.GetViewBoxCrews()
                         where pid == x.EmployeeId && ((x.RestUntil >= _date && x.RestUntil <= _dateTo) || ((x.RestFrom >= _date && x.RestFrom <= _dateTo)))
                         select x).Count();
            return query == 0 ? 1 : -1;
        }
        class RestReq
        {
            public int EmployeeId { get; set; }
            public DateTime? RestFrom { get; set; }
            public DateTime? RestUntil { get; set; }
        }
        //getcrew dool
        [Route("odata/crew")]
        [AcceptVerbs("POST", "GET")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetCrew(/*int cid, int type, int boxid*/dynamic dto)
        {
            try
            {
                var dateFrom = ((DateTime)dto.DateFrom).Date;
                var dateTo = ((DateTime)dto.DateTo).Date.AddHours(23).AddMinutes(59).AddSeconds(59);

                var cid = (Nullable<int>)Convert.ToInt32(dto.cid);
                int type = Convert.ToInt32(dto.type);
                int boxid = Convert.ToInt32(dto.boxid);
                bool cockpit = Convert.ToBoolean(dto.cockpit);

                var code = cockpit ? "00101" : "00102";
                //DateTime date = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormatUTC(day).Date;
                var box = await unitOfWork.FlightRepository.GetViewBoxByID(boxid);
                // var boxCrewIds = await unitOfWork.FlightRepository.GetViewFlightPlanCalanderCrew().Where(q => q.BoxId == boxid).Select(q => q.PersonId).ToListAsync();
                var query = from x in unitOfWork.PersonRepository.GetViewCrews()
                                // join y in unitOfWork.PersonRepository.GetViewPersonAircraftType() on x.PersonId equals y.PersonId
                            where x.CustomerId == cid && x.JobGroupCode.StartsWith(code)
                            select x;
                if (type != -1)
                    query = from x in query
                            join y in unitOfWork.PersonRepository.GetViewPersonAircraftType() on x.PersonId equals y.PersonId
                            where y.AircraftTypeId == type

                            select x;

                var crews = query.ToList();

                var eids = crews.Select(q => q.Id).ToList();


                var requiredRests = (from x in unitOfWork.FlightRepository.GetViewBoxCrews()
                                     where x.BoxId != boxid && eids.Contains(x.EmployeeId) && (box.DefaultStart >= x.RestFrom && box.DefaultStart <= x.RestUntil)
                                     select new RestReq() { EmployeeId = x.EmployeeId, RestFrom = x.RestFrom, RestUntil = x.RestUntil }).ToList();


                var stbyRests = (from x in unitOfWork.FlightRepository.GetViewCrewCalendar()
                                 where eids.Contains(x.EmployeeId) && (x.StatusId == 1168 || x.StatusId == 1167) && x.IsCeased == 0
                                 && (box.DefaultStart >= x.DateEnd && box.DefaultStart <= x.RestUntil)
                                 select new RestReq() { EmployeeId = x.EmployeeId, RestFrom = x.DateEnd, RestUntil = x.RestUntil }).ToList();

                var otherrest = (from x in unitOfWork.FlightRepository.GetViewCrewCalendar()
                                 where eids.Contains(x.EmployeeId) && (x.StatusId == 5000 || x.StatusId == 5001) && x.IsCeased == 0
                                 && (box.DefaultStart >= x.DateEnd && box.DefaultStart <= x.RestUntil)
                                 select new RestReq() { EmployeeId = x.EmployeeId, RestFrom = x.DateEnd, RestUntil = x.RestUntil }).ToList();

                List<RestReq> AllRests = requiredRests.Concat(stbyRests).Concat(otherrest).ToList();

                var tasks = await unitOfWork.FlightRepository.GetViewBoxCrewFlights().Where(q => eids.Contains(q.EmployeeId) && (q.Date >= dateFrom && q.Date <= dateTo)).ToListAsync();
                var c1 = from x in tasks
                         group x by new { x.DateStr, x.EmployeeId } into g

                         select new
                         {
                             DateStr = g.Key.DateStr,
                             EmployeeId = g.Key.EmployeeId,
                             Boxed = (from z in g
                                      group z by z.BoxId into bg
                                      select new { BoxId = bg.Key, Items = bg.ToList() }
                                   )
                         };
                var _times = await (from x in unitOfWork.FlightRepository.GetViewCrewTimes()
                                    where x.CDate >= dateFrom && x.CDate <= dateTo && eids.Contains(x.Id)
                                    select x).ToListAsync();

                var dayTimes = (from x in _times
                                where (x.CalendarStatusId == 1167 || x.CalendarStatusId == 1168 || x.CalendarStatusId == 5000 || x.CalendarStatusId == 5001) && x.CDate == box.Date && box.DefaultStart >= x.ECDateStart && box.DefaultStart <= x.ECDateEnd && x.ECBoxId == null
                                select x).ToList();
                foreach (var x in dayTimes)
                {
                    x.Day1_Duty -= Convert.ToDouble(x.ECDuty);
                    x.Day7_Duty -= Convert.ToDouble(x.ECDuty);
                    x.Day14_Duty -= Convert.ToDouble(x.ECDuty);
                    x.Day28_Duty -= Convert.ToDouble(x.ECDuty);
                    x.Year_Duty -= 0;//Convert.ToDouble(x.ECDuty);

                    var newduty = 0.25 * ((DateTime)box.DefaultStart - (DateTime)x.ECDateStart).TotalMinutes;
                    x.ECDuty = 0; //Convert.ToDecimal(newduty);
                    // x.Day1_Duty -= Convert.ToDouble(x.ECDuty);
                    // x.Day7_Duty -= Convert.ToDouble(x.ECDuty);
                    // x.Day14_Duty -= Convert.ToDouble(x.ECDuty);
                    // x.Day28_Duty -= Convert.ToDouble(x.ECDuty);
                    // x.Year_Duty -= Convert.ToDouble(x.ECDuty);

                    if (x.CalendarStatusId == 1168 && ((DateTime)box.DefaultStart).AddMinutes(270).Hour >= 6)
                    {
                        //stby am
                        x.FDPReduction = 360;
                    }
                    if (x.CalendarStatusId == 1167 && ((DateTime)box.DefaultStart).AddMinutes(270).Hour >= 18)
                    {
                        //stby pm
                        x.FDPReduction = 360;
                    }

                }

                dynamic result = new
                {
                    crew = crews,
                    calendar = c1.ToList(),
                    times = _times,
                    reqrests = AllRests,

                };

                return Ok(result);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }



        //sati
        [Route("odata/flight/plan/crew/save/x")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanCrew(ViewModels.FlightPlanCalanderCrewDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            //var validate = unitOfWork.FlightRepository.ValidateFlightPlan(dto);
            //if (validate.Code != HttpStatusCode.OK)
            //    return validate;

            FlightPlanCalanderCrew entity = null;

            if (dto.Id == -1)
            {
                entity = new FlightPlanCalanderCrew();
                unitOfWork.FlightRepository.Insert(entity);
            }



            if (entity == null)
                return Exceptions.getNotFoundException();

            ViewModels.FlightPlanCalanderCrewDto.Fill(entity, dto);


            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(entity);
        }

        [Route("odata/flight/plan/crew/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostBoxCrew(ViewModels.FlightPlanCalanderCrewDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            //var validate = unitOfWork.FlightRepository.ValidateFlightPlan(dto);
            //if (validate.Code != HttpStatusCode.OK)
            //    return validate;

            BoxCrew entity = null;

            if (dto.Id == -1)
            {
                entity = new BoxCrew();
                unitOfWork.FlightRepository.Insert(entity);
            }



            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.FlightPlanCalanderCrewDto.Fill(entity, dto);
            entity.EmployeeId = dto.EmployeeId;
            entity.AvailabilityId = dto.AvailabilityId;
            entity.BoxId = (int)dto.BoxId;
            entity.JobGroupId = dto.GroupId;
            entity.Remark = string.Empty;

            if ((int)dto.ECSplitedId != -1)
            {
                var ecsplited = await unitOfWork.FlightRepository.GetEmployeeCalendarSplitedById((int)dto.ECSplitedId);
                ecsplited.BoxCrew = entity;
            }

            if ((int)dto.ECId != -1)
            {
                var ec = await unitOfWork.FlightRepository.GetEmployeeCalendarById((int)dto.ECId);
                ec.BoxCrew = entity;
            }



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(entity);
        }

        [Route("odata/flight/plan/crew/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteFlightPlanCrew(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            FlightPlanCalanderCrew item = await unitOfWork.FlightRepository.GetFlightPlanCalanderCrewById(id);


            unitOfWork.FlightRepository.Delete(item);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);
        }

        [Route("odata/box/crew/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteBoxCrew(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            BoxCrew item = await unitOfWork.FlightRepository.GetBoxCrewById(id);


            unitOfWork.FlightRepository.Delete(item);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);
        }
        [Route("odata/flight/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteFlight(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            FlightInformation item = await unitOfWork.FlightRepository.GetFlightById(id);


            unitOfWork.FlightRepository.DeleteFlight(item);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);
        }

        [Route("odata/crew/calendar/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCrewCalendar(dynamic dto)
        {
            //xox
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            int employeeId = Convert.ToInt32(dto.EmployeeId);
            string date = Convert.ToString(dto.Date);
            int status = Convert.ToInt32(dto.Status);



            var y = Convert.ToInt32(date.Substring(0, 4));
            var m = Convert.ToInt32(date.Substring(4, 2));
            var d = Convert.ToInt32(date.Substring(6, 2));

            var _date = (new DateTime(y, m, d)).Date;


            EmployeeCalendarSplited detail = new EmployeeCalendarSplited();
            EmployeeCalendar entity = await unitOfWork.FlightRepository.GetEmployeeCalendar(employeeId, _date);
            if (status != -1)
            {
                if (entity == null)
                {
                    entity = new EmployeeCalendar();
                    entity.EmployeeId = employeeId;
                    entity.Date = _date;

                    unitOfWork.FlightRepository.Insert(entity);

                    detail = new EmployeeCalendarSplited()
                    {
                        EmployeeCalendar = entity,
                        EmployeeId = employeeId,
                        IsDismissed = false,
                        StatusId = status,

                    };
                    var _ds = new DateTime(y, m, d, 0, 0, 0);
                    var _de = new DateTime(y, m, d, 23, 59, 59, 999);
                    detail.DateStart = _ds;
                    detail.DateEnd = _de;
                    unitOfWork.FlightRepository.Insert(detail);
                }

                entity.StatusId = status;
                if (status == 1168)
                {
                    var _ds = new DateTime(y, m, d, 0, 0, 0);
                    var _de = new DateTime(y, m, d, 12, 0, 0);
                    _ds = _ds.AddMinutes(-270);
                    _de = _de.AddMinutes(-270);
                    entity.DateStart = _ds;
                    entity.DateEnd = _de;

                    detail.DateStart = _ds;
                    detail.DateEnd = _de;


                }
                if (status == 1167)
                {
                    var _ds = new DateTime(y, m, d, 12, 0, 0);
                    var _de = new DateTime(y, m, d, 23, 59, 59, 999);
                    _ds = _ds.AddMinutes(-270);
                    _de = _de.AddMinutes(-270);
                    entity.DateStart = _ds;
                    entity.DateEnd = _de;

                    detail.DateStart = _ds;
                    detail.DateEnd = _de;
                }
                if (status == 5001 || status == 5000)
                {
                    var _ds = Convert.ToDateTime(dto.DateStart);
                    var _de = Convert.ToDateTime(dto.DateEnd);
                    entity.DateStart = _ds;
                    entity.DateEnd = _de;

                    detail.DateStart = _ds;
                    detail.DateEnd = _de;
                }
            }
            else
            {
                if (entity == null)
                    return Exceptions.getNotFoundException();
                unitOfWork.FlightRepository.Delete(entity);
            }



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(entity);
        }


        //kakoli
        [Route("odata/plan/interval/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanInterval(ViewModels.FlightPlanDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            dto.DateFrom = ((DateTime)dto.DateFrom).Date;
            dto.DateTo = ((DateTime)dto.DateTo).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            dto.DateFirst = ((DateTime)dto.DateFirst).Date;
            var validate = unitOfWork.FlightRepository.ValidateFlightPlan(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            FlightPlan entity = await unitOfWork.FlightRepository.GetPlanById(dto.Id);

            var odate = ((DateTime)entity.DateFrom).Date;

            if (entity == null)
                return Exceptions.getNotFoundException();

            
            /////////
            var prts = entity.Title.Split('_');
            var reg = prts[2];
            var plan_title = entity.CustomerId.ToString() + "_" + entity.BaseId.ToString() + "_" + reg + "_" + ((DateTime)dto.DateFrom).ToShortDateString().Replace("/", "-");
            /////////
            entity.Title = plan_title;
            entity.DateFrom = dto.DateFrom;
            entity.DateTo = dto.DateTo;
            entity.DateFirst = dto.DateFirst;
            entity.DateLast = dto.DateLast;
            entity.Interval = dto.Interval;



            unitOfWork.FlightRepository.ClearPlanMonths(dto.Id);
            unitOfWork.FlightRepository.ClearPlanDays(dto.Id);


            if (dto.Months != null)
                foreach (var x in dto.Months)
                    unitOfWork.FlightRepository.Insert(new FlightPlanMonth() { FlightPlan = entity, Month = x });

            if (dto.Days != null)
                foreach (var x in dto.Days)
                    unitOfWork.FlightRepository.Insert(new FlightPlanDay() { FlightPlan = entity, Day = x });

            unitOfWork.FlightRepository.CreatePlanCalendar(dto.Id, entity, dto.Months, dto.Days);

            await unitOfWork.FlightRepository.ModifyPlanItemsSTDA(entity.Id, odate, ((DateTime)dto.DateFrom).Date);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            await unitOfWork.FlightRepository.CloseFlightPlanItems(entity, true);
            saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            return Ok(entity);
        }

        [Route("odata/flightplan/editable/{id}")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanEditable(int id)
        {


            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            // var fc =await unitOfWork.FlightRepository.GetViewFlights().Where(q => q.FlightStatusID != 1).CountAsync();
            //if (fc>0)
            // {
            //     return new CustomActionResult(HttpStatusCode.NotAcceptable, "Cannot update plan flights");
            // }
            var result = await unitOfWork.FlightRepository.FlightPlanEditable(id);
            if (result.Code != HttpStatusCode.OK)
                return result;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return result;
        }



        [Route("odata/flightplanitems/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanItems(ViewModels.FlightPlanSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var errors = new List<int>() { 10, 11, 16 };
            var flightPlan = await unitOfWork.FlightRepository.GetPlanById(dto.Plan.Id);
            if (flightPlan == null)
            {
                return Exceptions.getNotFoundException();
            }

            var newItems = (from x in dto.Items
                            where x.Id >= 1000000
                            select x).ToList();

            foreach (var x in newItems)
            {
                var nfpi = new FlightPlanItem();
                ViewModels.FlightPlanItemDto.Fill(nfpi, x);

                if (errors.IndexOf((int)nfpi.StatusId) == -1)
                    nfpi.StatusId = 1;

                unitOfWork.FlightRepository.Insert(nfpi);
                x.PlanItem = nfpi;
            }

            var updatedItems = dto.Items.Where(q => q.Id < 1000000).ToList();
            var updatedEntities = await unitOfWork.FlightRepository.GetPlanItemsByIds(updatedItems.Select(q => q.Id).ToList());
            foreach (var x in updatedEntities)
            {
                var dtoitem = updatedItems.Single(q => q.Id == x.Id);
                ViewModels.FlightPlanItemDto.Fill(x, dtoitem);
                if (errors.IndexOf((int)x.StatusId) == -1)
                    x.StatusId = 1;
            }

            var deletedEntities = await unitOfWork.FlightRepository.GetPlanItemsByIds(dto.Deleted);
            foreach (var x in deletedEntities)
            {
                unitOfWork.FlightRepository.Delete(x);
            }

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var result = (from x in newItems
                          select new { InitId = x.Id, Id = x.PlanItem.Id }).ToList();

            return Ok(result);
        }



        [Route("odata/planitems/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostPlanItems(dynamic dto)
        {
            //toosk
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var Id = Convert.ToInt32(dto.Id);

            Models.PlanItem planItem = await unitOfWork.FlightRepository.GetBoardPlanItemById(Id);
            if (planItem == null)
            {
                planItem = new PlanItem();
                unitOfWork.FlightRepository.Insert(planItem);
            }
            DateTime dateFrom = Convert.ToDateTime(dto.DateFrom);
            DateTime dateTo = Convert.ToDateTime(dto.DateTo);
            var day = Convert.ToString(dto.Day);
            var fromId = Convert.ToInt32(dto.FromId);
            var toId = Convert.ToInt32(dto.ToId);
            var typeId = Convert.ToInt32(dto.TypeId);
            var flightNumber = Convert.ToString(dto.FlightNumber);
            DateTime arr = Convert.ToDateTime(dto.Arr);
            arr = arr.AddMinutes(-210);
            DateTime dep = Convert.ToDateTime(dto.Dep);
            dep = dep.AddMinutes(-210);
            planItem.DateFrom = dateFrom.Date;
            planItem.DateTo = dateTo.Date;
            planItem.Arr = new DateTime(1900, 1, 1, arr.Hour, arr.Minute, 0);
            planItem.Dep = new DateTime(1900, 1, 1, dep.Hour, dep.Minute, 0);
            planItem.ToId = toId;
            planItem.FromId = fromId;
            planItem.Day = day;
            planItem.FlightNumber = flightNumber;
            planItem.TypeId = typeId;
            planItem.FlightH = Convert.ToInt32(dto.FlightH);
            planItem.FlightM = Convert.ToInt32(dto.FlightM);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(planItem);
        }
        [Route("odata/planitem/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeletePlanItemBoard(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            Models.PlanItem item = await unitOfWork.FlightRepository.GetBoardPlanItemById(id);


            unitOfWork.FlightRepository.DeletePlanItemBoard(item);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(dto);
        }

        [Route("odata/flight/planitem/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteFlightPlanItem(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            FlightPlanItem item = await unitOfWork.FlightRepository.GetPlanItemById(id);

            FlightPlan plan = await unitOfWork.FlightRepository.GetPlanById(item.FlightPlanId);
            // await unitOfWork.FlightRepository.Delete(item);
            await unitOfWork.FlightRepository.DeleteFlightPlanItem(item);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            await unitOfWork.FlightRepository.DeleteEmptyPlan(plan);
            await unitOfWork.FlightRepository.ProcessPlanErrors(plan);
            saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }


        [Route("odata/flight/plan/item/permit/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteFlightPlanItemPermit(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            FlightPlanItemPermit item = await unitOfWork.FlightRepository.GetFlightPlanItemPermitById(id);


            unitOfWork.FlightRepository.Delete(item);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);
        }



        [Route("odata/plan/import")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetPlanImport()
        {
            //zook
            List<FlightPlanRegister> fpregs = new List<FlightPlanRegister>();
            var records = unitOfWork.FlightRepository.GetViewImportPlan().OrderBy(q => q.Date).ThenBy(q => q.RegId).ThenBy(q => q.STDUtc).ToList();
            //var record = records.First();
            foreach (var record in records)
            {
                var dateFrom = record.Date.Date;
                var dateTo = record.Date.Date;
                DateTime? dateFirst = null;


                FlightPlan entity = null;
                FlightPlanItem entityItem = null;
                var plan_title = /*obj.CustomerId.ToString()*/"4" + "_" + record.BaseId.ToString() + "_" + record.RegId + "_" + dateFrom.ToShortDateString().Replace("/", "-");
                entity = await unitOfWork.FlightRepository.GetPlanByTitle(plan_title);

                if (entity == null)
                {
                    entity = new FlightPlan();
                    unitOfWork.FlightRepository.Insert(entity);
                    //////Fill Plan ///////////////////
                    ///  entity.Id = flightplan.Id;
                    entity.Title = plan_title;
                    entity.DateFrom = dateFrom;
                    entity.DateTo = dateTo;
                    entity.DateFirst = dateFirst;
                    entity.DateLast = null;
                    entity.CustomerId = 4;
                    entity.IsActive = false;
                    entity.DateActive = null;
                    entity.Interval = 101;
                    entity.BaseId = record.BaseId;

                    List<int> month = null;
                    List<int> days = null;

                    unitOfWork.FlightRepository.CreatePlanCalendar(-1, entity, month, days);
                    var cal = entity.FlighPlanCalendars.FirstOrDefault();

                    fpregs.Add(new FlightPlanRegister()
                    {
                        PlannedRegisterId = record.LineId,
                        RegisterId = record.RegId,
                        Date = record.Date,
                        DateFrom = record.Date.Date,
                        DateTo = record.Date.Date.AddHours(23).AddMinutes(59).AddSeconds(59),
                        FlightPlanId = -1,


                    });
                    ////////////////////////////////////
                }
                bool isEdit = false;
                int currentPlanId = -1;

                entityItem = new FlightPlanItem();

                unitOfWork.FlightRepository.Insert(entityItem);






                if (entity == null)
                    return Exceptions.getNotFoundException();
                if (entityItem == null)
                    return Exceptions.getNotFoundException();




                ////Fill Plan Item ////////////////////
                entityItem.Id = -1;
                entityItem.FlightPlan = entity;
                entityItem.TypeId = record.AircraftTypeId;
                entityItem.RegisterID = record.LineId; //record.RegId;
                entityItem.FlightTypeID = 109;
                entityItem.AirlineOperatorsID = null;
                entityItem.FlightNumber = record.No;
                entityItem.FromAirport = record.FromId;
                entityItem.ToAirport = record.ToId;
                entityItem.STD = ((DateTime)record.STDUtc);//.AddHours(3).AddMinutes(30);
                entityItem.STA = ((DateTime)record.STAUtc);//.AddHours(3).AddMinutes(30);


                var Hour = record.FlightTime / 60;
                var Minute = record.FlightTime % 60;
                entityItem.FlightH = (int)Hour;
                entityItem.FlightM = (int)Minute;


                entityItem.Unknown = null;
                entityItem.StatusId = 1;
                entityItem.RouteId = record.RouteId;
                //////////////////////////////////////

                await unitOfWork.FlightRepository.ProcessPlanErrors(entity, entityItem);

                //    ViewModels.FlightPlanDto.Fill(entity, dto);







                var saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;
                if (!isEdit)
                    await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
                else
                {
                    await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
                    if (currentPlanId != -1)
                        await unitOfWork.FlightRepository.DeleteEmptyPlan(currentPlanId);
                    //await unitOfWork.FlightRepository.UpdatePlanItemFlights(entityItem);
                }



                saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;

                if (fpregs.Last().FlightPlanId == -1)
                {
                    fpregs.Last().FlightPlanId = entity.Id;
                    fpregs.Last().CalendarId = entity.FlighPlanCalendars.First().Id;
                    // unitOfWork.FlightRepository.Insert(fpregs.Last());

                }

            }

            foreach (var fpr in fpregs)
            {
                var item = unitOfWork.FlightRepository.InsertFlightPlanRegister(-1, (DateTime)fpr.Date, fpr.FlightPlanId, fpr.RegisterId, fpr.PlannedRegisterId, (int)fpr.CalendarId);
            }
            var saveResult2 = await unitOfWork.SaveAsync();
            if (saveResult2.Code != HttpStatusCode.OK)
                return saveResult2;

            // obj.FlightPlanId = entity.Id;
            // obj.Id = entityItem.Id;
            // var view = unitOfWork.FlightRepository.GetViewFlightPlanItems().FirstOrDefault(q => q.Id == entity.Id);

            return Ok(true);
        }


        [Route("odata/plan/import/unknown")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetPlanImportUnknown()
        {
            //zook
            List<FlightPlanRegister> fpregs = new List<FlightPlanRegister>();
            var records = unitOfWork.FlightRepository.GetViewImportPlan().OrderBy(q => q.Date).ThenBy(q => q.RegId).ThenBy(q => q.STDUtc).ToList();
            //var record = records.First();
            foreach (var record in records)
            {
                var dateFrom = record.Date.Date;
                var dateTo = record.Date.Date;
                DateTime? dateFirst = null;


                FlightPlan entity = null;
                FlightPlanItem entityItem = null;
                var plan_title = /*obj.CustomerId.ToString()*/"4" + "_" + record.BaseId.ToString() + "_" + record.RegId + "_" + dateFrom.ToShortDateString().Replace("/", "-");
                entity = await unitOfWork.FlightRepository.GetPlanByTitle(plan_title);

                if (entity == null)
                {
                    entity = new FlightPlan();
                    unitOfWork.FlightRepository.Insert(entity);
                    //////Fill Plan ///////////////////
                    ///  entity.Id = flightplan.Id;
                    entity.Title = plan_title;
                    entity.DateFrom = dateFrom;
                    entity.DateTo = dateTo;
                    entity.DateFirst = dateFirst;
                    entity.DateLast = null;
                    entity.CustomerId = 4;
                    entity.IsActive = false;
                    entity.DateActive = null;
                    entity.Interval = 101;
                    entity.BaseId = record.BaseId;

                    List<int> month = null;
                    List<int> days = null;

                    unitOfWork.FlightRepository.CreatePlanCalendar(-1, entity, month, days);
                    var cal = entity.FlighPlanCalendars.FirstOrDefault();

                    //fpregs.Add(new FlightPlanRegister()
                    //{
                    //    PlannedRegisterId = record.LineId,
                    //    RegisterId = record.RegId,
                    //    Date = record.Date,
                    //    DateFrom = record.Date.Date,
                    //    DateTo = record.Date.Date.AddHours(23).AddMinutes(59).AddSeconds(59),
                    //    FlightPlanId = -1,


                    //});
                    ////////////////////////////////////
                }
                bool isEdit = false;
                int currentPlanId = -1;

                entityItem = new FlightPlanItem();

                unitOfWork.FlightRepository.Insert(entityItem);






                if (entity == null)
                    return Exceptions.getNotFoundException();
                if (entityItem == null)
                    return Exceptions.getNotFoundException();




                ////Fill Plan Item ////////////////////
                entityItem.Id = -1;
                entityItem.FlightPlan = entity;
                entityItem.TypeId = record.AircraftTypeId;
                entityItem.RegisterID = record.LineId; //record.RegId;
                entityItem.FlightTypeID = 109;
                entityItem.AirlineOperatorsID = null;
                entityItem.FlightNumber = record.No;
                entityItem.FromAirport = record.FromId;
                entityItem.ToAirport = record.ToId;
                entityItem.STD = ((DateTime)record.STDUtc);//.AddHours(3).AddMinutes(30);
                entityItem.STA = ((DateTime)record.STAUtc);//.AddHours(3).AddMinutes(30);


                var Hour = record.FlightTime / 60;
                var Minute = record.FlightTime % 60;
                entityItem.FlightH = (int)Hour;
                entityItem.FlightM = (int)Minute;


                entityItem.Unknown = null;
                entityItem.StatusId = 1;
                entityItem.RouteId = record.RouteId;
                //////////////////////////////////////

                await unitOfWork.FlightRepository.ProcessPlanErrors(entity, entityItem);

                //    ViewModels.FlightPlanDto.Fill(entity, dto);







                var saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;
                if (!isEdit)
                    await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
                else
                {
                    await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
                    if (currentPlanId != -1)
                        await unitOfWork.FlightRepository.DeleteEmptyPlan(currentPlanId);
                    //await unitOfWork.FlightRepository.UpdatePlanItemFlights(entityItem);
                }



                saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;

                //if (fpregs.Last().FlightPlanId == -1)
                //{
                //    fpregs.Last().FlightPlanId = entity.Id;
                //    fpregs.Last().CalendarId = entity.FlighPlanCalendars.First().Id;
                //    // unitOfWork.FlightRepository.Insert(fpregs.Last());

                //}

            }

            foreach (var fpr in fpregs)
            {
                var item = unitOfWork.FlightRepository.InsertFlightPlanRegister(-1, (DateTime)fpr.Date, fpr.FlightPlanId, fpr.RegisterId, fpr.PlannedRegisterId, (int)fpr.CalendarId);
            }
            var saveResult2 = await unitOfWork.SaveAsync();
            if (saveResult2.Code != HttpStatusCode.OK)
                return saveResult2;

            // obj.FlightPlanId = entity.Id;
            // obj.Id = entityItem.Id;
            // var view = unitOfWork.FlightRepository.GetViewFlightPlanItems().FirstOrDefault(q => q.Id == entity.Id);

            return Ok(true);
        }



        [Route("odata/flight/planitem/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanItem(ViewModels.FlightPlanningDto obj)
        {

            if (obj == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            //   string str = JsonConvert.SerializeObject(dto);
            //  dynamic obj = JsonConvert.DeserializeObject(str);

            var dateFrom = ((DateTime)obj.DateFrom).Date;
            var dateTo = ((DateTime)obj.DateTo).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            DateTime? dateFirst = null;
            if (obj.DateFirst != null)
                dateFirst = ((DateTime)obj.DateFirst).Date;
            //dto.DateFrom = ((DateTime)dto.DateFrom).Date;
            //dto.DateTo = ((DateTime)dto.DateTo).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            //dto.DateFirst = ((DateTime)dto.DateFirst).Date;
            //var validate = unitOfWork.FlightRepository.ValidateFlightPlan(dto);
            //if (validate.Code != HttpStatusCode.OK)
            //    return validate;

            FlightPlan entity = null;
            FlightPlanItem entityItem = null;
            var plan_title = obj.CustomerId.ToString() + "_" + obj.BaseId.ToString() + "_" + obj.RegisterID + "_" + dateFrom.ToShortDateString().Replace("/", "-");
            entity = await unitOfWork.FlightRepository.GetPlanByTitle(plan_title);

            if (entity == null)
            {
                entity = new FlightPlan();
                unitOfWork.FlightRepository.Insert(entity);
                //////Fill Plan ///////////////////
                ///  entity.Id = flightplan.Id;
                entity.Title = plan_title;
                entity.DateFrom = dateFrom;
                entity.DateTo = dateTo;
                entity.DateFirst = dateFirst;
                entity.DateLast = null;
                entity.CustomerId = obj.CustomerId;
                entity.IsActive = obj.IsActive;
                entity.DateActive = obj.DateActive;
                entity.Interval = obj.Interval;
                entity.BaseId = obj.BaseId;
                //if (obj.Id != -1)
                //{
                //    unitOfWork.FlightRepository.ClearPlanMonths(obj.Id);
                //    unitOfWork.FlightRepository.ClearPlanDays(obj.Id);
                //}
                var month = obj.Months as List<int>;
                var days = obj.Days as List<int>;
                if (month != null)
                    foreach (var x in month)
                        unitOfWork.FlightRepository.Insert(new FlightPlanMonth() { FlightPlan = entity, Month = x });

                if (days != null)
                    foreach (var x in days)
                        unitOfWork.FlightRepository.Insert(new FlightPlanDay() { FlightPlan = entity, Day = x });

                unitOfWork.FlightRepository.CreatePlanCalendar(obj.Id, entity, month, days);
                ////////////////////////////////////
            }
            bool isEdit = false;
            int currentPlanId = -1;
            if (obj.Id == -1)
            {


                entityItem = new FlightPlanItem();

                unitOfWork.FlightRepository.Insert(entityItem);
            }

            else
            {

                isEdit = true;
                entityItem = await unitOfWork.FlightRepository.GetPlanItemById(obj.Id);
                currentPlanId = entityItem.FlightPlanId;

            }



            if (entity == null)
                return Exceptions.getNotFoundException();
            if (entityItem == null)
                return Exceptions.getNotFoundException();




            ////Fill Plan Item ////////////////////
            entityItem.Id = obj.Id;
            entityItem.FlightPlan = entity;
            entityItem.TypeId = obj.TypeId;
            entityItem.RegisterID = obj.RegisterID;
            entityItem.FlightTypeID = obj.FlightTypeID;
            entityItem.AirlineOperatorsID = obj.AirlineOperatorsID;
            entityItem.FlightNumber = obj.FlightNumber;
            entityItem.FromAirport = obj.FromAirport;
            entityItem.ToAirport = obj.ToAirport;
            entityItem.STD = ((DateTime)obj.STD);//.AddHours(3).AddMinutes(30);
            entityItem.STA = ((DateTime)obj.STA);//.AddHours(3).AddMinutes(30);
            entityItem.FlightH = obj.FlightH;
            entityItem.FlightM = obj.FlightM;
            entityItem.Unknown = obj.Unknown;
            entityItem.StatusId = 1;
            entityItem.RouteId = obj.RouteId;
            //////////////////////////////////////

            await unitOfWork.FlightRepository.ProcessPlanErrors(entity, entityItem);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            if (!isEdit)
                await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
            else
            {
                await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
                if (currentPlanId != -1)
                    await unitOfWork.FlightRepository.DeleteEmptyPlan(currentPlanId);
                //await unitOfWork.FlightRepository.UpdatePlanItemFlights(entityItem);
            }
            saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            obj.FlightPlanId = entity.Id;
            obj.Id = entityItem.Id;
            var view = unitOfWork.FlightRepository.GetViewFlightPlanItems().FirstOrDefault(q => q.Id == obj.Id);

            return Ok(view);
        }
        //09-23
        //kak4
        [Route("odata/flights/cancel")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightCancel(cnlregs dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.CancelFlights(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            var fresult = result.data as updateLogResult;
            if (fresult.offcrews != null && fresult.offcrews.Count > 0)
            {
                foreach (var rec in fresult.offcrews)
                {
                    foreach (var crewid in rec.crews)
                    {
                        await unitOfWork.FlightRepository.RemoveItemsFromFDP(rec.flightId.ToString(), (int)crewid, 2, "Flight Cancellation - Removed by AirPocket.", 0, 0);
                    }
                }

            }



            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => dto.fids.Contains(q.ID)).ToListAsync();
            var flights = new List<ViewFlightsGanttDto>();
            foreach (var x in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
                ViewModels.ViewFlightsGanttDto.FillDto(x, odto, 0, 1);
                flights.Add(odto);
            }



            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            //odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flights,
                resgroups,
                ressq
            };
            //////////////////////
            return Ok(oresult);

        }


        [Route("odata/flights/cancel/group")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightCancelGroup(cnlregs dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.CancelFlightsGroup(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            var fresult = result.data as updateLogResult;
            if (fresult.offcrews != null && fresult.offcrews.Count > 0)
            {
                foreach (var rec in fresult.offcrews)
                {
                   // if (!fresult.flights_crew_ids.Contains(rec.flightId))
                        foreach (var crewid in rec.crews)
                        {
                            await unitOfWork.FlightRepository.RemoveItemsFromFDP(rec.flightId.ToString(), (int)crewid, 2, "Flight Cancellation - Removed by AirPocket.", 0, 0);
                        }
                }

            }


            var beginDate = ((DateTime)dto.RefDate).Date;
            var endDate = ((DateTime)dto.RefDate).Date.AddDays((int)dto.RefDays).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => fresult.fltIds.Contains(q.ID)
             && q.STDDay >= beginDate && q.STDDay <= endDate
            ).ToListAsync();
            var flights = new List<ViewFlightsGanttDto>();
            foreach (var x in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
                ViewModels.ViewFlightsGanttDto.FillDto(x, odto, 0, 1);
                flights.Add(odto);
            }



            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            //odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flights,
                resgroups,
                ressq,
                fresult.flights_crew

            };
            //////////////////////
            return Ok(oresult);

        }

        [Route("odata/flights/active")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightActive(cnlregs dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.ActiveFlights(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            var fresult = result.data as updateLogResult;
            if (fresult.sendNira)
            {
                foreach (var x in fresult.offIds)
                    await unitOfWork.FlightRepository.NotifyNira((int)x, dto.userName);
            }



            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => dto.fids.Contains(q.ID)).ToListAsync();
            var flights = new List<ViewFlightsGanttDto>();
            foreach (var x in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
                ViewModels.ViewFlightsGanttDto.FillDto(x, odto, 0, 1);
                flights.Add(odto);
            }



            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            //odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flights,
                resgroups,
                ressq
            };
            //////////////////////
            return Ok(oresult);

        }
        //magu38
        [Route("odata/flights/active/group")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightActiveGroup(cnlregs dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.ActiveFlightsGroup(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            var fresult = result.data as updateLogResult;
            if (fresult.sendNira)
            {

                foreach (var x in fresult.offIds)
                    await unitOfWork.FlightRepository.NotifyNira((int)x, dto.userName);
                // foreach (var x in dto.)
                //     await unitOfWork.FlightRepository.NotifyNira((int)x, dto.userName);
            }





            var beginDate = ((DateTime)dto.RefDate).Date;
            var endDate = ((DateTime)dto.RefDate).Date.AddDays((int)dto.RefDays).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => fresult.offIds.Contains(q.ID)
             && q.STDDay >= beginDate && q.STDDay <= endDate
            ).ToListAsync();
            var flights = new List<ViewFlightsGanttDto>();
            foreach (var x in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
                ViewModels.ViewFlightsGanttDto.FillDto(x, odto, 0, 1);
                flights.Add(odto);
            }



            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            //odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flights,
                resgroups,
                ressq
            };
            //////////////////////
            return Ok(oresult);

        }




        [Route("odata/flights/shift")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightsShift(ShiftFlightsDto obj)
        {

            if (obj == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }


            var result = await unitOfWork.FlightRepository.ShiftFlights(obj);
            if (result.Code != HttpStatusCode.OK)
                return result;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            if (obj.nira == 1)
            {
                foreach (var id in obj.ids)
                    await unitOfWork.FlightRepository.NotifyNira(id, obj.userName);
            }

            /////////////////////
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => obj.ids.Contains(q.ID)).ToListAsync();
            var flights = new List<ViewFlightsGanttDto>();
            foreach (var x in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
                ViewModels.ViewFlightsGanttDto.FillDto(x, odto, 0, 1);
                flights.Add(odto);
            }



            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            //odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flights,
                resgroups,
                ressq
            };
            //////////////////////
            return Ok(oresult);

        }
        [Route("odata/flight/planitem/flight/update")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPlanItemFlight(ViewModels.FlightPlanningDto obj)
        {

            if (obj == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            //magu
            //obj.FlightId
            var dateFrom = ((DateTime)obj.DateFrom).Date;
            var dateTo = ((DateTime)obj.DateTo).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.UpdatePlanItemFlight(obj);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            if (obj.SMSNira == 1)
            {
                await unitOfWork.FlightRepository.NotifyNira((int)obj.FlightId, obj.UserName);
            }

            /////////////////////
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => q.ID == obj.FlightId).ToListAsync();
            ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
            ViewModels.ViewFlightsGanttDto.FillDto(fg.First(), odto, 0, 1);


            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flight = odto,
                resgroups,
                ressq
            };
            //////////////////////
            return Ok(oresult);
            //DateTime? dateFirst = null;
            //if (obj.DateFirst != null)
            //    dateFirst = ((DateTime)obj.DateFirst).Date;


            //FlightPlan entity = null;
            //FlightPlanItem entityItem = null;
            //var plan_title = obj.CustomerId.ToString() + "_" + obj.BaseId.ToString() + "_" + obj.RegisterID + "_" + dateFrom.ToShortDateString().Replace("/", "-");
            //entity = await unitOfWork.FlightRepository.GetPlanByTitle(plan_title);

            //if (entity == null)
            //{
            //    entity = new FlightPlan();
            //    unitOfWork.FlightRepository.Insert(entity);
            //    //////Fill Plan ///////////////////
            //    ///  entity.Id = flightplan.Id;
            //    entity.Title = plan_title;
            //    entity.DateFrom = dateFrom;
            //    entity.DateTo = dateTo;
            //    entity.DateFirst = dateFirst;
            //    entity.DateLast = null;
            //    entity.CustomerId = obj.CustomerId;
            //    entity.IsActive = obj.IsActive;
            //    entity.DateActive = obj.DateActive;
            //    entity.Interval = obj.Interval;
            //    entity.BaseId = obj.BaseId;

            //    var month = obj.Months as List<int>;
            //    var days = obj.Days as List<int>;
            //    if (month != null)
            //        foreach (var x in month)
            //            unitOfWork.FlightRepository.Insert(new FlightPlanMonth() { FlightPlan = entity, Month = x });

            //    if (days != null)
            //        foreach (var x in days)
            //            unitOfWork.FlightRepository.Insert(new FlightPlanDay() { FlightPlan = entity, Day = x });

            //    unitOfWork.FlightRepository.CreatePlanCalendar(obj.Id, entity, month, days);
            //    ////////////////////////////////////
            //}
            //bool isEdit = false;
            //int currentPlanId = -1;
            //if (obj.Id == -1)
            //{


            //    entityItem = new FlightPlanItem();

            //    unitOfWork.FlightRepository.Insert(entityItem);
            //}

            //else
            //{

            //    isEdit = true;
            //    entityItem = await unitOfWork.FlightRepository.GetPlanItemById(obj.Id);
            //    currentPlanId = entityItem.FlightPlanId;

            //}



            //if (entity == null)
            //    return Exceptions.getNotFoundException();
            //if (entityItem == null)
            //    return Exceptions.getNotFoundException();




            //////Fill Plan Item ////////////////////
            //entityItem.Id = obj.Id;
            //entityItem.FlightPlan = entity;
            //entityItem.TypeId = obj.TypeId;
            //entityItem.RegisterID = obj.RegisterID;
            //entityItem.FlightTypeID = obj.FlightTypeID;
            //entityItem.AirlineOperatorsID = obj.AirlineOperatorsID;
            //entityItem.FlightNumber = obj.FlightNumber;
            //entityItem.FromAirport = obj.FromAirport;
            //entityItem.ToAirport = obj.ToAirport;
            //entityItem.STD = ((DateTime)obj.STD);//.AddHours(3).AddMinutes(30);
            //entityItem.STA = ((DateTime)obj.STA);//.AddHours(3).AddMinutes(30);
            //entityItem.FlightH = obj.FlightH;
            //entityItem.FlightM = obj.FlightM;
            //entityItem.Unknown = obj.Unknown;
            //entityItem.StatusId = 1;
            //entityItem.RouteId = obj.RouteId;
            ////////////////////////////////////////

            //await unitOfWork.FlightRepository.ProcessPlanErrors(entity, entityItem);

            ////    ViewModels.FlightPlanDto.Fill(entity, dto);







            //var saveResult = await unitOfWork.SaveAsync();
            //if (saveResult.Code != HttpStatusCode.OK)
            //    return saveResult;
            //if (!isEdit)
            //    await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
            //else
            //{
            //    await unitOfWork.FlightRepository.CloseFlightPlanItem(entity.Id, entityItem.Id);
            //    if (currentPlanId != -1)
            //        await unitOfWork.FlightRepository.DeleteEmptyPlan(currentPlanId);
            //    //await unitOfWork.FlightRepository.UpdatePlanItemFlights(entityItem);
            //}
            //saveResult = await unitOfWork.SaveAsync();
            //if (saveResult.Code != HttpStatusCode.OK)
            //    return saveResult;
            //obj.FlightPlanId = entity.Id;
            //obj.Id = entityItem.Id;
            //var view = unitOfWork.FlightRepository.GetViewFlightPlanItems().FirstOrDefault(q => q.Id == obj.Id);

            //return Ok(view);
        }
        [Route("odata/flight/delete/group")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteFlightGroup(dynamic dto)
        {
            var interval = Convert.ToInt32(dto.Interval);
            DateTime intervalFrom = Convert.ToDateTime(dto.IntervalFrom);
            DateTime intervalTo = Convert.ToDateTime(dto.IntervalTo);
            string _days = Convert.ToString(dto.Days);
            var days = _days.Split('_').Select(q => Convert.ToInt32(q)).ToList();
            var checkTime = (int)dto.CheckTime;
            var username = Convert.ToString(dto.UserName);

            var flightId = Convert.ToInt32(dto.Id);
            List<int> result = await unitOfWork.FlightRepository.DeleteFlightGroup(intervalFrom, intervalTo, days, flightId, interval, checkTime,username);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            unitOfWork.FlightRepository.UpdateLogUser(result, username);

            await unitOfWork.SaveAsync();


            return Ok(result);
        }
        [Route("odata/utc")]
        public IHttpActionResult GetUtc()
        {
            var nowOffset = TimeZoneInfo.Local.GetUtcOffset(DateTime.Now).TotalMinutes;
            return Ok(nowOffset);
        }
        [Route("odata/flight/group/save")]
        //2023-11-23
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightGroup(ViewModels.FlightDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var validate = unitOfWork.FlightRepository.ValidateFlight(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;
            var nowOffset = 210;//TimeZoneInfo.Local.GetUtcOffset(DateTime.Now).TotalMinutes;

            var stdOffset = 210;//TimeZoneInfo.Local.GetUtcOffset((DateTime)dto.STD ).TotalMinutes;
            var localSTD = ((DateTime)dto.STD).AddMinutes(stdOffset);
            var _addDay = localSTD.Day == ((DateTime)dto.STD).Day ? 0 : 1;

            var stdHours = ((DateTime)dto.STD).Hour;
            var stdMinutes = ((DateTime)dto.STD).Minute;
            var staHours = ((DateTime)dto.STA).Hour;
            var staMinutes = ((DateTime)dto.STA).Minute;
            var duration = (((DateTime)dto.STA) - ((DateTime)dto.STD)).TotalMinutes;
            // dto.Interval = 2;
            // dto.IntervalFrom = DateTime.Now;
            // dto.IntervalTo = DateTime.Now.AddDays(120);
            // dto.Days = new List<int>() {0};
            // dto.RefDate = DateTime.Now.Date;
            //dto.RefDays = 14;

            var intervalDays = unitOfWork.FlightRepository.GetInvervalDates((int)dto.Interval, (DateTime)dto.IntervalFrom, (DateTime)dto.IntervalTo, dto.Days);


            FlightInformation entity = null;
            FlightChangeHistory changeLog = null;
            //if (dto.ID == -1)
            //{
            //    entity = new FlightInformation();
            //    unitOfWork.FlightRepository.Insert(entity);
            //}

            //else
            //{
            //    entity = await unitOfWork.FlightRepository.GetFlightById(dto.ID);
            //    if (entity == null)
            //        return Exceptions.getNotFoundException();
            //    unitOfWork.FlightRepository.RemoveFlightLink(dto.ID);

            //    changeLog = new FlightChangeHistory()
            //    {
            //        Date = DateTime.Now,
            //        FlightId = entity.ID,

            //    };
            //    unitOfWork.FlightRepository.Insert(changeLog);
            //    changeLog.OldFlightNumer = entity.FlightNumber;
            //    changeLog.OldFromAirportId = entity.FromAirportId;
            //    changeLog.OldToAirportId = entity.ToAirportId;
            //    changeLog.OldSTD = entity.STD;
            //    changeLog.OldSTA = entity.STA;
            //    changeLog.OldStatusId = entity.FlightStatusID;
            //    changeLog.OldRegister = entity.RegisterID;
            //    changeLog.OldOffBlock = entity.ChocksOut;
            //    changeLog.OldOnBlock = entity.ChocksIn;
            //    changeLog.OldTakeOff = entity.Takeoff;
            //    changeLog.OldLanding = entity.Landing;
            //    changeLog.User = dto.UserName;

            //}
            List<FlightInformation> flights = new List<FlightInformation>();
            var str = DateTime.Now.ToString("MMddmmss");
            var flightGroup = Convert.ToInt32(str);
            foreach (var dt in intervalDays)
            {
                entity = new FlightInformation();
                entity.JLNo = dto.UserName;
                unitOfWork.FlightRepository.Insert(entity);
                flights.Add(entity);
                if (entity.STD != null)
                {
                    var oldSTD = ((DateTime)entity.STD).AddMinutes(210).Date;
                    var newSTD = ((DateTime)dto.STD).AddMinutes(210).Date;
                    if (oldSTD != newSTD)
                    {
                        entity.FlightDate = oldSTD;
                    }
                }


                ViewModels.FlightDto.Fill(entity, dto);
                var _fltDate = new DateTime(dt.Year, dt.Month, dt.Day, 1, 0, 0);
                var fltOffset = -1 * 210;//TimeZoneInfo.Local.GetUtcOffset(_fltDate).TotalMinutes;
                entity.FlightGroupID = flightGroup;
                var _std = new DateTime(dt.Year, dt.Month, dt.Day, (int)dto.STDHH, (int)dto.STDMM, 0);
                _std = _std.AddDays(_addDay) .AddMinutes(fltOffset);
                entity.STD = _std;

                entity.STA = ((DateTime)entity.STD).AddMinutes(duration);
                entity.ChocksOut = entity.STD;
                entity.ChocksIn = entity.STA;
                entity.Takeoff = entity.STD;
                entity.Landing = entity.STA;
                entity.BoxId = dto.BoxId;
            }

            //if (dto.ID != -1 && changeLog!=null)
            //{
            //    changeLog.NewFlightNumber = entity.FlightNumber;
            //    changeLog.NewFromAirportId = entity.FromAirportId;
            //    changeLog.NewToAirportId = entity.ToAirportId;
            //    changeLog.NewSTD = entity.STD;
            //    changeLog.NewSTA = entity.STA;
            //    changeLog.NewStatusId = entity.FlightStatusID;
            //    changeLog.NewRegister = entity.RegisterID;
            //    changeLog.NewOffBlock = entity.ChocksOut;
            //    changeLog.NewOnBlock = entity.ChocksIn;
            //    changeLog.NewTakeOff = entity.Takeoff;
            //    changeLog.NewLanding = entity.Landing;
            //}


            //if (dto.LinkedFlight != null)
            //{
            //    var link = new FlightLink()
            //    {
            //        FlightInformation = entity,
            //        Flight2Id = (int)dto.LinkedFlight,
            //        ReasonId = (int)dto.LinkedReason,
            //        Remark = dto.LinkedRemark

            //    };
            //    unitOfWork.FlightRepository.Insert(link);
            //}

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            if (dto.SMSNira == 1)
            {
                foreach (var x in flights)
                    await unitOfWork.FlightRepository.NotifyNira(x.ID, dto.UserName);
            }

            //bip
            var flightIds = flights.Select(q => q.ID).ToList();
            var beginDate = ((DateTime)dto.RefDate).Date;
            var endDate = ((DateTime)dto.RefDate).Date.AddDays((int)dto.RefDays).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => flightIds.Contains(q.ID)
            && q.STDDay >= beginDate && q.STDDay <= endDate
            ).ToListAsync();


            var odtos = new List<ViewFlightsGanttDto>();
            foreach (var f in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();

                ViewModels.ViewFlightsGanttDto.FillDto(f, odto, 0, 1);
                odto.resourceId.Add((int)odto.RegisterID);
                odtos.Add(odto);
            }

            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();




            var oresult = new
            {
                flights = odtos,
                resgroups,
                ressq
            };

            return Ok(/*entity*/oresult);

        }


        public DateTime parseDate(string str)
        {
            var prts = str.Split('-').Select(q=>Convert.ToInt32(q)).ToList();
            return new DateTime(prts[0], prts[1], prts[2], prts[3], prts[4], 0);

        }
        [Route("odata/flight/group/save/utc")]
        //kakoli9
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightGroupUTC(ViewModels.FlightDto dto)
        {
            bool isUtc = true;

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var validate = unitOfWork.FlightRepository.ValidateFlight(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;
            var nowOffset = isUtc ? 0 : TimeZoneInfo.Local.GetUtcOffset(DateTime.Now).TotalMinutes;
            dto.STD = parseDate(dto.STDRAW);
            dto.STA = parseDate(dto.STARAW);
            dto.RefDate= parseDate(dto.RefDateRAW);
            dto.IntervalFrom = parseDate(dto.IntervalFromRAW);
            dto.IntervalTo = parseDate(dto.IntervalToRAW);
            dto.Days = isUtc ? dto.DaysUTC.ToList() : dto.Days;




            var stdOffset =isUtc?0: TimeZoneInfo.Local.GetUtcOffset((DateTime)dto.STD).TotalMinutes;
            var localSTD = ((DateTime)dto.STD).AddMinutes(stdOffset);
            var _addDay = localSTD.Day == ((DateTime)dto.STD).Day ? 0 : 1;

            var stdHours = ((DateTime)dto.STD).Hour;
            var stdMinutes = ((DateTime)dto.STD).Minute;
            var staHours = ((DateTime)dto.STA).Hour;
            var staMinutes = ((DateTime)dto.STA).Minute;
            var duration = (((DateTime)dto.STA) - ((DateTime)dto.STD)).TotalMinutes;
            // dto.Interval = 2;
            // dto.IntervalFrom = DateTime.Now;
            // dto.IntervalTo = DateTime.Now.AddDays(120);
            // dto.Days = new List<int>() {0};
            // dto.RefDate = DateTime.Now.Date;
            //dto.RefDays = 14;

            var intervalDays = unitOfWork.FlightRepository.GetInvervalDates((int)dto.Interval, (DateTime)dto.IntervalFrom, (DateTime)dto.IntervalTo, dto.Days);


            FlightInformation entity = null;
            FlightChangeHistory changeLog = null;
           
            List<FlightInformation> flights = new List<FlightInformation>();
            var str = DateTime.Now.ToString("MMddmmss");
            var flightGroup = Convert.ToInt32(str);
            foreach (var dt in intervalDays)
            {
                entity = new FlightInformation();
                unitOfWork.FlightRepository.Insert(entity);
                flights.Add(entity);
                if (entity.STD != null)
                {
                    var oldSTD = ((DateTime)entity.STD).AddMinutes(270).Date;
                    var newSTD = ((DateTime)dto.STD).AddMinutes(270).Date;
                    if (oldSTD != newSTD)
                    {
                        entity.FlightDate = oldSTD;
                    }
                }


                ViewModels.FlightDto.Fill(entity, dto);
                var _fltDate = new DateTime(dt.Year, dt.Month, dt.Day, 1, 0, 0);
                var fltOffset = isUtc ? 0 : -1 * TimeZoneInfo.Local.GetUtcOffset(_fltDate).TotalMinutes;
                entity.FlightGroupID = flightGroup;
                var _std = new DateTime(dt.Year, dt.Month, dt.Day, (int)dto.STDHH, (int)dto.STDMM, 0);
                _std = _std.AddDays(_addDay).AddMinutes(fltOffset);
                entity.STD = _std;

                entity.STA = ((DateTime)entity.STD).AddMinutes(duration);
                entity.ChocksOut = entity.STD;
                entity.ChocksIn = entity.STA;
                entity.Takeoff = entity.STD;
                entity.Landing = entity.STA;
                entity.BoxId = dto.BoxId;
            }

            //if (dto.ID != -1 && changeLog!=null)
            //{
            //    changeLog.NewFlightNumber = entity.FlightNumber;
            //    changeLog.NewFromAirportId = entity.FromAirportId;
            //    changeLog.NewToAirportId = entity.ToAirportId;
            //    changeLog.NewSTD = entity.STD;
            //    changeLog.NewSTA = entity.STA;
            //    changeLog.NewStatusId = entity.FlightStatusID;
            //    changeLog.NewRegister = entity.RegisterID;
            //    changeLog.NewOffBlock = entity.ChocksOut;
            //    changeLog.NewOnBlock = entity.ChocksIn;
            //    changeLog.NewTakeOff = entity.Takeoff;
            //    changeLog.NewLanding = entity.Landing;
            //}


            //if (dto.LinkedFlight != null)
            //{
            //    var link = new FlightLink()
            //    {
            //        FlightInformation = entity,
            //        Flight2Id = (int)dto.LinkedFlight,
            //        ReasonId = (int)dto.LinkedReason,
            //        Remark = dto.LinkedRemark

            //    };
            //    unitOfWork.FlightRepository.Insert(link);
            //}

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            if (dto.SMSNira == 1)
            {
                foreach (var x in flights)
                    await unitOfWork.FlightRepository.NotifyNira(x.ID, dto.UserName);
            }

            //bip
            var flightIds = flights.Select(q => q.ID).ToList();
            var beginDate = ((DateTime)dto.RefDate).Date;
            var endDate = ((DateTime)dto.RefDate).Date.AddDays((int)dto.RefDays).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => flightIds.Contains(q.ID)
            && q.STDDay >= beginDate && q.STDDay <= endDate
            ).ToListAsync();


            var odtos = new List<ViewFlightsGanttDto>();
            foreach (var f in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();

                ViewModels.ViewFlightsGanttDto.FillDto(f, odto, 0, 1);
                odto.resourceId.Add((int)odto.RegisterID);
                odtos.Add(odto);
            }

            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();




            var oresult = new
            {
                flights = odtos,
                resgroups,
                ressq
            };

            return Ok(/*entity*/oresult);

        }

        //10-17
        //02-28
        [Route("odata/flight/group/update")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightGroupUpdate(ViewModels.FlightDto dto)
        {
            try
            {
                if (dto == null)
                    return Exceptions.getNullException(ModelState);
                dto.CheckTime = 1;
                if (!ModelState.IsValid)
                {

                    return Exceptions.getModelValidationException(ModelState);
                }

                var validate = unitOfWork.FlightRepository.ValidateFlight(dto);
                if (validate.Code != HttpStatusCode.OK)
                    return validate;

                // dto.Interval = 2;
                // dto.IntervalFrom = DateTime.Now;
                // dto.IntervalTo = DateTime.Now.AddDays(120);
                // dto.Days = new List<int>() {  0 };
                // dto.RefDate = DateTime.Now.Date;
                //dto.RefDays = 14;
                var intervalDays = unitOfWork.FlightRepository.GetInvervalDates((int)dto.Interval, (DateTime)dto.IntervalFrom, (DateTime)dto.IntervalTo, dto.Days).Select(q => (Nullable<DateTime>)q).ToList();


                var baseFlight = await unitOfWork.FlightRepository.GetFlightById(dto.ID);
                if (baseFlight == null)
                    return Exceptions.getNotFoundException();

                var stdHoursBF = ((DateTime)baseFlight.STD).Hour;
                var stdMinutesBF = ((DateTime)baseFlight.STD).Minute;
                var staHoursBF = ((DateTime)baseFlight.STA).Hour;
                var staMinutesBF = ((DateTime)baseFlight.STA).Minute;

                var flightIds = await (from x in unitOfWork.FlightRepository.GetViewLegTime()
                                       where x.FlightNumber == baseFlight.FlightNumber && intervalDays.Contains(x.STDDay)
                                       select x.ID).ToListAsync();
                //var flights = await unitOfWork.FlightRepository.GetFlights().Where(q => flightIds.Contains(q.ID)).ToListAsync();
                List<FlightInformation> flights = new List<FlightInformation>();
                if ((int)dto.CheckTime == 0)
                    flights = await unitOfWork.context.FlightInformations.Where(q => flightIds.Contains(q.ID) ).OrderBy(q=>q.STD).ToListAsync();
                else
                    flights = await unitOfWork.context.FlightInformations.Where(q => flightIds.Contains(q.ID) 

                    ).OrderBy(q=>q.STD).ToListAsync();
                var stdOffset = TimeZoneInfo.Local.GetUtcOffset((DateTime)dto.STD).TotalMinutes;
                var localSTD = ((DateTime)dto.STD).AddMinutes(stdOffset);
                var _addDay = localSTD.Day == ((DateTime)dto.STD).Day ? 0 : 1;

                var stdHours = ((DateTime)dto.STD).Hour;
                var stdMinutes = ((DateTime)dto.STD).Minute;
                var staHours = ((DateTime)dto.STA).Hour;
                var staMinutes = ((DateTime)dto.STA).Minute;
                var duration = (((DateTime)dto.STA) - ((DateTime)dto.STD)).TotalMinutes;

                int utcDiff = 0;
                if (flights.Count > 0)
                {
                    var firstFlight = flights.First();
                    var __d1 = ((DateTime)firstFlight.STD).Date;
                    var __d2 = ((DateTime)dto.STD).Date;
                    if (__d1 > __d2)
                        utcDiff = -1;
                    if (((DateTime)firstFlight.STD).Date < ((DateTime)dto.STD).Date)
                        utcDiff =  1;

                }
           
                foreach (var entity in flights)
                {

                    var flt_stdHours = ((DateTime)entity.STD).Hour;
                    var flt_stdMinutes = ((DateTime)entity.STD).Minute;
                    var flt_staHours = ((DateTime)entity.STA).Hour;
                    var flt_staMinutes = ((DateTime)entity.STA).Minute;
                    bool exec = true;
                    if (((int)dto.CheckTime) == 1)
                    {
                        exec = flt_stdHours == stdHoursBF && flt_stdMinutes == stdMinutesBF && flt_staHours == staHoursBF && flt_staMinutes == staMinutesBF;
                    }
                    if (entity.FlightStatusID == 1 && exec)
                    {

                        var changeLog = new FlightChangeHistory()
                        {
                            Date = DateTime.Now,
                            FlightId = entity.ID,

                        };
                        unitOfWork.FlightRepository.Insert(changeLog);
                        changeLog.OldFlightNumer = entity.FlightNumber;
                        changeLog.OldFromAirportId = entity.FromAirportId;
                        changeLog.OldToAirportId = entity.ToAirportId;
                        changeLog.OldSTD = entity.STD;
                        changeLog.OldSTA = entity.STA;
                        changeLog.OldStatusId = entity.FlightStatusID;
                        changeLog.OldRegister = entity.RegisterID;
                        changeLog.OldOffBlock = entity.ChocksOut;
                        changeLog.OldOnBlock = entity.ChocksIn;
                        changeLog.OldTakeOff = entity.Takeoff;
                        changeLog.OldLanding = entity.Landing;
                        changeLog.User = dto.UserName;

                        var oldSTD = (DateTime)entity.STD;



                        var newSTD = new DateTime(oldSTD.Year, oldSTD.Month, oldSTD.Day, stdHours, stdMinutes, 0);
                        var newSTA = newSTD.AddMinutes(duration);
                        if (oldSTD.AddMinutes(270).Date != newSTD.AddMinutes(270).Date)
                            entity.FlightDate = oldSTD.AddDays(utcDiff);
                        ViewModels.FlightDto.FillForGroupUpdate(entity, dto);
                        //entity.FlightGroupID = flightGroup;

                        var _fltDate = new DateTime(oldSTD.Year, oldSTD.Month, oldSTD.Day, 1, 0, 0);
                        //var _fltDate = new DateTime(oldSTD.Year, oldSTD.Month, oldSTD.Day );
                        var fltOffset = -1 * TimeZoneInfo.Local.GetUtcOffset(_fltDate).TotalMinutes;
                        var _std = new DateTime(oldSTD.Year, oldSTD.Month, oldSTD.Day, (int)dto.STDHH, (int)dto.STDMM, 0);
                       // _std = _std.AddMinutes(fltOffset);
                        _std = _std.AddDays(_addDay).AddDays(utcDiff).AddMinutes(fltOffset);

                        entity.JLNo = dto.UserName;
                        entity.STD = _std; //newSTD;
                        entity.STA = _std.AddMinutes(duration); //newSTA;
                        entity.ChocksOut = entity.STD;
                        entity.ChocksIn = entity.STA;
                        entity.Takeoff = entity.STD;
                        entity.Landing = entity.STA;
                        entity.BoxId = dto.BoxId;

                        changeLog.NewFlightNumber = entity.FlightNumber;
                        changeLog.NewFromAirportId = entity.FromAirportId;
                        changeLog.NewToAirportId = entity.ToAirportId;
                        changeLog.NewSTD = entity.STD;
                        changeLog.NewSTA = entity.STA;
                        changeLog.NewStatusId = entity.FlightStatusID;
                        changeLog.NewRegister = entity.RegisterID;
                        changeLog.NewOffBlock = entity.ChocksOut;
                        changeLog.NewOnBlock = entity.ChocksIn;
                        changeLog.NewTakeOff = entity.Takeoff;
                        changeLog.NewLanding = entity.Landing;

                        //var state = unitOfWork.context.Entry(entity).State; //= EntityState.Modified;

                    }
                    else if (exec)
                    {
                        entity.JLNo = dto.UserName;
                        entity.ChrCode = dto.ChrCode;
                        entity.ChrTitle = dto.ChrTitle;
                    }


                }



                var saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;

                if (dto.SMSNira == 1)
                {
                    foreach (var x in flights)
                        await unitOfWork.FlightRepository.NotifyNira(x.ID, dto.UserName);
                }

                //bip
                // var flightIds = flights.Select(q => q.ID).ToList();
                var beginDate = ((DateTime)dto.RefDate).Date;
                var endDate = ((DateTime)dto.RefDate).Date.AddDays((int)dto.RefDays).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => flightIds.Contains(q.ID)
                   && q.STDDay >= beginDate && q.STDDay <= endDate
                ).ToListAsync();


                var odtos = new List<ViewFlightsGanttDto>();
                foreach (var f in fg)
                {
                    ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();

                    ViewModels.ViewFlightsGanttDto.FillDto(f, odto, 0, 1);
                    odto.resourceId.Add((int)odto.RegisterID);
                    odtos.Add(odto);
                }

                var resgroups = from x in fg
                                group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                               into grp
                                select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
                var ressq = (from x in fg
                             group x by new { x.RegisterID, x.Register, x.TypeId }
                         into grp

                             orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                             select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();


                var oflight = odtos.FirstOrDefault(q => q.ID == dto.ID);

                var oresult = new
                {
                    flights = odtos,
                    flight = oflight,
                    resgroups,
                    ressq
                };

                return Ok(/*entity*/oresult);
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null)
                    msg += "  " + ex.InnerException.Message;
                return Ok(msg);
            }
        }

        //10-17
        [Route("odata/flight/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlight(ViewModels.FlightDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var validate = unitOfWork.FlightRepository.ValidateFlight(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            FlightInformation entity = null;
            FlightChangeHistory changeLog = null;
            if (dto.ID == -1)
            {
                entity = new FlightInformation();
                unitOfWork.FlightRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.FlightRepository.GetFlightById(dto.ID);
                if (entity == null)
                    return Exceptions.getNotFoundException();
                unitOfWork.FlightRepository.RemoveFlightLink(dto.ID);

                changeLog = new FlightChangeHistory()
                {
                    Date = DateTime.Now,
                    FlightId = entity.ID,

                };
                unitOfWork.FlightRepository.Insert(changeLog);
                changeLog.OldFlightNumer = entity.FlightNumber;
                changeLog.OldFromAirportId = entity.FromAirportId;
                changeLog.OldToAirportId = entity.ToAirportId;
                changeLog.OldSTD = entity.STD;
                changeLog.OldSTA = entity.STA;
                changeLog.OldStatusId = entity.FlightStatusID;
                changeLog.OldRegister = entity.RegisterID;
                changeLog.OldOffBlock = entity.ChocksOut;
                changeLog.OldOnBlock = entity.ChocksIn;
                changeLog.OldTakeOff = entity.Takeoff;
                changeLog.OldLanding = entity.Landing;
                changeLog.User = dto.UserName;

            }


            if (entity.STD != null)
            {
                var oldSTD = ((DateTime)entity.STD).AddMinutes(270).Date;
                var newSTD = ((DateTime)dto.STD).AddMinutes(270).Date;
                if (oldSTD != newSTD)
                {
                    entity.FlightDate = oldSTD;
                }
            }


            ViewModels.FlightDto.Fill(entity, dto);
            if (dto.ID != -1 && changeLog != null)
            {
                entity.RegisterID = changeLog.OldRegister;
                changeLog.NewFlightNumber = entity.FlightNumber;
                changeLog.NewFromAirportId = entity.FromAirportId;
                changeLog.NewToAirportId = entity.ToAirportId;
                changeLog.NewSTD = entity.STD;
                changeLog.NewSTA = entity.STA;
                changeLog.NewStatusId = entity.FlightStatusID;
                changeLog.NewRegister = entity.RegisterID;
                changeLog.NewOffBlock = entity.ChocksOut;
                changeLog.NewOnBlock = entity.ChocksIn;
                changeLog.NewTakeOff = entity.Takeoff;
                changeLog.NewLanding = entity.Landing;
            }
            entity.BoxId = dto.BoxId;

            if (dto.LinkedFlight != null)
            {
                var link = new FlightLink()
                {
                    FlightInformation = entity,
                    Flight2Id = (int)dto.LinkedFlight,
                    ReasonId = (int)dto.LinkedReason,
                    Remark = dto.LinkedRemark

                };
                unitOfWork.FlightRepository.Insert(link);
            }

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            if (dto.SMSNira == 1)
            {
                await unitOfWork.FlightRepository.NotifyNira(entity.ID, dto.UserName);
            }

            //bip
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => q.ID == entity.ID).ToListAsync();
            ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
            ViewModels.ViewFlightsGanttDto.FillDto(fg.First(), odto, 0, 1);


            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flight = odto,
                resgroups,
                ressq
            };

            return Ok(/*entity*/oresult);

        }


        [Route("odata/duties/crew/dates/{id}")]
        public async Task<IHttpActionResult> GetCPCrewDuties(DateTime? from, DateTime? to, int id)
        {
            DateTime dfrom = from == null ? DateTime.MinValue.Date : ((DateTime)from).Date;
            DateTime dto = to == null ? DateTime.MaxValue.Date : ((DateTime)to).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            DateTime dtod = dto.Date;


            var duties = await unitOfWork.FlightRepository.GetViewFDPFlightDetail().Where(q => q.CrewId == id && q.DutyStartLocal >= dfrom && q.DutyStartLocal <= dto).OrderByDescending(q => q.DutyStartLocal).ToListAsync();


            var grps = from x in duties
                       group x by x.DutyTypeTitle into grp
                       select new
                       {
                           count = grp.Count(),
                           title = grp.Key,
                           duty = grp.Sum(q => q.Duty),

                       };

            var result = new
            {
                duties,
                grps,
                total = duties.Sum(q => q.Duty),
                count = duties.Count(),
                period = dto.Subtract(dfrom).Days,
                bl = duties.Sum(q => q.BlockTime),
                fl = duties.Sum(q => q.FlightTime),

            };
            return Ok(result);

        }
        [Route("odata/flights/crew/dates/{id}")]
        public async Task<IHttpActionResult> GetCPCrewFlights(DateTime? from, DateTime? to, int id)
        {
            DateTime dfrom = from == null ? DateTime.MinValue.Date : ((DateTime)from).Date;
            DateTime dto = to == null ? DateTime.MaxValue.Date : ((DateTime)to).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            DateTime dtod = dto.Date;



            var flights = await (from q in unitOfWork.FlightRepository.GetViewFlightCrewXes()
                                 where q.STDLocal >= dfrom && q.STDLocal <= dto && q.CrewId == id
                                 select new
                                 {
                                     q.NightTakeOff,
                                     q.NightLanding,
                                     q.DayLanding,
                                     q.DayTakeOff,
                                 }

                               ).ToListAsync();



            var result = new
            {

                period = dto.Subtract(dfrom).Days,

                legs = flights.Count(),
                dayto = flights.Where(q => q.DayTakeOff == 1).Count(),
                dayla = flights.Where(q => q.DayLanding == 1).Count(),
                nightto = flights.Where(q => q.NightTakeOff == 1).Count(),
                nightla = flights.Where(q => q.NightLanding == 1).Count(),
            };
            return Ok(result);

        }
        [Route("odata/ftl/crew/dates/{id}")]
        public async Task<IHttpActionResult> GetCPCrewFTL(DateTime? from, DateTime? to, int id)
        {
            DateTime dfrom = from == null ? DateTime.MinValue.Date : ((DateTime)from).Date;
            DateTime dto = to == null ? DateTime.MaxValue.Date : ((DateTime)to).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            DateTime dtod = dto.Date;



            var ftl = await unitOfWork.FlightRepository.GetViewCrewTimeDetail().Where(q => q.Id == id && q.CDate == dtod).FirstOrDefaultAsync();


            var result = new
            {


                period = dto.Subtract(dfrom).Days,

                ftl,

            };
            return Ok(result);

        }

        [Route("odata/fdp/crew/dates/{id}")]

        [EnableQuery]
        //soli
        public async Task<IHttpActionResult> GetCPCrewFDPs(DateTime? from, DateTime? to, int id)
        {
            DateTime dfrom = from == null ? DateTime.MinValue.Date : ((DateTime)from).Date;
            DateTime dto = to == null ? DateTime.MaxValue.Date : ((DateTime)to).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            DateTime dtod = dto.Date;


            var duties = await unitOfWork.FlightRepository.GetViewFDPFlightDetail().Where(q => q.CrewId == id && q.DutyStartLocal >= dfrom && q.DutyStartLocal <= dto).OrderByDescending(q => q.DutyStartLocal).ToListAsync();
            var ftl = await unitOfWork.FlightRepository.GetViewCrewTimeDetail().Where(q => q.Id == id && q.CDate == dtod).FirstOrDefaultAsync();
            var flights = await (from q in unitOfWork.FlightRepository.GetViewFlightCrewXes()
                                 where q.STDLocal >= dfrom && q.STDLocal <= dto && q.CrewId == id
                                 select new
                                 {
                                     q.NightTakeOff,
                                     q.NightLanding,
                                     q.DayLanding,
                                     q.DayTakeOff,
                                 }

                               ).ToListAsync();

            var grps = from x in duties
                       group x by x.DutyTypeTitle into grp
                       select new
                       {
                           count = grp.Count(),
                           title = grp.Key,
                           duty = grp.Sum(q => q.Duty),

                       };

            var result = new
            {
                duties,
                grps,
                total = duties.Sum(q => q.Duty),
                count = duties.Count(),
                period = dto.Subtract(dfrom).Days,
                bl = duties.Sum(q => q.BlockTime),
                fl = duties.Sum(q => q.FlightTime),
                ftl,
                legs = flights.Count(),
                dayto = flights.Where(q => q.DayTakeOff == 1).Count(),
                dayla = flights.Where(q => q.DayLanding == 1).Count(),
                nightto = flights.Where(q => q.NightTakeOff == 1).Count(),
                nightla = flights.Where(q => q.NightLanding == 1).Count(),
            };
            return Ok(result);

        }



        [Route("odata/time/sunflight")]
        [EnableQuery]
        //soli
        public async Task<IHttpActionResult> GetSunFlight(DateTime dep, DateTime arr, string fid, string tid)
        {
            var suntime = await unitOfWork.FlightRepository.GetSunFlight(dep, arr, fid, tid);
            //var result = suntimes.results;
            //var civil_twilight_begin1 = Convert.ToString(result.civil_twilight_begin);
            //var civil_twilight_begin =Convert.ToDateTime( result.civil_twilight_begin);
            var offset = TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow);
            return Ok(suntime);

        }


        [Route("odata/sun/update/{year}/{month}/{day}")]
        [AcceptVerbs("GET")]
        //soli
        public async Task<IHttpActionResult> GetSun(int year, int month, int day)
        {
            var date = new DateTime(year, month, day);
            var suntime = await unitOfWork.FlightRepository.updateSun(date);
            //var result = suntimes.results;
            //var civil_twilight_begin1 = Convert.ToString(result.civil_twilight_begin);
            //var civil_twilight_begin =Convert.ToDateTime( result.civil_twilight_begin);
            var result = new
            {
                status = 1,
            };
            return Ok(result);

        }


        [Route("odata/time/sun")]
        [EnableQuery]
        //soli
        public async Task<IHttpActionResult> GetSuntimes()
        {
            var suntime = await unitOfWork.FlightRepository.GetSun(135502, DateTime.Now.Date);
            //var result = suntimes.results;
            //var civil_twilight_begin1 = Convert.ToString(result.civil_twilight_begin);
            //var civil_twilight_begin =Convert.ToDateTime( result.civil_twilight_begin);
            var offset = TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow);
            return Ok(suntime);

        }


        [Route("odata/fdp/crew/single/{id}")]

        [EnableQuery]
        //soli
        public async Task<IHttpActionResult> GetCPCrewFDP(int id)
        {


            var result = await unitOfWork.FlightRepository.GetViewFDPFlightDetail().Where(q => q.Id == id).FirstOrDefaultAsync();

            return Ok(result);

        }
        [Route("odata/cp/fdp/create")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDP(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            int crewId = Convert.ToInt32(dto.crewId);

            var result = await unitOfWork.FlightRepository.CreateFDP(crewId);

            //var saveResult = await unitOfWork.SaveAsync();
            //if (saveResult.Code != HttpStatusCode.OK)
            //    return saveResult;



            return Ok(result);

        }



        [Route("odata/cp/duty/create")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPDuty(DutyDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);


            var result = await unitOfWork.FlightRepository.CreateDuty(dto);

            //var saveResult = await unitOfWork.SaveAsync();
            //if (saveResult.Code != HttpStatusCode.OK)
            //    return saveResult;



            return Ok(result);

        }

        [Route("odata/cp/fdp/flight/add")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDPFlightAdd(ViewModels.FlightDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);



            var result = await unitOfWork.FlightRepository.AddFlightToFDP(dto);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return result;

        }

        [Route("odata/cp/fdp/update")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDPUpdate(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);

            var Id = Convert.ToInt32(dto.Id);

            var result = await unitOfWork.FlightRepository.UpdateCPFDP(Id);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return result;

        }

        [Route("odata/cp/fdp/flight/update")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDPFlightUpdate(ViewModels.FlightDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);



            var result = await unitOfWork.FlightRepository.UpdateFlightToFDP(dto);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return result;

        }
        [Route("odata/cp/fdp/flight/update/direct")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDPFlightUpdateDirect(ViewModels.FlightDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);



            var result = await unitOfWork.FlightRepository.UpdateFlightCPDirect(dto);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return result;

        }
        [Route("odata/cp/fdp/rt")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDPUpdateRT(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);

            int id = Convert.ToInt32(dto.Id);
            DateTime dt = Convert.ToDateTime(dto.rt);
            dt = dt.ToUniversalTime();

            var result = await unitOfWork.FlightRepository.UpdateFDPReportingTime(id, dt);

            return result;

        }
        [Route("odata/cp/fdp/flight/status")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDPFlightUpdateStatus(ViewModels.FlightDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var result = await unitOfWork.FlightRepository.UpdateCPFlightStatus(dto);


            return result;

        }
        [Route("odata/cp/fdp/flight/remove")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFDPFlightRemove(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);

            int id = Convert.ToInt32(dto.Id);

            var result = await unitOfWork.FlightRepository.RemoveFlightFromFDP(id);


            return result;

        }

        [Route("odata/cp/flight/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCPFlight(ViewModels.CPFlight dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.SaveCPFlight(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(dto);

        }
        //2020-11-22
        [Route("odata/fdps/off")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFDPOff(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);

            var strFdps = Convert.ToString(dto.fdps);
            var strFdpItems = Convert.ToString(dto.items);

            var result = await unitOfWork.FlightRepository.RemoveItemsFromFDP(strFdpItems, strFdps);


            return result;

        }
        //piano
        [Route("odata/flights/off")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightsOff(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);

            var strFlights = Convert.ToString(dto.flights);
            var crewId = Convert.ToInt32(dto.crewId);
            var reason = Convert.ToInt32(dto.reason);
            var remark = Convert.ToString(dto.remark);
            var notify = Convert.ToInt32(dto.notify);
            var noflight = Convert.ToInt32(dto.noflight);
            var username = Convert.ToString(dto.UserName);

            var result = await unitOfWork.FlightRepository.RemoveItemsFromFDP(strFlights, crewId, reason, remark, notify, noflight, username);


            return result;

        }


        [Route("odata/stby/activate")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostStbyActivate(dynamic dto)
        {
            //internal async Task<CustomActionResult> ActivateStandby(int crewId, int stbyId, string fids, int rank)
            if (dto == null)
                return Exceptions.getNullException(ModelState);

            int crewId = Convert.ToInt32(dto.crewId);
            int stbyId = Convert.ToInt32(dto.stbyId);
            string fids = Convert.ToString(dto.fids);
            int rank = Convert.ToInt32(dto.rank);
            int index = -1;
            if (dto.index != null)
            {
                index = Convert.ToInt32(dto.index);
            }

            var result = await unitOfWork.FlightRepository.ActivateStandby(crewId, stbyId, fids, rank, index);


            return result;

        }

        [Route("odata/stby/activate/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostStbyActivateDelete(dynamic dto)
        {
            //internal async Task<CustomActionResult> ActivateStandby(int crewId, int stbyId, string fids, int rank)
            if (dto == null)
                return Exceptions.getNullException(ModelState);

            int fdpId = Convert.ToInt32(dto.fdpId);


            var result = await unitOfWork.FlightRepository.DeleteActivatedStandby(fdpId);


            return result;

        }




        [Route("odata/flight/departure/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightDeparture(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightDeparture(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            if ((bool)result.data)
            {
                unitOfWork.FlightRepository.SetFlightStatusWeather(dto.ID, dto.Takeoff, 2);
            }

            return Ok(result);

        }
        //10-04
        [Route("odata/flight/log/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightLog(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightLog(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            //var saveResult =   unitOfWork.SaveActionResult();
            //if (saveResult.Code != HttpStatusCode.OK)
            //    return saveResult;



            //if ((bool)result.data)
            //{
            //    unitOfWork.FlightRepository.SetFlightStatusWeather(dto.ID, dto.Takeoff, 2);
            //}


            //2
            //internal async Task<CustomActionResult> RemoveItemsFromFDP(string strItems, int crewId, int reason, string remark, int notify, int noflight)

            var fresult = result.data as updateLogResult;
            if (fresult.offIds != null && fresult.offIds.Count > 0)
            {
                var disoffIds = fresult.offIds.Distinct().ToList();
                foreach (var crewid in disoffIds)
                {
                    await unitOfWork.FlightRepository.RemoveItemsFromFDP(fresult.flight.ToString(), (int)crewid, 2, "Flight Cancellation - Removed by AirPocket.", 0, 0);
                }
            }

            if (/*dto.SendNiraSMS==1*/fresult.sendNira)
            {
              //  await unitOfWork.FlightRepository.NotifyNira(dto.ID, dto.UserName);
            }

            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => q.ID == fresult.flight).ToListAsync();
            ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
            ViewModels.ViewFlightsGanttDto.FillDto(fg.First(), odto, 0, 1);


            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flight = odto,
                resgroups,
                ressq
            };
            //await unitOfWork.FlightRepository.CreateMVTMessage(dto.ID,dto.UserName);
            //6-28
            unitOfWork.FlightRepository.CreateMVTMessage(dto.ID, dto.UserName);
            return Ok(oresult);

        }

        [Route("odata/flight/log/remark/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightLogRemark(DtoLogRemark dto)
        {
            System.Globalization.PersianCalendar pc = new System.Globalization.PersianCalendar();
            var gd = pc.ToDateTime(1399, 10, 1, 0, 0, 0, 0);


            if (dto == null)
                return Exceptions.getNullException(ModelState);


            var result = await unitOfWork.FlightRepository.UpdateFlightLogRemark(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(saveResult);

        }


        [Route("odata/leg/{id}")]
        // [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetLeg(int id)
        {
            var leg = await unitOfWork.FlightRepository.GetViewLegTime().FirstOrDefaultAsync(q => q.ID == id);
            return Ok(leg);

        }

        public DateTime? ConvertToDateTime(string str)
        {
            if (String.IsNullOrEmpty(str))
                return null;
            var year = Convert.ToInt32(str.Substring(0, 4));
            var month = Convert.ToInt32(str.Substring(4, 2));
            var day = Convert.ToInt32(str.Substring(6, 2));
            var hour = Convert.ToInt32(str.Substring(8, 2));
            var minute = Convert.ToInt32(str.Substring(10, 2));
            return new DateTime(year, month, day, hour, minute, 0);

        }
        //10-04
        [Route("odata/flight/jlog/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightJLog(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var Id = Convert.ToInt32(dto.Id);
            DateTime? offblock = ConvertToDateTime(Convert.ToString(dto.OffBlock));

            DateTime? onblock = ConvertToDateTime(Convert.ToString(dto.OnBlock));
            DateTime? takeoff = ConvertToDateTime(Convert.ToString(dto.TakeOff));
            DateTime? landing = ConvertToDateTime(Convert.ToString(dto.Landing));

            int? pflr = null;
            try
            {
                pflr = Convert.ToInt32(dto.PFLR) == -1 ? null : Convert.ToInt32(dto.PFLR);
            }
            catch(Exception ex)
            {

            }
            
            //string pflr = Convert.ToString(dto.PFLR);

            int? FuelUnitID = dto.FuelUnitID==null?null: Convert.ToInt32(dto.FuelUnitID);
            double? FuelArrival = dto.FuelArrival == null ? null : (Nullable<double>)Convert.ToDouble(dto.FuelArrival);
            double? FuelDeparture = dto.FuelDeparture == null ? null : (Nullable<double>)Convert.ToDouble(dto.FuelDeparture);
            double? UsedFuel = dto.UsedFuel == null ? null : (Nullable<double>)Convert.ToDouble(dto.UsedFuel);
            double? FPFuel = dto.FPFuel == null ? null : (Nullable<double>)Convert.ToDouble(dto.FPFuel);

            int? unitId = dto.FuelUnitID == null ? null : (Nullable<int>)Convert.ToInt32(dto.FuelUnitID);

            var result = await unitOfWork.FlightRepository.UpdateFlightJLog(Id, offblock, onblock, takeoff, landing, pflr, FuelArrival, FuelDeparture, UsedFuel, unitId, FPFuel);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);
            //return Ok(true);

        }


        [Route("odata/flight/delays/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightDelays(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = unitOfWork.FlightRepository.UpdateDelays(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);

        }

        [Route("odata/flight/register/assign")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightRegisterAssign(ViewModels.FlightRegisterDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.AssignFlightRegister(dto);


            if (!(bool)result.data)
                return result;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);

        }


        [Route("odata/flight/register/change")]
        //dooltopol
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightRegisterChange(ViewModels.FlightRegisterChangeLogDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }


            var result = await unitOfWork.FlightRepository.ChangeFlightRegister(dto);


            // if (result.data != null)
            //     return result;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            if (result.data != null)
            {
                var obj = result.data as List<object>;
                if (obj != null && !string.IsNullOrEmpty(obj[1].ToString()) && !string.IsNullOrEmpty(obj[0].ToString()))
                {
                    //doolpardaz
                    // var offResult = await unitOfWork.FlightRepository.RemoveItemsFromFDP(obj[1], obj[0], " due to change of aircraft type.");
                    var offResult = await unitOfWork.FlightRepository.RemoveItemsFromFDPByRegisterChange(obj[2].ToString(), obj[3].ToString());


                }
                if (obj != null && obj[4] != null)
                {
                    var tcitems = obj[4] as List<TypeChangeDto>;
                    if (tcitems != null)
                    {
                        await unitOfWork.NotificationRepository.SendGroupNotificationRegisterTypeChange(tcitems);
                    }

                }
            }

            // await unitOfWork.FlightRepository.NotifyNira((int)obj.FlightId,obj.UserName);
            foreach (var x in dto.Flights)
            {
                await unitOfWork.FlightRepository.NotifyNira((int)x, dto.UserName, dto.NewRegisterId.ToString());
            }

            return Ok(result);

        }

        [Route("odata/flight/register/change2")]
        //dooltopoli
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightRegisterChange2(ViewModels.FlightRegisterChangeLogDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }


            var result = await unitOfWork.FlightRepository.ChangeFlightRegister2(dto);


            // if (result.data != null)
            //     return result;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            if (result.data != null)
            {
                var obj = result.data as List<object>;
                if (obj != null && !string.IsNullOrEmpty(obj[1].ToString()) && !string.IsNullOrEmpty(obj[0].ToString()))
                {
                    //doolpardaz
                    // var offResult = await unitOfWork.FlightRepository.RemoveItemsFromFDP(obj[1], obj[0], " due to change of aircraft type.");
                    var offResult = await unitOfWork.FlightRepository.RemoveItemsFromFDPByRegisterChange(obj[2].ToString(), obj[3].ToString());


                }
                if (obj != null && obj[4] != null)
                {
                    var tcitems = obj[4] as List<TypeChangeDto>;
                    if (tcitems != null)
                    {
                        await unitOfWork.NotificationRepository.SendGroupNotificationRegisterTypeChange(tcitems);
                    }

                }
            }

            // await unitOfWork.FlightRepository.NotifyNira((int)obj.FlightId,obj.UserName);
            foreach (var x in dto.Flights)
            {
                await unitOfWork.FlightRepository.NotifyNira((int)x, dto.UserName, dto.NewRegisterId.ToString());
            }
            ////////////////////////////////////
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => dto.Flights.Contains(q.ID)).ToListAsync();
            var flights = new List<ViewFlightsGanttDto>();
            foreach (var x in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
                ViewModels.ViewFlightsGanttDto.FillDto(x, odto, 0, 1);
                flights.Add(odto);
            }



            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            //odto.resourceId.Add((int)odto.RegisterID);


            var oresult = new
            {
                flights,
                resgroups,
                ressq
            };
            ///////////////////////////////////
            return Ok(oresult);

        }

        [Route("odata/flight/register/change/notify")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostNotifyFlightRegisterChangeGroup(ViewModels.FlightRegisterChangeLogDto dto)
        {
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var result = await unitOfWork.FlightRepository.NotifyChangeFlightRegisterGroup(dto);
            return Ok(result);
        }
        //2022-01-15
        //qeshm
        [Route("odata/flight/groups/create")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightGroupCreate(ViewModels.FlightRegisterChangeLogDto dto)
        {
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var result = await unitOfWork.FlightRepository.CreateFlightsGroup(dto);
            return Ok(result);
        }
        [Route("odata/flight/groups/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightGroupDelete(ViewModels.FlightRegisterChangeLogDto dto)
        {
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var result = await unitOfWork.FlightRepository.DeleteFlightsGroup(dto);
            return Ok(result);
        }


        [Route("odata/catering/add")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCateringItemAdd(dynamic dto)
        {
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var result = await unitOfWork.FlightRepository.CateringItemAdd(dto);
            return Ok(result);
        }

        [Route("odata/catering/remove")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCateringItemRemove(dynamic dto)
        {
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }
            var result = await unitOfWork.FlightRepository.CateringItemRemove(dto);
            return Ok(result);
        }
        [Route("odata/catering/items/{id}")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetCateringItems(int id)
        {

            var result = await unitOfWork.FlightRepository.GetCateringItems(id);

            return Ok(result);

        }

        [Route("odata/catering/report/{type}")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetCateringReport(int type, DateTime df, DateTime dt)
        {
            dt = dt.Date;
            df = df.Date;
            var result = await unitOfWork.FlightRepository.GetCateringReport(type, df, dt);

            return Ok(result);

        }

        [Route("odata/catering/codes")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetCateringCodes()
        {

            var result = await unitOfWork.FlightRepository.GetCateringCodes();

            return Ok(result);

        }

        //10-27
        [Route("odata/flight/register/change/group")]
        //2022-01-18
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightRegisterChangeGroup(ViewModels.FlightRegisterChangeLogDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }


            var result = await unitOfWork.FlightRepository.ChangeFlightRegisterGroup(dto);


            // if (result.data != null)
            //     return result;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            List<int> _flts = new List<int>();
            if (result.data != null)
            {
                var obj = result.data as List<object>;
                if (obj != null && obj.Count == 1)
                {
                    _flts = obj[0] as List<int>;
                }
                else
                {
                    if (obj != null && !string.IsNullOrEmpty(obj[1].ToString()) && !string.IsNullOrEmpty(obj[0].ToString()))
                    {
                        //doolpardaz
                        // var offResult = await unitOfWork.FlightRepository.RemoveItemsFromFDP(obj[1], obj[0], " due to change of aircraft type.");
                        var offResult = await unitOfWork.FlightRepository.RemoveItemsFromFDPByRegisterChange(obj[2].ToString(), obj[3].ToString());


                    }
                    if (obj != null && obj[4] != null)
                    {
                        var tcitems = obj[4] as List<TypeChangeDto>;
                        if (tcitems != null)
                        {
                            await unitOfWork.NotificationRepository.SendGroupNotificationRegisterTypeChange(tcitems);
                        }

                    }
                    if (obj != null && obj[5] != null)
                    {
                        _flts = obj[5] as List<int>;
                    }
                }

            }

            // await unitOfWork.FlightRepository.NotifyNira((int)obj.FlightId,obj.UserName);
            foreach (var x in dto.Flights)
            {
                await unitOfWork.FlightRepository.NotifyNira((int)x, dto.UserName, dto.NewRegisterId.ToString());
            }
            ////////////////////////////////////
            var beginDate = ((DateTime)dto.RefDate).Date;
            var endDate = ((DateTime)dto.RefDate).Date.AddDays((int)dto.RefDays).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var fg = await unitOfWork.FlightRepository.GetViewFlightGantts().Where(q => _flts.Contains(q.ID)
            && q.STDDay >= beginDate && q.STDDay <= endDate
            ).ToListAsync();
            var flights = new List<ViewFlightsGanttDto>();
            foreach (var x in fg)
            {
                ViewModels.ViewFlightsGanttDto odto = new ViewFlightsGanttDto();
                ViewModels.ViewFlightsGanttDto.FillDto(x, odto, 0, 1);
                flights.Add(odto);
            }



            var resgroups = from x in fg
                            group x by new { x.AircraftType, AircraftTypeId = x.TypeId }
                           into grp
                            select new { groupId = grp.Key.AircraftTypeId, Title = grp.Key.AircraftType };
            var ressq = (from x in fg
                         group x by new { x.RegisterID, x.Register, x.TypeId }
                     into grp

                         orderby unitOfWork.FlightRepository.getOrderIndex(grp.Key.Register, new List<string>())
                         select new { resourceId = grp.Key.RegisterID, resourceName = grp.Key.Register, groupId = grp.Key.TypeId }).ToList();

            //odto.resourceId.Add((int)odto.RegisterID);

            var fltgroups = await unitOfWork.FlightRepository.GetFlightGroupItems(beginDate, endDate);

            var oresult = new
            {
                flights,
                resgroups,
                fltgroups,
                ressq
            };
            ///////////////////////////////////
            return Ok(oresult);

        }

        [Route("odata/flight/apply/{id}")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightAppy(int id)
        {


            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.ApplyFlight(id);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);

        }

        [Route("odata/flight/offblock")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightOffBlock(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightOffBlock(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            unitOfWork.FlightRepository.SetFlightStatusWeather(dto.ID, (DateTime)dto.ChocksOut, 14);

            return Ok(result);

        }
        [Route("odata/crew/reportingtime")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostReportingTime(dynamic dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            //  var result = await unitOfWork.FlightRepository.UpdateFlightOffBlock(dto);

            var crewid = Convert.ToInt32(dto.CrewId);
            var fdpId = Convert.ToInt32(dto.FDPId);
            var offset = Convert.ToInt32(dto.Offset);

            var Date = Convert.ToDateTime(dto.Date);
            await unitOfWork.FlightRepository.UpdateReportingTime(crewid, fdpId, Date, offset);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);

        }

        [Route("odata/flight/onblock")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightOnBlock(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightOnBlock(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            unitOfWork.FlightRepository.SetFlightStatusWeather(dto.ID, (DateTime)dto.ChocksIn, 15);

            return Ok(result);

        }

        [Route("odata/flight/takeoff")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightTakeOff(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightTakeOff(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            unitOfWork.FlightRepository.SetFlightStatusWeather(dto.ID, (DateTime)dto.Takeoff, 2);

            return Ok(result);

        }

        [Route("odata/flight/landing")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightLanding(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightLanding(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            unitOfWork.FlightRepository.SetFlightStatusWeather(dto.ID, (DateTime)dto.Landing, 3);

            return Ok(result);

        }


        [Route("odata/flight/arrival/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightArrival(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }


            var result = await unitOfWork.FlightRepository.UpdateFlightArrival(dto);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            if ((bool)result.data)
            {
                unitOfWork.FlightRepository.SetFlightStatusWeather(dto.ID, dto.Landing, 3);
            }

            return Ok(result);

        }


        [Route("odata/flights/plan/item/permits/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPermit(dynamic dto)
        {



            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var Id = Convert.ToInt32(dto.Id);
            var FlightPlanId = Convert.ToInt32(dto.FlightPlanId);
            var PermitId = Convert.ToInt32(dto.PermitId);
            var Date = Convert.ToDateTime(dto.Date).Date;
            var DateFlight = Convert.ToDateTime(dto.DateFlight).Date;
            var CalanderId = Convert.ToInt32(dto.CalanderId);
            var Remark = dto.Remark.ToString();


            //  var validate = unitOfWork.FlightRepository.ValidateFlight(dto);
            //  if (validate.Code != HttpStatusCode.OK)
            //   return validate;

            FlightPlanItemPermit entity = null;

            if (Id == -1)
            {
                entity = new FlightPlanItemPermit();
                entity.Id = Id;
                unitOfWork.FlightRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.FlightRepository.GetFlightPlanItemPermitById(Id);
                if (entity == null)
                    return Exceptions.getNotFoundException();

            }

            entity.FlightPlanId = FlightPlanId;
            entity.PermitId = PermitId;
            entity.Remark = Remark;
            entity.Date = Date;
            entity.DateFlight = DateFlight;
            entity.CalanderId = CalanderId;




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(entity);

        }
        [Route("odata/flight/cancel")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightCancel(ViewModels.FlightCancelDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightCancel(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            if ((bool)result.data)
            {
                unitOfWork.FlightRepository.SetFlightStatusWeather(dto.FlightId, dto.CancelDate, 4);
            }

            return Ok(result);

        }


        [Route("odata/flight/ramp")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightRamp(ViewModels.FlightRampDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightRamp(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            if ((bool)result.data)
            {
                unitOfWork.FlightRepository.SetFlightStatusWeather(dto.FlightId, dto.RampDate, 9);
            }

            return Ok(result);

        }

        [Route("odata/flight/redirect")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightRedirect(ViewModels.FlightRedirectDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightRedirect(dto);




            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            if ((bool)result.data)
            {
                unitOfWork.FlightRepository.SetFlightStatusWeather(dto.FlightId, dto.RedirectDate, 17);
            }

            return Ok(result);

        }


        [Route("odata/flight/pax")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightPax(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightPax(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);

        }

        [Route("odata/flight/cargo")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightCargo(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightCargo(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);

        }

        [Route("odata/flight/fuel/departure")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightFuelDeparture(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightFuelDeparture(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);

        }

        [Route("odata/flight/fuel/arrival")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostFlightFuelArrival(ViewModels.FlightSaveDto dto)
        {

            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {

                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.FlightRepository.UpdateFlightFuelArrival(dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);

        }

        [Route("odata/report/delay/daily/{cid}")]

        public async Task<IHttpActionResult> GetReportDelayDaily(int cid, DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date;
            var result = await unitOfWork.FlightRepository.GetReportDelayDaily(cid, df, dt);

            return Ok(result);

        }

        [Route("odata/report/delay/yearly/{cid}")]

        public async Task<IHttpActionResult> GetReportDelayYearlyTotal(int cid)
        {

            var result = await unitOfWork.FlightRepository.GetReportDelayYearlyTotal(cid);

            return Ok(result);

        }

        [Route("odata/roster/method")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterFunction(RosterMethodDto data, DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            //  var result = await unitOfWork.FlightRepository.RosterFunctionTotal(data, df, dt);
            var result = await unitOfWork.FlightRepository.RosterFunctionTest(data, df, dt);

            return Ok(result);

        }

        [Route("odata/roster/fdp/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostRosterDeleteFDP(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);



            // var result = await unitOfWork.FlightRepository.boxPlanItems(ids,cid);
            var result = await unitOfWork.FlightRepository.DeleteFDP(id);
            //if (!string.IsNullOrEmpty(result))
            //   return new CustomActionResult(HttpStatusCode.NotAcceptable, result);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(result);
        }
          
        [Route("odata/roster/fdp/save")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterFDPSave(RosterFDPDto dto)
        {

            var result = await unitOfWork.FlightRepository.saveFDP(dto);

            return Ok(result);

        }
        //magu2-23
        [Route("odata/roster/fdp/nocrew/save")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterFDPNoCrewSave(dynamic dto)
        {
            var userId = Convert.ToInt32(dto.userId);
            var flightId = Convert.ToInt32(dto.flightId);
            var code = Convert.ToString(dto.code);
            var result = await unitOfWork.FlightRepository.saveFDPNoCrew(userId, flightId, code);

            return Ok(result);

        }

        [Route("odata/roster/fdp/nocrew/group/save")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterFDPNoCrewSaveGroup(dynamic dto)
        {
            var userId = Convert.ToInt32(dto.userId);
            string flightIds = Convert.ToString(dto.flightIds);

            var code = Convert.ToString(dto.code);
            var result = await unitOfWork.FlightRepository.saveFDPNoCrew2(userId, flightIds.Split('_').Select(q => Convert.ToInt32(q)).ToList(), code);

            return Ok(result);

        }

        [Route("odata/roster/fdp/nocrew/delete")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterFDPNoCrewDelete(dynamic dto)
        {
            var userId = Convert.ToInt32(dto.userId);
            var flightId = Convert.ToInt32(dto.flightId);

            var result = await unitOfWork.FlightRepository.deleteFDPNoCrew(userId, flightId);

            return Ok(result);

        }


        [Route("odata/roster/stby/save")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterSTBYSave(dynamic dto)
        {

            var result = await unitOfWork.FlightRepository.SaveSTBY(dto);

            return Ok(result);

        }
        //soha2
        [Route("odata/roster/fdps")]
        public async Task<IHttpActionResult> GetCrewDuties(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);


            var result = await unitOfWork.FlightRepository.getRosterFDPDtos(df, dt);

            return Ok(result);

        }
        [Route("odata/roster/offitems")]
        public async Task<IHttpActionResult> GetOffItems(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);


            var result = await unitOfWork.FlightRepository.getViewOffItems(df, dt);

            return Ok(result);

        }
        [Route("odata/coord/save/{lt}/{lng}/{uid}")]
        public async Task<IHttpActionResult> GetSaveCoord(decimal lt, decimal lng, int uid)
        {



            var result = await unitOfWork.FlightRepository.SaveCoord(lt, lng, uid);

            return Ok(result);

        }
        [Route("odata/roster/fdps/{crewId}/{year}/{month}")]
        public async Task<IHttpActionResult> GetCrewDuties(int crewId, int year, int month)
        {



            var result = await unitOfWork.FlightRepository.GetCrewDuties(crewId, year, month);

            return Ok(result);

        }
        [Route("odata/roster/duties/{type}/{year}/{month}/{day}")]
        public async Task<IHttpActionResult> GetDuties(string type, int year, int month, int day)
        {



            
            var result = await unitOfWork.FlightRepository.GetDayDuties(type, year, month, day);

            return Ok(result);

        }
        //[Route("odata/fdp/crew/{crewid}/{year}/{month}")]
        //[EnableQuery]
        //// [Authorize]
        //public IQueryable<ViewFDPRest> GetViewFDP(int crewid, int year, int month)
        //{

        //    return unitOfWork.FlightRepository.GetViewFDPRest().Where(q => q.CrewId == crewid && q.DateStartYear == year && q.DateStartMonth == month);

        //}

        [Route("odata/crew/duties/{cabin}/{cockpit}")]


        public async Task<IHttpActionResult> GetCrewDuties(DateTime df, DateTime dt, int cabin, int cockpit)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            int? _cabin = cabin == 0 ? null : (Nullable<int>)cabin;
            int? _cockpit = cockpit == 0 ? null : (Nullable<int>)cockpit;

            var result = await unitOfWork.FlightRepository.GetCrewDuties(df, dt, _cabin, _cockpit);

            return Ok(result);

        }



        [Route("odata/crew/duties/grouped/{cabin}/{cockpit}")]


        public async Task<IHttpActionResult> GetCrewDutiesGrouped(DateTime df, DateTime dt, int cabin, int cockpit)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            int? _cabin = cabin == 0 ? null : (Nullable<int>)cabin;
            int? _cockpit = cockpit == 0 ? null : (Nullable<int>)cockpit;

            var result = await unitOfWork.FlightRepository.GetCrewDutiesGrouped(df, dt, _cabin, _cockpit);

            return Ok(result);

        }


        [Route("odata/roster/fdpitem/delete")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterDeleteFDPItem(dynamic dto)
        {
            string _flights = Convert.ToString(dto.flights);
            var ids = _flights.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var crewId = Convert.ToInt32(dto.crewId);
            await unitOfWork.FlightRepository.RosterDeleteFDPItem(crewId, ids);

            return Ok(true);

        }

        [Route("odata/roster/method/duty")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterFunctionDuty(List<DutyDto> data, DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.RosterFunctionDuty(data, df, dt);

            return Ok(result);

        }


        [Route("odata/roster/method/temp")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterTemp(List<RosterColumn> data, DateTime df, DateTime dt, int? crewId)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.RosterGetTempFDPs(data, df, dt, crewId);

            return Ok(result);

        }
        //RosterGetPrePostDuties
        [Route("odata/roster/prepost")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterGetPrePost(List<RosterColumn> data, DateTime df, DateTime dt, int crewId)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.RosterGetPrePostDuties(df, dt, crewId);

            return Ok(result);

        }
        [Route("odata/roster/method/temp/cal")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterTempCal(List<RosterColumn> data, DateTime df, DateTime dt, int? crewId, int? year, int? month)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.RosterGetTempFDPs(data, df, dt, crewId, 0, year, month);

            return Ok(result);

        }
        [Route("odata/roster/method/duties")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterDuties(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.RosterGetDuties(df, dt);

            return Ok(result);

        }
        //chook
        [Route("odata/roster/method/stbys")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterSTBYs(DateTime df, DateTime dt, int loc, int time)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.RosterGetSTBYs(df, dt, loc, time);

            return Ok(result);

        }

        [Route("odata/roster/method/validate")]
        [AcceptVerbs("POST")]

        public async Task<IHttpActionResult> PostRosterValidate(List<RosterColumn> data, DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            var result = await unitOfWork.FlightRepository.RosterValidate(data, df, dt);

            return Ok(result);

        }

        [Route("odata/stby/activated/list")]
        [AcceptVerbs("GET")]

        public async Task<IHttpActionResult> GetActivatedStbys(DateTime dt, DateTime df)
        {
            dt = dt.Date;
            df = df.Date;
            var result = await unitOfWork.FlightRepository.GetActivatedStbys(dt, df);

            return Ok(result);

        }


        [Route("odata/delete/keys")]

        public async Task<IHttpActionResult> GetDeleteKeys()
        {
            var result = await unitOfWork.FlightRepository._deleteFDPs();

            return Ok(true);

        }


        [Route("odata/roster/sheet/")]
        [EnableQuery]

        public IQueryable<ViewRosterSheet> GetViewRosterSheet(DateTime df, DateTime dt)
        {
            df = df.Date;
            dt = dt.Date;
            var result = unitOfWork.FlightRepository.GetViewRosterSheet().Where(q => q.STDDay >= df && q.STDDay <= dt).ToList();
            return result.AsQueryable();

        }
        [Route("odata/roster/report/fp/")]
        [EnableQuery]

        public IQueryable<ViewRosterReportFP> GetViewRosterReportFP(DateTime day)
        {
            //var prts = day.Split('-').Select(q => Convert.ToInt32(q)).ToList();
            var dt = day.Date; //new DateTime(prts[0], prts[1], prts[2]);
            var result = unitOfWork.FlightRepository.GetViewRosterReportFP().Where(q => q.STDDay == dt).OrderBy(q => q.Register).ThenBy(q => q.STD).ToList();
            return result.AsQueryable();

        }

        //[Route("odata/roster/sheet/report")]
        //[EnableQuery]

        //public IQueryable<ViewRosterReport> GetViewRosterSheetReport(DateTime df)
        //{
        //    df = df.Date;

        //    //var result = unitOfWork.FlightRepository.GetViewRosterReport().Where(q => q.DateLocal==df).OrderBy(q=>q.STDLocal).ToList();
        //    var result = unitOfWork.FlightRepository.GetDailyRosterReport();

        //    return result.AsQueryable();

        //}

        [Route("odata/roster/sheet/report")]

        public async Task<IHttpActionResult> GetViewRosterSheetReport(DateTime df)
        {
            // return Ok(client);
            df = df.Date;
            var result = await unitOfWork.FlightRepository.GetDailyRosterReport(df);

            return Ok(result);
        }
        [Route("odata/roster/sheet/report/fp")]

        public async Task<IHttpActionResult> GetViewRosterSheetReportFP(DateTime df)
        {
            // return Ok(client);
            df = df.Date;
            var result = await unitOfWork.FlightRepository.GetDailyRosterReportFP(df);

            return Ok(result);
        }


        [Route("odata/roster/crew/details/{ids}")]
        [EnableQuery]

        public IQueryable<ViewFDPCrewDetailSM> GetViewRosterCrewDetails(string ids)
        {
            var _ids = ids.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var query = (from x in unitOfWork.FlightRepository.GetViewFDPCrewDetailSMS()
                         where _ids.Contains(x.FDPId)
                         orderby x.ScheduleName
                         select x).ToList();
            return query.AsQueryable();

        }

        [Route("odata/roster/sms/save")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostRosterSMS(RosterSMSDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids;
            var date = dto.Date.Date;

            var result = await unitOfWork.FlightRepository.SMSRosterDaily(ids, date);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }
        [Route("odata/sms/test/{no}")]
        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetTestSMS(string no)
        {
            string msg = "";
            Magfa m = new Magfa();
            var res=m.test_mehr(1,no, "test sms "+DateTime.Now.ToString()) ;
            
            return Ok(res);
        }

        [Route("odata/sms/del/test/{id}")]
        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetTestDelSMS(string id)
        {
            string msg = "";
            Magfa m = new Magfa();
            var res = m.getStatus(Convert.ToInt64(id));
            msg = res[0].ToString();
            return Ok(msg);
        }

        [Route("odata/duties/sms/save")]
        //qool
        [AcceptVerbs("POST")]  
        public async Task<IHttpActionResult> PostDutiesSMS(RosterSMSDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids;
            var date = dto.Date.Date;
            var username = dto.UserName;

            var result = await unitOfWork.FlightRepository.SMSDuties(ids, date, username);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }
        [Route("odata/duties/sms/save/date")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostDutiesSMS2(dynamic dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);

            var datefrom = Convert.ToDateTime(dto.datefrom);
            var dateto = Convert.ToDateTime(dto.dateto);
            var username = Convert.ToString(dto.username);

            var result = await unitOfWork.FlightRepository.SMSDutiesByDate(datefrom, dateto, username);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }
        [Route("odata/duties/visiblehide")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostHideVisibleHideDuties(RosterSMSDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids;
            var date = dto.Date.Date;
            var username = dto.UserName;

            var result = await unitOfWork.FlightRepository.HideVisibleDuties(ids, date, username);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }

        [Route("odata/duties/visible")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostVisibleDuties(RosterSMSDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids;
            var date = dto.Date.Date;
            var username = dto.UserName;

            var result = await unitOfWork.FlightRepository.VisibleDuties(ids, date, username);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }
        [Route("odata/duties/hide")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostHideDuties(RosterSMSDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids;
            var date = dto.Date.Date;
            var username = dto.UserName;

            var result = await unitOfWork.FlightRepository.HideDuties(ids, date, username);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }
        [Route("odata/duties/visible/dates")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostVisibleByDatesDuties(dynamic dto)
        {

            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var datefrom = Convert.ToDateTime(dto.datefrom);
            var dateto = Convert.ToDateTime(dto.dateto);
            var username = Convert.ToString(dto.username);

            var result = await unitOfWork.FlightRepository.VisibleDutiesByDate(datefrom, dateto, username);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }
        [Route("odata/sms/save")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostSMS(dynamic dto)
        {
            // return Ok(client);
            string names = Convert.ToString(dto.names);
            string mobiles = Convert.ToString(dto.mobiles);
            var message = Convert.ToString(dto.message);
            string sender = Convert.ToString(dto.sender);

            var result = await unitOfWork.FlightRepository.SendSMSGroup(mobiles.Split('_').ToList(), names.Split('_').ToList(), message, sender);

            return Ok(result);
        }

        [Route("odata/sms/send/{mobile}/{name}/{text}")]
        //qool
        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetSMS(string mobile, string name, string text)
        {
            // return Ok(client);


            var result = unitOfWork.FlightRepository.SendSMS(mobile, text, name);

            return Ok(result);
        }

        [Route("odata/sms/status")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostRosterSMSStatus(RosterSMSStatusDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids.Select(q => Convert.ToInt64(q)).ToList();


            var result = await unitOfWork.FlightRepository.GetSMSStatus(ids);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }

        [Route("odata/sms/status/pickup/update")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostRosterSMSStatusUpdate(RosterSMSStatusDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids.Select(q => Convert.ToInt64(q)).ToList();


            var result = await unitOfWork.FlightRepository.UpdatePickupSMSStatus(ids);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }

        [Route("odata/sms/status/update")]
        //qool
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostSMSStatusUpdate(RosterSMSStatusDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            var ids = dto.Ids.Select(q => Convert.ToInt64(q)).ToList();


            var result = await unitOfWork.FlightRepository.UpdatePickupSMSStatus(ids);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;



            return Ok(result);
        }

        [Route("odata/fdp/stat/{ids}/{dh}")]

        public async Task<IHttpActionResult> GetFDPStat(string ids, int dh)
        {
            var _ids = ids.Split('_').Select(q => Convert.ToInt32(q)).ToList();
            var result = await unitOfWork.FlightRepository.GetMaxFDPStats(_ids, dh);

            return Ok(result);

        }

        [Route("odata/stby/ceased/stat/{isExtended}/{stbyId}/{firstLeg}/{duty}/{maxfdp}")]

        public async Task<IHttpActionResult> GetSTBYActivationStat(int isExtended, int stbyId, int firstLeg, int duty, int maxfdp)
        {

            var result = await unitOfWork.FlightRepository.GetSTBYActivationStat(isExtended, stbyId, firstLeg, duty, maxfdp);

            return Ok(result);

        }


        [Route("odata/flight/ati/{day}/{fn}")]
        [EnableQuery]
        //looi
        public async Task<IHttpActionResult> GetFlightAti(string day, string fn)
        ///(DateTime from, DateTime to, int id, int? airline = null, int? status = null, int? fromAirport = null, int? toAirport = null)
        {
            var y = Convert.ToInt32(day.Substring(0, 4));
            var m = Convert.ToInt32(day.Substring(4, 2));
            var d = Convert.ToInt32(day.Substring(6, 2));
            var _day = new DateTime(y, m, d);
            var flight = await unitOfWork.FlightRepository.GetViewLegTime().FirstOrDefaultAsync(q => q.STDDay == _day && q.FlightNumber == fn);
            return Ok(new CustomActionResult(HttpStatusCode.OK, flight));

        }


        [Route("odata/flight/update/ati/{id}")]
        [EnableQuery]
        //looi
        public async Task<IHttpActionResult> GetUpdateFlightAti(int id, int offset, string std = "", string sta = "", string offblock = "", string onblock = "", string takeoff = "", string landing = "")
        ///(DateTime from, DateTime to, int id, int? airline = null, int? status = null, int? fromAirport = null, int? toAirport = null)
        {
            var result = await unitOfWork.FlightRepository.UpdateAti(id, offset, std, sta, offblock, onblock, takeoff, landing);



            return Ok(result);

        }


        [Route("odata/ati/nira/all/{dfrom}/{dto}")]
        [EnableQuery]
        //looi
        public async Task<IHttpActionResult> GetNieaAll(string dfrom, string dto)
        ///(DateTime from, DateTime to, int id, int? airline = null, int? status = null, int? fromAirport = null, int? toAirport = null)
        {
            var fprts = dfrom.Split('-').Select(q => Convert.ToInt32(q)).ToList();
            var tprts = dto.Split('-').Select(q => Convert.ToInt32(q)).ToList();
            var dtfrom = new DateTime(fprts[0], fprts[1], fprts[2]);
            var dtto = new DateTime(tprts[0], tprts[1], tprts[2]);
            var result = await unitOfWork.FlightRepository.AllNira(dtfrom, dtto);
            //var result = 100;
            return Ok(result);

        }

        public class NiraDto
        { 
            public string dfrom { get; set; }
            public string dto { get; set; }
            public List<int> ids { get; set; }
        }
        [Route("odata/ati/nira/all/filtered/")]

        //looti
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> GetNieaAllFiltered(NiraDto dto)
        ///(DateTime from, DateTime to, int id, int? airline = null, int? status = null, int? fromAirport = null, int? toAirport = null)
        {
            var fprts = dto.dfrom.Split('-').Select(q => Convert.ToInt32(q)).ToList();
            var tprts = dto.dto.Split('-').Select(q => Convert.ToInt32(q)).ToList();
            var dtfrom = new DateTime(fprts[0], fprts[1], fprts[2]);
            var dtto = new DateTime(tprts[0], tprts[1], tprts[2]);
            var result = await unitOfWork.FlightRepository.AllNiraFiltered(dtfrom, dtto, dto.ids);
            //var result = 100;
            return Ok(result);

        }

        [Route("odata/ati/nira/flypersia/test")]
        [EnableQuery]
        //looi
        public async Task<IHttpActionResult> GetNiraFlyPersiaTest()
        ///(DateTime from, DateTime to, int id, int? airline = null, int? status = null, int? fromAirport = null, int? toAirport = null)
        {
            var result = await unitOfWork.FlightRepository.NIRAFLYPERSIA();
            return Ok(result);

        }

        [Route("odata/airport/dist")]

        public IHttpActionResult GetAirportDistance()
        {


            var client = new RestClient("https://greatcirclemapper.p.rapidapi.com/airports/route/EGLL-KJFK/510");
            var request = new RestRequest(Method.GET);
            request.AddHeader("x-rapidapi-host", "greatcirclemapper.p.rapidapi.com");
            request.AddHeader("x-rapidapi-key", "5c217c9ccbmshf5c70fee416e190p1b8688jsn74dd3d0493ab");
            request.AddHeader("vary", "Accept-Encoding");
            request.AddHeader("content-type", "text/html;charset=UTF-8");
            IRestResponse response = client.Execute(request);

            return Ok(response);

        }

        [Route("odata/bi/fuel")]
        [EnableQuery]
        // [Authorize]
        public async Task<IQueryable<RptFuelLeg>> GetBIFuel()
        {
            var result = await unitOfWork.FlightRepository.GetRptFuelLegs();
            //return unitOfWork.FlightRepository.GetViewFlightCrewNews().Where(q => q.FlightId == id).OrderBy(q => q.IsPositioning).ThenBy(q => q.GroupOrder);
            return result.AsQueryable();


        }

        [Route("odata/flight/guid/{id}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetFlightGUID(int id)
        {
            var result = await unitOfWork.FlightRepository.GetFlightGUID(id);
            return Ok(result);

        }

        [Route("odata/sela")]
        [EnableQuery]
        [AcceptVerbs("GET")]
        // [Authorize]
        public async Task<IHttpActionResult> CreateSela()
        {
            var result = await unitOfWork.FlightRepository.CreateSela();
            //List<string> logs = new List<string>() { "1", "2", "3" };
            //var fileExisted = File.Exists(HttpContext.Current.Server.MapPath("~/sela/detaillog.json"));
            //if (fileExisted)
            //{
            //    long length = new System.IO.FileInfo(HttpContext.Current.Server.MapPath("~/sela/detaillog.json")).Length;
            //    if (length == 0)
            //        fileExisted = false;
            //}
            //using (StreamWriter _detailogwriter = new StreamWriter(HttpContext.Current.Server.MapPath("~/sela/detaillog.json"), true))
            //{

            //    var c = 0;
            //    foreach (var str in logs)
            //    {
            //        if (c==0 && fileExisted)
            //        {
            //            _detailogwriter.Write("\r\n");
            //        }
            //        if (c < logs.Count - 1)
            //            _detailogwriter.WriteLine(str);
            //        else
            //            _detailogwriter.Write(str);

            //        c++;
            //    }
            //}
            return Ok(true);

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
