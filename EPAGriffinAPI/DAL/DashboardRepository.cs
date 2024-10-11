using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;
using EPAGriffinAPI.ViewModels;

namespace EPAGriffinAPI.DAL
{
    public class DashboardRepository : Repository
    {
        public DashboardRepository(EPAGRIFFINEntities context)
               : base(context)
        {

        }
        public IQueryable<RptFuelLeg> GetRptFuelLegs()
        {
            return this.context.RptFuelLegs.AsNoTracking();
        }
        public async Task<DashboardLibrary> GetDashboardLibrary(int cid)
        {
            var item = new DashboardLibrary();
            item.Publishers = await this.context.Organizations.CountAsync(q => q.TypeId == 77);
            item.Authors = await this.context.PersonMiscs.CountAsync(q => q.TypeId == 75);
            item.Journals = await this.context.Journals.CountAsync();
            //////////////////////////////////////////////////////////
            var libraryGroup = await (from x in context.ViewBooks
                                      where x.CustomerId == cid
                                      group x by new { x.TypeId, x.IsExposed } into g

                                      select new
                                      {
                                          TypeId = g.Key.TypeId,
                                          Exposed = g.Key.IsExposed,
                                          count = g.Count()
                                      }).ToListAsync();

            var libraryGroupSum = (from x in libraryGroup
                                   group x by x.TypeId into g
                                   orderby g.Key
                                   select new { TypeId = g.Key, count = g.Sum(e => e.count) }).ToList();

            item.DocumentsTotal = 0;
            item.BooksTotal = 0;
            item.PapersTotal = 0;
            item.VideosTotal = 0;

            item.DocumentsNotExposed = 0;
            item.BooksNotExposed = 0;
            item.PapersNotExposed = 0;
            item.VideosNotExposed = 0;


            foreach (var x in libraryGroupSum)
            {
                var notexposed = libraryGroup.FirstOrDefault(q => q.TypeId == x.TypeId && q.Exposed == 0);
                switch (x.TypeId)
                {
                    case 83:
                        item.BooksNotExposed = notexposed == null ? 0 : notexposed.count;
                        item.BooksTotal = x.count;
                        break;
                    case 84:
                        item.PapersTotal = x.count;
                        item.PapersNotExposed = notexposed == null ? 0 : notexposed.count;
                        break;
                    case 85:
                        item.VideosNotExposed = notexposed == null ? 0 : notexposed.count;
                        item.VideosTotal = x.count;
                        break;
                    case 86:
                        item.DocumentsNotExposed = notexposed == null ? 0 : notexposed.count;
                        item.DocumentsTotal = x.count;
                        break;
                    default:
                        break;
                }



            }
            var careless = await this.context.SumCarelessEmployeeTotals.FirstOrDefaultAsync(q => q.CustomerId == cid);
            item.Careless = careless == null ? 0 : (int)careless.Count;

            var carelessTypes = await this.context.SumCarelessEmployees.Where(q => q.CustomerId == cid).ToListAsync();
            foreach (var y in carelessTypes)
            {
                switch (y.TypeId)
                {
                    case 83:
                        item.CarelessBook = (int)y.Count;
                        break;
                    case 84:
                        item.CarelessPaper = (int)y.Count;
                        break;
                    case 85:
                        item.CarelessVideo = (int)y.Count;
                        break;
                    case 86:
                        item.CarelessDocument = (int)y.Count;
                        break;
                    default:
                        break;
                }
            }

            item.DownloadTotal = await this.context.ViewBookApplicableEmployees.Where(q => q.CustomerId == cid && q.IsDownloaded == true).CountAsync();

            var download = await this.context.SumLibraryDownloadByMonths.Where(q => q.CustomerId == cid).OrderBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();
            item.Download = new List<DateRate>();
            foreach (var x in download)
            {
                item.Download.Add(new DateRate()
                {
                    Month = x.Month,
                    MonthName = x.MonthName,
                    Year = x.Year,
                    Total = (int)x.Count
                });
            }
            var add = await this.context.SumLibraryAddedByMonths.Where(q => q.CustomerId == cid).OrderBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();
            item.Add = new List<DateRate>();
            foreach (var x in add)
            {
                item.Add.Add(new DateRate()
                {
                    Month = x.Month,
                    MonthName = x.MonthName,
                    Year = x.Year,
                    Total = (int)x.Count
                });
            }
            //////////////////////////////////////////////


            return item;
            // return await this.context.UserActivityMenuHits.FirstOrDefaultAsync(q => q.UserId == dto.UserId && q.CustomerId == dto.CustomerId && q.ModuleId == dto.ModuleId && q.Key == dto.Key);
        }
        internal async Task<ViewCrewTime> GetAPPDashboardFTL(int eid)
        {
            var dt = DateTime.UtcNow;
            var day = DateTime.Now.Date;
            var FTL = await this.context.ViewCrewTimes.Where(q => q.CDate == day && q.Id == eid).FirstOrDefaultAsync();
            return FTL;
        }
        internal async Task<DashboardClienApp> GetAppDashboard(int cid, int eid)
        {
            var item = new DashboardClienApp()
            {
                Library = new List<TileAlert>(),
            };
            var dt = DateTime.UtcNow;
            var day = DateTime.Now.Date;
            var query = await (//from x in this.context.ViewFlightCrewNews
                from x in this.context.ViewFlightCrewXes

                where x.CrewId == eid && x.STD >= dt && x.FlightStatusId == 1
                //&& x.FlightStatusID==15
                orderby x.STD
                select x
                 ).FirstOrDefaultAsync();
            item.NextFlight = query;

            item.FTL = new ViewCrewTime(); //await this.context.ViewCrewTimes.Where(q => q.CDate == day && q.Id == eid).FirstOrDefaultAsync();

            var library = await this.context.SumEmployeeLibraryAlerts.Where(q => q.EmployeeId == eid && q.CustomerId == cid).OrderBy(q => q.TypeId).ToListAsync();
            foreach (var x in library)
            {
                if (x.TypeId == 83 && x.Count > 0)
                {
                    item.Library.Add(new TileAlert()
                    {
                        Type = 83,
                        Caption = "Book" + (x.Count > 1 ? "s" : ""),
                        Total = x.Count,
                        Remark = "need" + (x.Count == 1 ? "s" : "") + " your attention.",

                    });
                }
                if (x.TypeId == 84 && x.Count > 0)
                {
                    item.Library.Add(new TileAlert()
                    {
                        Type = 84,
                        Caption = "Paper" + (x.Count > 1 ? "s" : ""),
                        Total = x.Count,
                        Remark = "need" + (x.Count == 1 ? "s" : "") + " your attention.",

                    });
                }
                if (x.TypeId == 85 && x.Count > 0)
                {
                    item.Library.Add(new TileAlert()
                    {
                        Type = 85,
                        Caption = "Video" + (x.Count > 1 ? "s" : ""),
                        Total = x.Count,
                        Remark = "need" + (x.Count == 1 ? "s" : "") + " your attention.",

                    });
                }
                if (x.TypeId == 86 && x.Count > 0)
                {
                    item.Library.Add(new TileAlert()
                    {
                        Type = 86,
                        Caption = "Document" + (x.Count > 1 ? "s" : ""),
                        Total = x.Count,
                        Remark = "need" + (x.Count == 1 ? "s" : "") + " your attention.",

                    });
                }
            }

            var notification = await this.context.Notifications.Where(q => q.UserId == eid && q.DateAppVisited == null).CountAsync();
            var lastNote = await this.context.ViewNotifications.Where(q => q.UserId == eid && q.DateAppVisited == null).OrderByDescending(q => q.DateSent).FirstOrDefaultAsync();
            item.Nots = notification;
            if (lastNote != null)
            {
                item.LastNot = lastNote.Type;
                item.LastNotDate = lastNote.DateSent;
                item.LastNotSender = lastNote.Sender;
                item.LastNotAbs = lastNote.Abstract;
            }
            return item;
        }

