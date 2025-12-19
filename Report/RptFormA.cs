using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using System.Web.Configuration;

namespace Report
{
    public partial class RptFormA : DevExpress.XtraReports.UI.XtraReport
    {
        public RptFormA()
        {
            InitializeComponent();
            xrPictureBoxLogo.ImageUrl = WebConfigurationManager.AppSettings["logo"] + ".png";
        }

        private void RptFormA_BeforePrint(object sender, CancelEventArgs e)
        {
            string airline = WebConfigurationManager.AppSettings["customer"];
            lbl_airline.Text = airline;
            xrPictureBoxLogo.ImageUrl = WebConfigurationManager.AppSettings["logo"] + ".png";
           

        }
    }
}
