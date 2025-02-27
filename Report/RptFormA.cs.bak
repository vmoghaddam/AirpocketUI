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
        }

        private void RptFormA_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            string airline = WebConfigurationManager.AppSettings["customer"];
            lbl_airline.Text = airline;

            switch (airline)
            {
                case "VARESH AIRLINES":
                    pic_varesh.Visible = true;
                    break;
                case "KISHAIR":
                    pic_kish.Visible = true;
                    break;
                default:
                    break;
            }

        }
    }
}