        public async Task<DashboardProfile> GetDashboardProfile(int cid)
        {
            var item = new DashboardProfile();

            item.EmployeesJobGroup = await this.context.SumEmployeeJobGroups.Where(q => q.CustomerId == cid).ToListAsync();
            item.EmployeesLocation = await this.context.SumEmployeeLocations.Where(q => q.CustomerId == cid).ToListAsync();
            item.EmployeesStudyField = await this.context.SumEmployeeStudyFields.Where(q => q.CustomerId == cid).ToListAsync();

            item.EmployeesDegree = await this.context.SumEmployeeDegrees.Where(q => q.CustomerId == cid).ToListAsync();
            item.EmployeeSex = await this.context.SumEmployeeSexes.Where(q => q.CustomerId == cid).ToListAsync();
            item.EmployeesAge = await this.context.SumEmployeeAges.Where(q => q.Id == cid).FirstOrDefaultAsync();
            item.EmployeeMaritalStatus = await this.context.SumEmployeeMaritalStatus.Where(q => q.CustomerId == cid).ToListAsync();
            item.EmployeesExp = await this.context.SumEmployeeExps.Where(q => q.Id == cid).FirstOrDefaultAsync();

            var courses = await this.context.SumActiveCourses.Where(q => q.CustomerId == cid).ToListAsync();
            foreach (var x in courses)
            {
                switch (x.StatusId)
                {
                    case 1:
                        item.RegisteringCourse = new TitleCourse()
                        {
                            Assigned = x.Assigned,
                            Registered = x.Registered,
                            UnRegistered = x.Unregistered,
                            Total = x.Count

                        };
                        break;
                    case 2:
                        item.ActiveCourse = new TitleCourse()
                        {
                            Total = x.Count,
                            Assigned = x.Assigned,
                            Learner = x.ActiveLearner,
                            Canceled = x.Canceled,
                        };
                        break;
                    case 3:
                        item.CompletedCourse = new TitleCourse()
                        {
                            Learner = x.DoneLearner,
                            Failed = x.Failed,
                            Passed = x.Passed,
                            Total = x.Count
                        };
                        break;
                    default:
                        break;
                }
            }

            var dateAlert = await this.context.SumEmployeeDateAlerts.FirstOrDefaultAsync(q => q.Id == cid);
            item.Passport = new TileAlert() { Expired = dateAlert.PassportExpired, Expiring = dateAlert.PassportExpiring };
            item.NDT = new TileAlert() { Expiring = dateAlert.NDTExpiring, Expired = dateAlert.NDTExpired };
            item.CAO = new TileAlert() { Expired = dateAlert.CAOExpired, Expiring = dateAlert.CAOExpiring };
            item.Medical = new TileAlert() { Expired = dateAlert.MedicalExpired, Expiring = dateAlert.MedicalExpiring };

            var certificate = await this.context.SumCertificateStatus.FirstOrDefaultAsync(q => q.Id == cid);
            item.Certificate = new TileAlert() { Expired = certificate.Expired, Expiring = certificate.Expiring, Valid = certificate.Valid, Total = certificate.Valid + certificate.Expiring + certificate.Expired };

            item.CertificatesTypes = await this.context.SumCertificateTypes.Where(q => q.CustomerId == cid).ToListAsync();



            return item;
        }
        public async Task<object> GetRptFuelDailyByYearMonth(string year, string month)
        {
            var ms = month.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var ys = year.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var query = from x in this.context.RptFuelDailyCals
                        where ms.Contains(x.Month) && ys.Contains(x.Year)
                        select x;
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month)
                //.ThenBy(q => q.Day)
                .ToListAsync();
            return new
            {

                items = ds,
            };
        }
        public async Task<object> GetRptFuelDailyTypeByYearMonth(string year, string month)
        {
            var ms = month.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var ys = year.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var query = from x in this.context.RptFuelDailyTypeCals
                        where ms.Contains(x.Month) && ys.Contains(x.Year)
                        select x;
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ThenBy(q => q.AircraftType).ToListAsync();
            return new
            {

                items = ds,
            };
        }
        public async Task<object> GetRptFuelDailyRouteByYearMonth(string year, string month)
        {
            var ms = month.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var ys = year.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var query = from x in this.context.RptFuelDailyRouteXCals
                        where ms.Contains(x.Month) && ys.Contains(x.Year)
                        select x;
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ThenBy(q => q.Route).ToListAsync();
            return new
            {

                items = ds,
            };
        }

        public async Task<object> GetRptFuelDailyRegisterByYearMonth(string year, string month)
        {
            var ms = month.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var ys = year.Split('_').Select(q => (Nullable<int>)Convert.ToInt32(q)).ToList();
            var query = from x in this.context.RptFuelDailyRegisterCals
                        where ms.Contains(x.Month) && ys.Contains(x.Year)
                        select x;
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ThenBy(q => q.Register).ToListAsync();
            return new
            {

                items = ds,
            };
        }

