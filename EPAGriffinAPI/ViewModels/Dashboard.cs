using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public interface IDashboard
    {

    }
    public class Dashboard : IDashboard
    {

    }
    public class BookDistribution
    {
        public int TypeId { get; set; }
        public int Count { get; set; }
        public int NotExposed { get; set; }
    }
    public class DateRate
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; }
        public int Total { get; set; }
    }
    public class DashboardLibrary:Dashboard
    {
        public int Publishers { get; set; }
        public int Authors { get; set; }

        public int Journals { get; set; }

        //  public List<BookDistribution> Distribution { get; set; }
        public int DocumentsTotal { get; set; }
        public int BooksTotal { get; set; }
        public int PapersTotal { get; set; }
        public int VideosTotal { get; set; }

        public int DocumentsNotExposed { get; set; }
        public int BooksNotExposed { get; set; }
        public int PapersNotExposed { get; set; }
        public int VideosNotExposed { get; set; }

        public int DownloadTotal { get; set; }
        public int Careless { get; set; }
        public int CarelessBook { get; set; }
        public int CarelessVideo { get; set; }
        public int CarelessPaper { get; set; }
        public int CarelessDocument { get; set; }

        public List<DateRate> Download { get; set; }
        public List<DateRate> Add { get; set; }


    }

    public class TitleCourse
    {
        public int? Total { get; set; }
        public int? Assigned { get; set; }

        public int? Registered { get; set; }

        public int? UnRegistered { get; set; }

        public int? Learner { get; set; }
        public int? Failed { get; set; }
        public int? Passed { get; set; }
        public int? Canceled { get; set; }


    }

    public class TileAlert
    {
        public int? Total { get; set; }
        public int? Valid { get; set; }
        public int? Expired { get; set; }
        public int? Expiring { get; set; }
        public string Caption { get; set; }
        public string Remark { get; set; }

        public int? Type { get; set; }
    }

    public class DashboardProfile : Dashboard
    {
        public TitleCourse RegisteringCourse { get; set; }
        public TitleCourse ActiveCourse { get; set; }

        public TitleCourse CompletedCourse { get; set; }

        public List<Models.SumEmployeeJobGroup> EmployeesJobGroup { get; set; }

        public List<Models.SumEmployeeLocation> EmployeesLocation { get; set; }

        public List<Models.SumEmployeeStudyField> EmployeesStudyField { get; set; }

        public List<Models.SumEmployeeDegree> EmployeesDegree { get; set; }
        public List<Models.SumEmployeeSex> EmployeeSex { get; set; }
        public  Models.SumEmployeeAge  EmployeesAge { get; set; }

        public List<Models.SumEmployeeMaritalStatu> EmployeeMaritalStatus { get; set; }

        public List<Models.SumCertificateType> CertificatesTypes { get; set; }

        public Models.SumEmployeeExp EmployeesExp { get; set; }

        public TileAlert Certificate { get; set; }
        public TileAlert Passport { get; set; }
        public TileAlert Medical { get; set; }
        public TileAlert NDT { get; set; }
        public TileAlert CAO { get; set; }



    }

    public class DashboardClienApp : Dashboard
    {
        public List<TileAlert> Library { get; set; }
        public object NextFlight { get; set; }

        public object FTL { get; set; }

        public int Nots { get; set; }
        public DateTime? LastNotDate { get; set; }

        public string LastNot { get; set; }

        public string LastNotSender { get; set; }

        public string LastNotAbs { get; set; }


    }


}