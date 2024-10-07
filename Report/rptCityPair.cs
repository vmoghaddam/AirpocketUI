using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using System.Web.Configuration;

namespace Report
{
    public partial class rptCityPair : DevExpress.XtraReports.UI.XtraReport
    {
        public rptCityPair()
        {
            InitializeComponent();
        }
        public rptCityPair(string year,string month, string region)
        {
            InitializeComponent();
            string airline = WebConfigurationManager.AppSettings["customer"];
            string monthName = new DateTime(2021, Convert.ToInt32(month), 1)
    .ToString("MMM");
            lblMonth.Text = monthName;
            lblYear.Text = year;
            lblRegion.Text = region;
            lbl_airline.Text = airline;
           // lblDate.Text = DateTime.Now.ToString("yyyy MMMM dd");

        }

    }
}