        public async Task<object> GetRptFuelMonthlyByYear(int year)
        {
            var query = from x in this.context.RptFuelMonthlyCals

                        select x;
            if (year != -1)
                query = query.Where(q => q.Year == year);
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();
            var used = ds.Sum(q => q.UsedKilo);

            var uplift = ds.Sum(q => q.UpliftKilo);
            var usedAvg = used > 0 ? Math.Round((double)ds.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var upliftAvg = uplift > 0 ? Math.Round((double)ds.Average(q => q.UpliftKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var legs = ds.Sum(q => q.Legs);
            var legsAvg = legs > 0 ? Math.Round(ds.Average(q => (int)q.Legs), 2, MidpointRounding.AwayFromZero) : 0;
            var pax = ds.Sum(q => q.TotalPax);
            var paxAvg = pax > 0 ? Math.Round(ds.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero) : 0;
            var weight = ds.Sum(q => q.WeightTone);
            var weightAvg = weight > 0 ? Math.Round(ds.Average(q => q.WeightTone), 2, MidpointRounding.AwayFromZero) : 0;
            var distance = ds.Sum(q => q.DistanceKM);
            var distanceAvg = distance > 0 ? Math.Round(ds.Average(q => q.DistanceKM), 2, MidpointRounding.AwayFromZero) : 0;


            var used2 = ds.Sum(q => q.Used);
            var weight2 = ds.Sum(q => q.Weight);
            var usedPerPaxAvg = used2 == 0 || pax == 0 ? 0 : Math.Round((double)used2 * 1.0 / pax, 2, MidpointRounding.AwayFromZero);
            var usedPerLegAvg = used2 == 0 || legs == 0 || legs == null ? 0 : Math.Round((double)used2 * 1.0 / (int)legs, 2, MidpointRounding.AwayFromZero);
            var usedPerWeight = used2 == 0 || weight2 == 0 ? 0 : Math.Round((double)used2 * 1.0 / weight2, 2, MidpointRounding.AwayFromZero);
            var usedPerDistance = used2 == 0 || distance == 0 ? 0 : Math.Round((double)used2 * 1.0 / distance, 2, MidpointRounding.AwayFromZero);
            var frpkAvg = Math.Round((double)ds.Average(q => q.UsedPerPaxKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            var faskAvg = Math.Round((double)ds.Average(q => q.UsedPerSeatKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            return new
            {
                used,
                uplift,
                usedAvg,
                upliftAvg,
                legs,
                legsAvg,
                pax,
                paxAvg,
                weight,
                weightAvg,
                distance,
                distanceAvg,


                usedPerPaxAvg,
                usedPerLegAvg,
                usedPerWeight,
                usedPerDistance,
                frpkAvg,
                faskAvg,
                items = ds,
            };
        }

        public async Task<object> GetRptFuelDaily(DateTime dfrom, DateTime dto)
        {
            var query = from x in this.context.RptFuelDailyCals
                        where x.LocalDate >= dfrom && x.LocalDate <= dto
                        select x;
            var ds = await query.OrderBy(q => q.LocalDate).ToListAsync();
            var used = ds.Sum(q => q.UsedKilo);
            var uplift = ds.Sum(q => q.UpliftKilo);
            var usedAvg = Math.Round((double)ds.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero);
            var upliftAvg = Math.Round((double)ds.Average(q => q.UpliftKilo), 2, MidpointRounding.AwayFromZero);
            var legs = ds.Sum(q => q.Legs);
            var legsAvg = Math.Round(ds.Average(q => (int)q.Legs), 2, MidpointRounding.AwayFromZero);
            var pax = ds.Sum(q => q.TotalPax);
            var paxAvg = Math.Round((double)ds.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero);
            var weight = ds.Sum(q => q.WeightTone);
            var weightAvg = Math.Round((double)ds.Average(q => q.WeightTone), 2, MidpointRounding.AwayFromZero);
            var distance = ds.Sum(q => q.DistanceKM);
            var distanceAvg = Math.Round((double)ds.Average(q => q.DistanceKM), 2, MidpointRounding.AwayFromZero);
            return new
            {
                used,
                uplift,
                usedAvg,
                upliftAvg,
                legs,
                legsAvg,
                pax,
                paxAvg,
                weight,
                weightAvg,
                distance,
                distanceAvg,
                items = ds,
            };
        }

        public class ItemSummary
        {
            public string Arg { get; set; }
            public string Arg2 { get; set; }
            public decimal? Sum { get; set; }
            public decimal? SumPax { get; set; }
            public decimal? SumLeg { get; set; }
            public decimal? SumFlight { get; set; }
            public decimal? SumBlock { get; set; }
            public decimal? SumPaxDistanceKM { get; set; }
            public decimal? SumSeatDistanceKM { get; set; }
            public decimal? SumPaxKiloDistanceKM { get; set; }
            public decimal? SumSeatKiloDistanceKM { get; set; }
            public decimal? SumWeightDistanceToneKM { get; set; }
            public decimal? Avg { get; set; }
            public decimal? AvgLeg { get; set; }
            public decimal? AvgPax { get; set; }
            public decimal? AvgPerLeg { get; set; }
            public decimal? AvgPerPax { get; set; }
            public decimal? AvgPerFlight { get; set; }
            public decimal? AvgPerBlock { get; set; }
            public decimal? AvgPerWeightDistanceToneKM { get; set; }
            public decimal? AvgPerPaxKiloDistanceKM { get; set; }
            public decimal? AvgPerPaxDistanceKM { get; set; }
            public decimal? AvgPerSeatKiloDistanceKM { get; set; }
            public decimal? AvgPerSeatDistanceKM { get; set; }
        }


        public async Task<object> GetRptFuelTypesByYearNew(int year)
        {
            var query = from x in this.context.RptFuelMonthlyTypeCals

                        select x;
            if (year != -1)
                query = query.Where(q => q.Year == year);
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();
            var used = ds.Sum(q => q.UsedKilo);

            var uplift = ds.Sum(q => q.UpliftKilo);
            var usedAvg = used > 0 ? Math.Round((double)ds.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var upliftAvg = uplift > 0 ? Math.Round((double)ds.Average(q => q.UpliftKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var legs = ds.Sum(q => q.Legs);
            var legsAvg = legs > 0 ? Math.Round(ds.Average(q => (int)q.Legs), 2, MidpointRounding.AwayFromZero) : 0;
            var pax = ds.Sum(q => q.TotalPax);
            var paxAvg = pax > 0 ? Math.Round(ds.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero) : 0;
            var weight = ds.Sum(q => q.WeightTone);
            var weightAvg = weight > 0 ? Math.Round(ds.Average(q => q.WeightTone), 2, MidpointRounding.AwayFromZero) : 0;
            var distance = ds.Sum(q => q.DistanceKM);
            var distanceAvg = distance > 0 ? Math.Round(ds.Average(q => q.DistanceKM), 2, MidpointRounding.AwayFromZero) : 0;


            var used2 = ds.Sum(q => q.Used);
            var weight2 = ds.Sum(q => q.Weight);
            var usedPerPaxAvg = used2 == 0 || pax == 0 ? 0 : Math.Round((double)used2 * 1.0 / pax, 2, MidpointRounding.AwayFromZero);
            var usedPerLegAvg = used2 == 0 || legs == 0 || legs == null ? 0 : Math.Round((double)used2 * 1.0 / (int)legs, 2, MidpointRounding.AwayFromZero);
            var usedPerWeight = used2 == 0 || weight2 == 0 ? 0 : Math.Round((double)used2 * 1.0 / weight2, 2, MidpointRounding.AwayFromZero);
            var usedPerDistance = used2 == 0 || distance == 0 ? 0 : Math.Round((double)used2 * 1.0 / distance, 2, MidpointRounding.AwayFromZero);
            var frpkAvg = Math.Round((double)ds.Average(q => q.UsedPerPaxKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            var faskAvg = Math.Round((double)ds.Average(q => q.UsedPerSeatKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            return new
            {
                used,
                uplift,
                usedAvg,
                upliftAvg,
                legs,
                legsAvg,
                pax,
                paxAvg,
                weight,
                weightAvg,
                distance,
                distanceAvg,


                usedPerPaxAvg,
                usedPerLegAvg,
                usedPerWeight,
                usedPerDistance,
                frpkAvg,
                faskAvg,
                items = ds,
            };
        }

        public async Task<object> GetRptFuelRoutesByYearNew(int year)
        {
            var query = from x in this.context.RptFuelMonthlyRouteXCals

                        select x;
            if (year != -1)
                query = query.Where(q => q.Year == year);
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();
            var used = ds.Sum(q => q.UsedKilo);

            var uplift = ds.Sum(q => q.UpliftKilo);
            var usedAvg = used > 0 ? Math.Round((double)ds.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var upliftAvg = uplift > 0 ? Math.Round((double)ds.Average(q => q.UpliftKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var legs = ds.Sum(q => q.Legs);
            var legsAvg = legs > 0 ? Math.Round(ds.Average(q => (int)q.Legs), 2, MidpointRounding.AwayFromZero) : 0;
            var pax = ds.Sum(q => q.TotalPax);
            var paxAvg = pax > 0 ? Math.Round(ds.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero) : 0;
            var weight = ds.Sum(q => q.WeightTone);
            var weightAvg = weight > 0 ? Math.Round(ds.Average(q => q.WeightTone), 2, MidpointRounding.AwayFromZero) : 0;
            var distance = ds.Sum(q => q.DistanceKM);
            var distanceAvg = distance > 0 ? Math.Round(ds.Average(q => q.DistanceKM), 2, MidpointRounding.AwayFromZero) : 0;


            var used2 = ds.Sum(q => q.Used);
            var weight2 = ds.Sum(q => q.Weight);
            var usedPerPaxAvg = used2 == 0 || pax == 0 ? 0 : Math.Round((double)used2 * 1.0 / pax, 2, MidpointRounding.AwayFromZero);
            var usedPerLegAvg = used2 == 0 || legs == 0 || legs == null ? 0 : Math.Round((double)used2 * 1.0 / (int)legs, 2, MidpointRounding.AwayFromZero);
            var usedPerWeight = used2 == 0 || weight2 == 0 ? 0 : Math.Round((double)used2 * 1.0 / weight2, 2, MidpointRounding.AwayFromZero);
            var usedPerDistance = used2 == 0 || distance == 0 ? 0 : Math.Round((double)used2 * 1.0 / distance, 2, MidpointRounding.AwayFromZero);
            var frpkAvg = Math.Round((double)ds.Average(q => q.UsedPerPaxKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            var faskAvg = Math.Round((double)ds.Average(q => q.UsedPerSeatKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            return new
            {
                used,
                uplift,
                usedAvg,
                upliftAvg,
                legs,
                legsAvg,
                pax,
                paxAvg,
                weight,
                weightAvg,
                distance,
                distanceAvg,


                usedPerPaxAvg,
                usedPerLegAvg,
                usedPerWeight,
                usedPerDistance,
                frpkAvg,
                faskAvg,
                items = ds,
            };
        }

        public async Task<object> GetRptFuelRegistersByYearNew(int year)
        {
            var query = from x in this.context.RptFuelMonthlyRegisterCals

                        select x;
            if (year != -1)
                query = query.Where(q => q.Year == year);
            var ds = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();
            var used = ds.Sum(q => q.UsedKilo);

            var uplift = ds.Sum(q => q.UpliftKilo);
            var usedAvg = used > 0 ? Math.Round((double)ds.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var upliftAvg = uplift > 0 ? Math.Round((double)ds.Average(q => q.UpliftKilo), 2, MidpointRounding.AwayFromZero) : 0;
            var legs = ds.Sum(q => q.Legs);
            var legsAvg = legs > 0 ? Math.Round(ds.Average(q => (int)q.Legs), 2, MidpointRounding.AwayFromZero) : 0;
            var pax = ds.Sum(q => q.TotalPax);
            var paxAvg = pax > 0 ? Math.Round(ds.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero) : 0;
            var weight = ds.Sum(q => q.WeightTone);
            var weightAvg = weight > 0 ? Math.Round(ds.Average(q => q.WeightTone), 2, MidpointRounding.AwayFromZero) : 0;
            var distance = ds.Sum(q => q.DistanceKM);
            var distanceAvg = distance > 0 ? Math.Round(ds.Average(q => q.DistanceKM), 2, MidpointRounding.AwayFromZero) : 0;


            var used2 = ds.Sum(q => q.Used);
            var weight2 = ds.Sum(q => q.Weight);
            var usedPerPaxAvg = used2 == 0 || pax == 0 ? 0 : Math.Round((double)used2 * 1.0 / pax, 2, MidpointRounding.AwayFromZero);
            var usedPerLegAvg = used2 == 0 || legs == 0 || legs == null ? 0 : Math.Round((double)used2 * 1.0 / (int)legs, 2, MidpointRounding.AwayFromZero);
            var usedPerWeight = used2 == 0 || weight2 == 0 ? 0 : Math.Round((double)used2 * 1.0 / weight2, 2, MidpointRounding.AwayFromZero);
            var usedPerDistance = used2 == 0 || distance == 0 ? 0 : Math.Round((double)used2 * 1.0 / distance, 2, MidpointRounding.AwayFromZero);
            var frpkAvg = Math.Round((double)ds.Average(q => q.UsedPerPaxKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            var faskAvg = Math.Round((double)ds.Average(q => q.UsedPerSeatKiloDistanceKM), 2, MidpointRounding.AwayFromZero);
            return new
            {
                used,
                uplift,
                usedAvg,
                upliftAvg,
                legs,
                legsAvg,
                pax,
                paxAvg,
                weight,
                weightAvg,
                distance,
                distanceAvg,


                usedPerPaxAvg,
                usedPerLegAvg,
                usedPerWeight,
                usedPerDistance,
                frpkAvg,
                faskAvg,
                items = ds,
            };
        }


        public async Task<object> GetRptFuelTypesYearly(int year)
        {
            var query = this.context.RptFuelYearlyTypes.Where(q => q.Year == year).OrderByDescending(q => q.Used);
            var items = await query.ToListAsync();

            var queryRegisters = this.context.RptFuelYearlyRegisters.Where(q => q.Year == year).OrderByDescending(q => q.Used);
            var itemsRegisters = await queryRegisters.ToListAsync();


            var details = await this.context.RptFuelMonthlyTypes.Where(q => q.Year == year).OrderBy(q => q.AircraftType).ThenBy(q => q.Month).ToListAsync();
            var groupedDetails = (from x in details
                                  group x by new { x.AircraftType, x.TypeId } into grp
                                  select new ItemSummary()
                                  {
                                      Arg = grp.Key.AircraftType,
                                      Arg2 = grp.Key.TypeId.ToString(),
                                      Avg = (decimal)Math.Round((double)grp.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero),
                                      Sum = grp.Sum(q => q.UsedKilo),
                                      SumPax = grp.Sum(q => q.TotalPax),
                                      SumFlight = grp.Sum(q => q.FlightTime),
                                      SumBlock = grp.Sum(q => q.BlockTime),
                                      SumPaxDistanceKM = (decimal?)grp.Sum(q => q.PaxDistanceKM),
                                      SumPaxKiloDistanceKM = (decimal?)grp.Sum(q => q.PaxKiloDistanceKM),
                                      SumSeatDistanceKM = (decimal?)grp.Sum(q => q.SeatDistanceKM),
                                      SumSeatKiloDistanceKM = (decimal?)grp.Sum(q => q.SeatKiloDistanceKM),
                                      SumWeightDistanceToneKM = (decimal?)grp.Sum(q => q.WeightToneDistance),

                                      AvgPax = (decimal)Math.Round((double)grp.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero),
                                      SumLeg = grp.Sum(q => q.Legs),
                                      AvgLeg = (decimal)Math.Round((double)grp.Average(q => q.Legs), 2, MidpointRounding.AwayFromZero),
                                      AvgPerLeg = (decimal)Math.Round((double)(grp.Sum(q => q.Used) / grp.Sum(q => q.Legs)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerPax = (decimal)Math.Round((double)(grp.Sum(q => q.Used) / grp.Sum(q => q.TotalPax)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerFlight = (decimal)Math.Round((double)(grp.Sum(q => q.Used) * 60 / grp.Sum(q => q.FlightTime)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerBlock = (decimal)Math.Round((double)(grp.Sum(q => q.Used) * 60 / grp.Sum(q => q.BlockTime)), 2, MidpointRounding.AwayFromZero),

                                      AvgPerPaxDistanceKM = grp.Sum(q => q.PaxDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.PaxDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerPaxKiloDistanceKM = grp.Sum(q => q.PaxKiloDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.PaxKiloDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerSeatDistanceKM = grp.Sum(q => q.SeatDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.SeatDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerSeatKiloDistanceKM = grp.Sum(q => q.SeatKiloDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.SeatKiloDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerWeightDistanceToneKM = grp.Sum(q => q.WeightToneDistance) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.WeightToneDistance)), 2, MidpointRounding.AwayFromZero),

                                  }).ToList();


            var usedAvg = Math.Round((double)items.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero);
            var usedLegAvg = Math.Round((double)items.Average(q => q.UsedKiloPerLeg), 2, MidpointRounding.AwayFromZero);
            var usedPaxAvg = Math.Round((double)items.Average(q => q.UsedPerPax), 2, MidpointRounding.AwayFromZero);
            //var usedAvgKilo = Math.Round((double)items.Average(q => q.Used), 2, MidpointRounding.AwayFromZero);
            ///////////////////////////////////////
            //////////////////////////////////////
            var detailsRegisters = await this.context.RptFuelMonthlyRegisters.Where(q => q.Year == year).OrderBy(q => q.AircraftType).ThenBy(q => q.Register).ThenBy(q => q.Month).ToListAsync();
            var groupedDetailsRegisters = (from x in detailsRegisters
                                           group x by new { x.Register, x.RegisterID } into grp
                                           select new ItemSummary()
                                           {
                                               Arg = grp.Key.Register,
                                               Arg2 = grp.Key.RegisterID.ToString(),
                                               Avg = (decimal)Math.Round((double)grp.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero),
                                               Sum = grp.Sum(q => q.UsedKilo),
                                               SumPax = grp.Sum(q => q.TotalPax),
                                               SumFlight = grp.Sum(q => q.FlightTime),
                                               SumBlock = grp.Sum(q => q.BlockTime),
                                               SumPaxDistanceKM = (decimal?)grp.Sum(q => q.PaxDistanceKM),
                                               SumPaxKiloDistanceKM = (decimal?)grp.Sum(q => q.PaxKiloDistanceKM),
                                               SumSeatDistanceKM = (decimal?)grp.Sum(q => q.SeatDistanceKM),
                                               SumSeatKiloDistanceKM = (decimal?)grp.Sum(q => q.SeatKiloDistanceKM),
                                               SumWeightDistanceToneKM = (decimal?)grp.Sum(q => q.WeightToneDistance),

                                               AvgPax = (decimal)Math.Round((double)grp.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero),
                                               SumLeg = grp.Sum(q => q.Legs),
                                               AvgLeg = (decimal)Math.Round((double)grp.Average(q => q.Legs), 2, MidpointRounding.AwayFromZero),
                                               AvgPerLeg = (decimal)Math.Round((double)(grp.Sum(q => q.Used) / grp.Sum(q => q.Legs)), 2, MidpointRounding.AwayFromZero),
                                               AvgPerPax = (decimal)Math.Round((double)(grp.Sum(q => q.Used) / grp.Sum(q => q.TotalPax)), 2, MidpointRounding.AwayFromZero),
                                               AvgPerFlight = (decimal)Math.Round((double)(grp.Sum(q => q.Used) * 60 / grp.Sum(q => q.FlightTime)), 2, MidpointRounding.AwayFromZero),
                                               AvgPerBlock = (decimal)Math.Round((double)(grp.Sum(q => q.Used) * 60 / grp.Sum(q => q.BlockTime)), 2, MidpointRounding.AwayFromZero),

                                               AvgPerPaxDistanceKM = grp.Sum(q => q.PaxDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.PaxDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                               AvgPerPaxKiloDistanceKM = grp.Sum(q => q.PaxKiloDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.PaxKiloDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                               AvgPerSeatDistanceKM = grp.Sum(q => q.SeatDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.SeatDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                               AvgPerSeatKiloDistanceKM = grp.Sum(q => q.SeatKiloDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.SeatKiloDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                               AvgPerWeightDistanceToneKM = grp.Sum(q => q.WeightToneDistance) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.WeightToneDistance)), 2, MidpointRounding.AwayFromZero),

                                           }).ToList();


            //  var usedAvg = Math.Round((double)items.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero);
            //  var usedLegAvg = Math.Round((double)items.Average(q => q.UsedKiloPerLeg), 2, MidpointRounding.AwayFromZero);
            // var usedPaxAvg = Math.Round((double)items.Average(q => q.UsedPerPax), 2, MidpointRounding.AwayFromZero);
            /////////////////////////////////
            ////////////////////////////////////////
            return new
            {
                items,
                itemsRegisters,
                details,
                detailsRegisters,
                summary = groupedDetails,
                summaryRegister = groupedDetailsRegisters,
                usedAvg,
                usedLegAvg,
                usedPaxAvg
            };
        }

        public async Task<object> GetRptFuelRoutesYearly(int year)
        {
            var query = this.context.RptFuelYearlyRoutes.Where(q => q.Year == year).OrderByDescending(q => q.Used);
            var items = await query.ToListAsync();
            var details = await this.context.RptFuelMonthlyRoutes.Where(q => q.Year == year).OrderBy(q => q.Route).ThenBy(q => q.Month).ToListAsync();
            var groupedDetails = (from x in details
                                  group x by new { x.Route, x.Route2 } into grp
                                  select new ItemSummary()
                                  {
                                      Arg = grp.Key.Route,
                                      Arg2 = grp.Key.Route2,
                                      Avg = (decimal)Math.Round((double)grp.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero),
                                      Sum = grp.Sum(q => q.UsedKilo),
                                      SumPax = grp.Sum(q => q.TotalPax),
                                      SumFlight = grp.Sum(q => q.FlightTime),
                                      SumBlock = grp.Sum(q => q.BlockTime),
                                      SumPaxDistanceKM = (decimal?)grp.Sum(q => q.PaxDistanceKM),
                                      SumPaxKiloDistanceKM = (decimal?)grp.Sum(q => q.PaxKiloDistanceKM),
                                      SumSeatDistanceKM = (decimal?)grp.Sum(q => q.SeatDistanceKM),
                                      SumSeatKiloDistanceKM = (decimal?)grp.Sum(q => q.SeatKiloDistanceKM),
                                      SumWeightDistanceToneKM = (decimal?)grp.Sum(q => q.WeightDistanceToneKM),

                                      AvgPax = (decimal)Math.Round((double)grp.Average(q => q.TotalPax), 2, MidpointRounding.AwayFromZero),
                                      SumLeg = grp.Sum(q => q.Legs),
                                      AvgLeg = (decimal)Math.Round((double)grp.Average(q => q.Legs), 2, MidpointRounding.AwayFromZero),
                                      AvgPerLeg = (decimal)Math.Round((double)(grp.Sum(q => q.Used) / grp.Sum(q => q.Legs)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerPax = (decimal)Math.Round((double)(grp.Sum(q => q.Used) / grp.Sum(q => q.TotalPax)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerFlight = (decimal)Math.Round((double)(grp.Sum(q => q.Used) * 60 / grp.Sum(q => q.FlightTime)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerBlock = (decimal)Math.Round((double)(grp.Sum(q => q.Used) * 60 / grp.Sum(q => q.BlockTime)), 2, MidpointRounding.AwayFromZero),

                                      AvgPerPaxDistanceKM = grp.Sum(q => q.PaxDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.PaxDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerPaxKiloDistanceKM = grp.Sum(q => q.PaxKiloDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.PaxKiloDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerSeatDistanceKM = grp.Sum(q => q.SeatDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.SeatDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerSeatKiloDistanceKM = grp.Sum(q => q.SeatKiloDistanceKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.SeatKiloDistanceKM)), 2, MidpointRounding.AwayFromZero),
                                      AvgPerWeightDistanceToneKM = grp.Sum(q => q.WeightDistanceToneKM) == 0 ? null : (decimal?)Math.Round((double)(grp.Sum(q => q.Used) / (decimal)grp.Sum(q => q.WeightDistanceToneKM)), 2, MidpointRounding.AwayFromZero),

                                  }).ToList();


            var usedAvg = Math.Round((double)items.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero);
            var usedLegAvg = Math.Round((double)items.Average(q => q.UsedKiloPerLeg), 2, MidpointRounding.AwayFromZero);
            var usedPaxAvg = Math.Round((double)items.Average(q => q.UsedPerPax), 2, MidpointRounding.AwayFromZero);
            //var usedAvgKilo = Math.Round((double)items.Average(q => q.Used), 2, MidpointRounding.AwayFromZero);
            return new
            {
                items,
                details,
                summary = groupedDetails,
                usedAvg,
                usedLegAvg,
                usedPaxAvg
            };
        }

        public async Task<object> GetRptFuelRouteMonthly(int year, string route)
        {
            var query = this.context.RptFuelMonthlyRoutes
                .Where(q => q.Year == year && q.Route == route).OrderBy(q => q.Month);
            var items = await query.ToListAsync();
            var usedAvg = Math.Round((double)items.Average(q => q.UsedKilo), 2, MidpointRounding.AwayFromZero);
            var usedLegAvg = Math.Round((double)items.Average(q => q.UsedKiloPerLeg), 2, MidpointRounding.AwayFromZero);
            var usedPaxAvg = Math.Round((double)items.Average(q => q.UsedPerPax), 2, MidpointRounding.AwayFromZero);
            //var usedAvgKilo = Math.Round((double)items.Average(q => q.Used), 2, MidpointRounding.AwayFromZero);
            return new
            {
                items,
                usedAvg,
                usedLegAvg,
                usedPaxAvg
            };
        }
        public async Task<object> GetRptCatAirportsDelayMonthlyByYear(int year, string airport, string cat)
        {
            var queryAirportCat = from x in this.context.RptDelayCatAirportMonthlyCals where x.Year <= 1402 select x;
            if (year != -1)
                queryAirportCat = queryAirportCat.Where(q => q.Year == year);
            if (airport != "-")
                queryAirportCat = queryAirportCat.Where(q => q.Airport == airport);
            if (cat != "-")
                queryAirportCat = queryAirportCat.Where(q => q.ICategory == cat);
            var airportsCats = await queryAirportCat.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.ICategory).ToListAsync();
            return new
            {
                airportsCats
            };
        }
        public async Task<object> GetRptCatAirportsDelayDailyByYearMonth(int year,int month, string airport, string cat)
        {
            var queryAirportCat = from x in this.context.RptDelayCatAirportDailyCals  select x;
          
                queryAirportCat = queryAirportCat.Where(q =>  q.Year == year && q.Month==month);
            if (airport != "-")
                queryAirportCat = queryAirportCat.Where(q => q.Airport == airport);
            if (cat != "-")
                queryAirportCat = queryAirportCat.Where(q => q.ICategory == cat);
            var airportsCats = await queryAirportCat.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q=>q.Day).ThenBy(q => q.ICategory).ToListAsync();
            return new
            {
                airportsCats
            };
        }
        public class SummaryRow
        {
            public int Year { get; set; }
            public int? Delay { get; set; }
            public int? BlockTime { get; set; }
            public int? Cycle { get; set; }
            public int? TotalPax { get; set; }
            public int? DelayedFlights { get; set; }
            public int? OnTimeFlights { get; set; }



        }
        public async Task<object> GetRptCategoriesDelayMonthlyByYear(int year)
        {
            var categories = new List<RptDelayCatMonthlyCal>();
            var categoryNames = new List<string>();
            var queryCat = from x in this.context.RptDelayCatMonthlyCals where x.Year <= 1402 select x;
            if (year != -1)
                queryCat = queryCat.Where(q => q.Year == year);
            categories = await queryCat.OrderBy(q => q.ICategory).ThenBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();
            categoryNames = categories.Select(q => q.ICategory).Distinct().OrderBy(q => q).ToList();
            return new
            {
                categories,
                categoryNames
            };
        }
        
        public async Task<object> GetRptCategoriesDelayDailyByYearMonth(int year, int month)
        {

            var queryCat = from x in this.context.RptDelayCatDailyCals select x;

            queryCat = queryCat.Where(q => q.Year == year && q.Month == month);
            var categories = await queryCat.OrderBy(q => q.ICategory).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q=>q.Day).ToListAsync();
            var categoryNames = await this.context.GrpDelayCategories.OrderBy(q => q.ICategory).ToListAsync();

            return new
            {
                 categories,
                 categoryNames
            };

        }
        public async Task<object> GetRptCategoriesDelayDailyByYearMonth(string yms)
        {
            var parts = yms.Split('#').ToList(); ;

            var queryCat = from x in this.context.RptDelayCatDailyCals
                        select x;
            queryCat = queryCat.Where(q => parts.Contains(q.YearMonth));
            var categories = await queryCat.OrderBy(q => q.ICategory).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ToListAsync();
            var categoryNames = await this.context.GrpDelayCategories.OrderBy(q => q.ICategory).ToListAsync();
            return new
            {
                categories,
                categoryNames
            };
        }
        public async Task<object> GetMonthAirportsDelaySummary(string yms)
        {
            var parts = yms.Split('#').ToList();  

            var query = from x in this.context.RptDelayAirportDailyCals
                        select x;
            query = query.Where(q => parts.Contains(q.YearMonth));
           // var airports = await query.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ToListAsync();
            var summary =await (from x in query
                           group x by new { x.Year, x.Month, x.MonthName, x.Airport } into grp
                           select new
                           {
                               grp.Key.Year,
                               grp.Key.Month,
                               grp.Key.MonthName,
                               grp.Key.Airport,
                               Delay = grp.Sum(q => q.Delay),

                           }).ToListAsync();
            summary = summary.Where(q => q.Delay > 0).ToList();
            return new
            {
                //airports,
                summary
            };
        }
        public async Task<object> GetRptAirportsDelayDailyByYearMonth(string yms)
        {
            var parts = yms.Split('#').ToList(); ;

            var query  = from x in this.context.RptDelayAirportDailyCals
                           select x;
            query  = query.Where(q => parts.Contains(q.YearMonth));
            var airports = await query.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ToListAsync();
            var summary = (from x in airports
                           group x by new { x.Year, x.Month, x.MonthName, x.Airport } into grp
                           select new
                           {
                               grp.Key.Year,
                               grp.Key.Month,
                               grp.Key.MonthName,
                               grp.Key.Airport,
                               Delay = grp.Sum(q => q.Delay),

                           }).ToList();
            return new
            {
                airports,
                summary
            };
        }
        public async Task<object> GetRptCategoriesDelayDailyByYearMonthCat(string ymscat)
        {
            var parts = ymscat.Split('#').Select(q=>q.Replace("_"," ")).ToList(); ;

            var queryCat = from x in this.context.RptDelayCatDailyCals
                           select x;
            queryCat = queryCat.Where(q => parts.Contains(q.YearMonthCat));
            var categories = await queryCat.OrderBy(q => q.ICategory).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ToListAsync();
            //var categoryNames = await this.context.GrpDelayCategories.OrderBy(q => q.ICategory).ToListAsync();
            var summary = (from x in categories
                           group x by new { x.Year, x.Month, x.MonthName,x.ICategory } into grp
                           select new
                           {
                               grp.Key.Year,
                               grp.Key.Month,
                               grp.Key.MonthName,
                               grp.Key.ICategory,
                               Delay = grp.Sum(q => q.Delay),
                                
                           }).ToList();
            return new
            {
                categories,
                summary
                 
            };
        }

        public async Task<object> GetMonthCategoriesSummary(string yms)
        {
            var parts = yms.Split('#').ToList(); ;

            var queryCat = from x in this.context.RptDelayCatDailyCals
                           select x;
            queryCat = queryCat.Where(q => parts.Contains(q.YearMonth));
            
            var summary = await (from x in queryCat
                           group x by new { x.Year, x.Month, x.MonthName, x.ICategory } into grp
                           select new
                           {
                               grp.Key.Year,
                               grp.Key.Month,
                               grp.Key.MonthName,
                               grp.Key.ICategory,
                               Delay = grp.Sum(q => q.Delay),

                           }).ToListAsync();
            summary = summary.Where(q => q.Delay > 0).ToList();
            return new
            {
                 
                summary

            };
        }

        public async Task<object> GetCatNames()
        {
            var categoryNames = await this.context.GrpDelayCategories.OrderBy(q => q.ICategory).ToListAsync();
            return new
            {
                 
                categoryNames
            };
        }
        public async Task<object> GetAirports()
        {
            var airports = await this.context.GrpAirports.OrderBy(q => q.FromAirportIATA).Select(q=>q.FromAirportIATA).ToListAsync();
            return airports;
        }

        public async Task<object> GetRptTechnicalsDelayMonthlyByYear(int year)
        {
            var technicals = new List<RptDelayCatRegisterMonthlyCal>();
            var queryTechnical = from x in this.context.RptDelayCatRegisterMonthlyCals where x.ICategory == "TECHNICAL" && x.Year <= 1402 select x;
            if (year != -1)
                queryTechnical = queryTechnical.Where(q => q.Year == year);
            technicals = await queryTechnical.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Register).ToListAsync();
            return new
            {
                technicals
            };
        }
        public async Task<object> GetRptTechnicalsDelayDailyByYearMonth(int year,int month)
        {
            
            var queryTechnical = from x in this.context.RptDelayCatRegisterDailyCals where x.ICategory == "TECHNICAL" select x;
             
                queryTechnical = queryTechnical.Where(q => q.Year == year && q.Month==month);
            var technicals = await queryTechnical.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q=>q.Day).ThenBy(q => q.Register).ToListAsync();
            return new
            {
                technicals
            };
        }
        public async Task<object> GetRptAirportsDelayMonthlyByYear(int year)
        {
            var airports = new List<RptDelayAirportMonthlyCal>();
            var queryAirport = from x in this.context.RptDelayAirportMonthlyCals where x.Year <= 1402 select x;
            if (year != -1)
                queryAirport = queryAirport.Where(q => q.Year == year);
            airports = await queryAirport.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();

            return new
            {
                airports
            };
        }
        public async Task<object> GetRptAirportsDelayDailyByYearMonth(int year,int month)
        {
             
            var queryAirport = from x in this.context.RptDelayAirportDailyCals  select x;
            
            queryAirport = queryAirport.Where(q => q.Year == year && q.Month==month);
            var airports = await queryAirport.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q=>q.Day).ToListAsync();

            return new
            {
                airports
            };
        }
        public async Task<object> GetRptDelayDailyByYearMonth(int year, int month)
        {
            var query = from x in this.context.RptDelayDailyCals
                        select x;
            query = query.Where(q => q.Year == year && q.Month == month);
            var items = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ToListAsync();
            return new
            {
                items,
            };
        }
        //4-24
        public async Task<object> GetRptDelayDailyByYearMonth(string yms)
        {
            var parts = yms.Split('*').ToList(); ;
             
            var query = from x in this.context.RptDelayDailyCals
                        select x;
            query = query.Where(q =>parts.Contains(q.YearMonth));
            var items = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Day).ToListAsync();
            var summary = (from x in items
                               group x by new { x.Year,x.Month,x.MonthName } into grp
                               select new
                               {
                                   grp.Key.Year,
                                   grp.Key.Month,
                                   grp.Key.MonthName,
                                   Delay = grp.Sum(q => q.Delay),
                                   BlockTime = grp.Sum(q => q.ABlockTime),
                                   Cycles = grp.Sum(q => q.AFlightCount),
                                    

                               }).ToList();
            return new
            {
                items,
                summary
            };
        }

        public async Task<object> GetRptDelayItems(int year,int month,int day,string cat,string apt)
        {
            

            var query = from x in this.context.ViewFlightDelays
                        where x.PYear==year
                        select x;
            if (month != -1)
                query = query.Where(q => q.PMonth == month);
            if (day != -1)
                query = query.Where(q => q.PDay == day);
            if (cat != "-")
                query = query.Where(q => q.MapTitle2 == cat);
            if (apt != "-")
                query = query.Where(q => q.FromAirportIATA == apt);
            
            var items = await query.OrderBy(q => q.PYear).ThenBy(q => q.PMonth).ThenBy(q => q.PDay).ThenBy(q=>q.Register).ThenBy(q=>q.STD).ToListAsync();
            return items;
        }

        public async Task<object> GetRptDelayItems(string yms,  string cat, string apt,int range)
        {
            var yearMonth = yms.Split('^').ToList();
            var cats =cat!="-"? cat.Replace("_", " ").Split('^').ToList():new List<string>();
            var apts =apt != "-" ? apt.Split('^').ToList():new List<string>();

            var query = from x in this.context.ViewFlightDelays
                        where yearMonth.Contains(x.PYearMonth)
                        select x;
            if (cats.Count>0)
                query = query.Where(q => cats.Contains(q.MapTitle2));
            if (apts.Count>0)
                query = query.Where(q =>apts.Contains(q.FromAirportIATA));
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

            var items = await query.OrderBy(q => q.PYear).ThenBy(q => q.PMonth).ThenBy(q => q.PDay).ThenBy(q => q.Register).ThenBy(q => q.STD).ToListAsync();
            return items;
        }

        public async Task<object> GetRptDelayMonthlyByYear(int year)
        {
            var query = from x in this.context.RptDelayMonthlyCals
                        where x.Year <= 1402
                        select x;
            if (year != -1)  
                query = query.Where(q => q.Year == year);
            var items = await query.OrderBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();

            var yearSummary = (from x in items
                               group x by new { x.Year } into grp
                               select new
                               {
                                   Year = grp.Key.Year,
                                   Delay = grp.Sum(q => q.Delay),
                                   Delay30 = grp.Sum(q => q.DelayUnder30),
                                   Delay3060 = grp.Sum(q => q.Delay3060),
                                   Delay60120 = grp.Sum(q => q.Delay60120),
                                   Delay120180 = grp.Sum(q => q.Delay120180),
                                   Delay180 = grp.Sum(q => q.DelayOver180),
                                   BlockTime = grp.Sum(q => q.ABlockTime),
                                   Cycles = grp.Sum(q => q.AFlightCount),
                                   DelayedFlights = grp.Sum(q => q.FlightCount),
                                   OnTimeFlights = grp.Sum(q => q.OnTimeFlightCount),
                                   TotalPax = grp.Sum(q => q.TotalPax),
                                   TotalPaxAll = grp.Sum(q => q.TotalPaxAll),

                               }).ToList();


            var queryGrpFlights = from x in this.context.GrpFlightCals where x.Year <= 1402 select x;
            if (year != -1)
                queryGrpFlights = queryGrpFlights.Where(q => q.PYear == year);
            var totalFlights = await queryGrpFlights.OrderBy(q => q.PYear).ThenBy(q => q.PMonth).ToListAsync();


            var categories = new List<RptDelayCatMonthlyCal>();
            var categoryNames = new List<string>();
            var queryCat = from x in this.context.RptDelayCatMonthlyCals where x.Year <= 1402 select x;
            if (year != -1)
                queryCat = queryCat.Where(q => q.Year == year);
            //categories=await queryCat.OrderBy(q => q.ICategory).ThenBy(q=>q.Year).ThenBy(q => q.Month).ToListAsync();
            categoryNames = await queryCat.Select(q => q.ICategory).Distinct().OrderBy(q => q).ToListAsync();


            var technicals = new List<RptDelayCatRegisterMonthlyCal>();
            //var queryTechnical = from x in this.context.RptDelayCatRegisterMonthlyCals where x.ICategory == "TECHNICAL" && x.Year<=1400 select x;
            //if (year != -1)
            //    queryTechnical = queryTechnical.Where(q => q.Year == year);
            //technicals= await queryTechnical.OrderBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q => q.Register).ToListAsync();


            var airports = new List<RptDelayAirportMonthlyCal>();
            // var queryAirport = from x in this.context.RptDelayAirportMonthlyCals where x.Year <= 1400 select x;
            // if (year != -1)
            //     queryAirport = queryAirport.Where(q => q.Year == year);
            // var airports = await queryAirport.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ToListAsync();



            //////////////////////////
            ///////////////////////////
            //var queryAirportCat = from x in this.context.RptDelayCatAirportMonthlyCals where x.Year < 1400 select x;
            //if (year != -1)
            //     queryAirportCat = queryAirportCat.Where(q => q.Year == year);
            // var airportsCats = await queryAirportCat.OrderBy(q => q.Airport).ThenBy(q => q.Year).ThenBy(q => q.Month).ThenBy(q=>q.ICategory).ToListAsync();
            /////////////////////////
            ////////////////////////


            var totalDelay = items.Sum(q => q.Delay);
            var totalBlockTime = totalFlights.Sum(q => q.BlockTime);
            var totalCycles = totalFlights.Sum(q => q.FlightCount);
            var dlAverage = totalCycles == 0 ? null : (Nullable<double>)Math.Round((double)(totalDelay * 1.0 / totalCycles), 2, MidpointRounding.AwayFromZero);
            var dblAverage = totalBlockTime == 0 ? null : (Nullable<double>)Math.Round((double)(totalDelay * 1.0 / totalBlockTime), 2, MidpointRounding.AwayFromZero);



            return new
            {
                items,
                totalFlights,
                categories,
                categoryNames,
                technicals,
                airports,
                apts = airports.ToList(),
                //airportsCats,
                totalDelay,
                totalBlockTime,
                totalCycles,
                dlAverage,
                dblAverage,
                yearSummary
            };
        }



        public async Task<object> GetDlyGrpFlights(int year, int month, int apt = -1, int min = -1, int max = -1)
        {
            var query = from x in this.context.DlyGrpFlights
                        where x.PYear == year && x.PMonth == month //&& x.FromAirport == apt

                        select x;
            if (apt != -1)
            {
                query = query.Where(q => q.FromAirport == apt);
            }
            if (min != -1)
            {
                query = query.Where(q => q.Delay >= min && q.Delay < max);
            }


            return await query.OrderBy(q => q.ChocksOut).ToListAsync();
        }

        public async Task<object> GetDlyGrpFlightCats(int year, int month, string cat = "-", string reg = "-", int apt = -1, int min = -1, int max = -1)
        {
            var query = from x in this.context.DlyGrpFlightCats
                        where x.PYear == year && x.PMonth == month //&& x.FromAirport == apt

                        select x;
            if (cat != "-")
            {
                query = query.Where(q => q.ICategory == cat);
            }
            if (reg != "-")
            {
                query = query.Where(q => q.Register == reg);
            }
            if (apt != -1)
            {
                query = query.Where(q => q.FromAirport == apt);
            }
            if (min != -1)
            {
                query = query.Where(q => q.Delay >= min && q.Delay < max);
            }


            return await query.OrderBy(q => q.ChocksOut).ToListAsync();
        }

        public async Task<object> GetFlightDelays(int flightId)
        {
            var query = from x in this.context.RptDelayLegMaps
                        where x.FlightId == flightId
                        orderby x.Delay descending
                        select x;
            return await query.ToListAsync();
        }




    }
}