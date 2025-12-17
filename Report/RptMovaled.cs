using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using System.Configuration;
using System.Web.Configuration;

namespace Report
{
    public partial class RptMovaled : DevExpress.XtraReports.UI.XtraReport
    {
        public RptMovaled()
        {
            InitializeComponent();
            RequestParameters = false;
            Parameters["PAirline"].Value = ConfigurationManager.AppSettings["airline_persian"];
            xrPictureBoxLogo.ImageUrl = WebConfigurationManager.AppSettings["logo"] + ".png";
        }

    }
}
