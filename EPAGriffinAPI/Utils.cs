using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Utils
{
    public class DateTimeUtil
    {
        public static string GetMonthName(int m)
        {
            switch (m)
            {
                case 1:
                    return "فروردین";
                case 2:
                    return "اردیبهشت";
                case 3:
                    return "خرداد";
                case 4:
                    return "تیر";
                case 5:
                    return "مرداد";
                case 6:
                    return "شهریور";
                case 7:
                    return "مهر";
                case 8:
                    return "آبان";
                case 9:
                    return "آذر";
                case 10:
                    return "دی";
                case 11:
                    return "بهمن";
                case 12:
                    return "اسفند";
                default:
                    return string.Empty;
            }
        }

        public static DateTime ConvertToGeorgian(string dt)
        {
            var year = Convert.ToInt32(dt.Substring(0, 4));
            var month = Convert.ToInt32(dt.Substring(4, 2));
            var day = Convert.ToInt32(dt.Substring(6, 2));
            var hh = Convert.ToInt32(dt.Substring(8, 2));
            var mm = Convert.ToInt32(dt.Substring(10, 2));
            var ss = Convert.ToInt32(dt.Substring(12, 2));
            // DateTime epoch = new DateTime(1, 1, 1, new HijriCalendar());
            var gdate = new DateTime(year, month, day, hh, mm, ss, new PersianCalendar());
            return gdate;
        }

        public static string GetPersianDate(DateTime d)
        {
            if (d.ToString() == "1/1/0001 12:00:00 AM")
                return "";
            if (d == Convert.ToDateTime("1900/01/01"))
                return "";
            if (d == Convert.ToDateTime("2100/01/01"))
                return "";
            System.Globalization.PersianCalendar pcal = new System.Globalization.PersianCalendar();
            string YY = pcal.GetYear(d).ToString();
            string MM = pcal.GetMonth(d).ToString();
            string DD = pcal.GetDayOfMonth(d).ToString();
            if (MM.Length == 1)
                MM = "0" + MM;
            if (DD.Length == 1)
                DD = "0" + DD;
            return YY + "/" + MM + "/" + DD;


        }
        public static string GetPersianDateDigital(DateTime d)
        {
            System.Globalization.PersianCalendar pcal = new System.Globalization.PersianCalendar();
            string YY = pcal.GetYear(d).ToString().PadLeft(4, '0');
            string MM = pcal.GetMonth(d).ToString().PadLeft(2, '0');
            string DD = pcal.GetDayOfMonth(d).ToString().PadLeft(2, '0');
            return YY + MM + DD;

        }

        public static string GetPersianDateTimeDigital(DateTime d)
        {
            System.Globalization.PersianCalendar pcal = new System.Globalization.PersianCalendar();
            string YY = String.Format(pcal.GetYear(d).ToString(), "0000");
            string MM = pcal.GetMonth(d).ToString().PadLeft(2, '0'); //String.Format(pcal.GetMonth(d).ToString(), "00");
            string DD = pcal.GetDayOfMonth(d).ToString().PadLeft(2, '0'); //String.Format(pcal.GetDayOfMonth(d).ToString(), "00");

            return YY + MM + DD
                + d.Hour.ToString().PadLeft(2, '0')// String.Format(d.Hour.ToString(), "00").ToString() 
                + d.Minute.ToString().PadLeft(2, '0') // String.Format(d.Minute.ToString(), "00").ToString() 
                + d.Second.ToString().PadLeft(2, '0');// String.Format(d.Second.ToString(), "00").ToString();

        }

        public static string formatDate(string dt)
        {
            try
            {
                if (string.IsNullOrEmpty(dt))
                    return string.Empty;
                return dt.Substring(0, 4) + "/" + dt.Substring(4, 2) + "/" + dt.Substring(6, 2);
            }
            catch (Exception ex)
            {
                return dt;
            }

        }

        public static string addDay(int n, int d)
        {
            var year = Convert.ToInt32(n.ToString().Substring(0, 4));
            var month = Convert.ToInt32(n.ToString().Substring(4, 2));
            var day = Convert.ToInt32(n.ToString().Substring(6, 2));

            var gdate = Convert.ToDateTime(formatDate(n.ToString()));
            var newdt = gdate.AddDays(d);

            System.Globalization.PersianCalendar pcal = new System.Globalization.PersianCalendar();
            string YY = pcal.GetYear(newdt).ToString();
            string MM = pcal.GetMonth(newdt).ToString();
            string DD = pcal.GetDayOfMonth(newdt).ToString();

            return YY + MM.PadLeft(2, '0') + DD.PadLeft(2, '0');
        }
    }

    public class CustomActionResult<T> : IHttpActionResult
    {

        private System.Net.HttpStatusCode statusCode;

        T data;

        public CustomActionResult(System.Net.HttpStatusCode statusCode, T data)
        {

            this.statusCode = statusCode;

            this.data = data;

        }
        public HttpResponseMessage CreateResponse(System.Net.HttpStatusCode statusCode, T data)
        {

            HttpRequestMessage request = new HttpRequestMessage();
            request.Properties.Add(System.Web.Http.Hosting.HttpPropertyKeys.HttpConfigurationKey, new HttpConfiguration());

            HttpResponseMessage response = request.CreateResponse(statusCode, data);

            return response;

        }
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(CreateResponse(this.statusCode, this.data));
        }

    }

    public class CustomActionResult : IHttpActionResult
    {

        private System.Net.HttpStatusCode statusCode;

        object data;

        public CustomActionResult(System.Net.HttpStatusCode statusCode, object data)
        {

            this.statusCode = statusCode;

            this.data = data;

        }
        public HttpResponseMessage CreateResponse(System.Net.HttpStatusCode statusCode, object data)
        {

            HttpRequestMessage request = new HttpRequestMessage();
            request.Properties.Add(System.Web.Http.Hosting.HttpPropertyKeys.HttpConfigurationKey, new HttpConfiguration());

            HttpResponseMessage response = request.CreateResponse(statusCode, data);

            return response;

        }
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(CreateResponse(this.statusCode, this.data));
        }

    }
}