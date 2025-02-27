using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using DevExpress.DataAccess.Json;

namespace Report
{
    public partial class RptCabinTrainingCard : DevExpress.XtraReports.UI.XtraReport
    {
         
        public RptCabinTrainingCard()
        {
            InitializeComponent();
            //var ds = this.DataSource as JsonDataSource;
            
            //img.ImageUrl = "http://fleet.flypersia.aero/airpocket/upload/clientsfiles/201911121654139_0_54982.jpg";
        }

        private void img_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            
        }

        private void RptCabinTrainingCard_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
           
        }

        private void Detail_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            var rank = Convert.ToString(GetCurrentColumnValue("Rank"));

            var str =Convert.ToString( GetCurrentColumnValue("ImageUrl"));
            img.ImageUrl = str;
            if (rank.Contains("CCM"))
                lbltitle.Text = "CABIN CREW TRAINING RECORD";
            else
            lbltitle.Text = "COCKPIT CREW TRAINING RECORD";
        }
    }
}
