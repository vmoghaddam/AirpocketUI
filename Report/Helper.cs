using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Report
{
    public class HelperDate
    {
        public static string GetMMM_DD_YYYY (string dt)
        {

            var year =Convert.ToInt32( dt.Substring(0, 4));
            var month = Convert.ToInt32(dt.Substring(4, 2));
            var day = Convert.ToInt32(dt.Substring(6, 2));
            var date = new DateTime(year, month, day);
            return date.ToString("MMM").ToUpper() + "-" + day.ToString().PadLeft(2, '0') + "-" + year.ToString();

        }
        public static string GetMMM_DD_YYYY(DateTime date)
        {
             
            return date.ToString("MMM").ToUpper() + "-" + date.Day.ToString().PadLeft(2, '0') + "-" + date.Year.ToString();

        }
    }
}