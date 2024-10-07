using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using DevExpress.DataAccess.Json;
using Newtonsoft.Json.Linq;

namespace Report
{
    public partial class rptRosterSecurity : DevExpress.XtraReports.UI.XtraReport
    {
        public rptRosterSecurity()
        {
            InitializeComponent();
        }

        private void Detail1_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {

        }
        public string pdate { get; set; }
        private void Detail_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            var ds = this.DataSource as JsonDataSource;
            // ds.Fill();
            // var xx = new CustomJsonSource();
            var str = ds.JsonSource.GetJsonString();
            dynamic data = JObject.Parse(str);
            pdate = Convert.ToString(data.pdate);
        }

        private void lblDate_AfterPrint(object sender, EventArgs e)
        {
            
        }

        private void lblDate_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            var cell = sender as XRTableCell;
            cell.Text = pdate;
        }
    }
}
