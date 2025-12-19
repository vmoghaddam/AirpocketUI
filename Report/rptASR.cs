using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using System.Web.Configuration;
using System.Configuration;

namespace Report
{
    public partial class rptASR : DevExpress.XtraReports.UI.XtraReport
    {
        public rptASR()
        {
            InitializeComponent();
            RequestParameters = false;
            Parameters["airline"].Value = ConfigurationManager.AppSettings["airline"];
            Parameters["airline_code"].Value = ConfigurationManager.AppSettings["airline_code"];
            xrPictureBoxLogo.ImageUrl = WebConfigurationManager.AppSettings["logo"] + ".png";

        }

        private void xrTableCell4_AfterPrint(object sender, EventArgs e)
        {

        }
    }
}
