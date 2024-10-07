using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using DevExpress.XtraReports.Expressions;

namespace Report
{
    public partial class RptFlight : DevExpress.XtraReports.UI.XtraReport
    {
        public RptFlight()
        {
            InitializeComponent();
            var df = "20200501";

            var dt = "20200507";
            lblDateFrom.Text = HelperDate.GetMMM_DD_YYYY(df);
            lblDateFrom2.Text = HelperDate.GetMMM_DD_YYYY(df);

            lblDateTo.Text = HelperDate.GetMMM_DD_YYYY(dt);
            lblDateTo2.Text = HelperDate.GetMMM_DD_YYYY(dt);

            lblDateReport.Text = HelperDate.GetMMM_DD_YYYY(DateTime.Now);

        }

        public RptFlight(string df,string dt)
        {
            InitializeComponent();
            lblDateFrom.Text = HelperDate.GetMMM_DD_YYYY(df);
            lblDateFrom2.Text = HelperDate.GetMMM_DD_YYYY(df);

            lblDateTo.Text = HelperDate.GetMMM_DD_YYYY(dt);
            lblDateTo2.Text = HelperDate.GetMMM_DD_YYYY(dt);

            lblDateReport.Text = HelperDate.GetMMM_DD_YYYY(DateTime.Now);

        }

        private void xrTableCell113_AfterPrint(object sender, EventArgs e)
        {
             
        }

        private void xrTableCell113_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
          
        }

        private void xrPageInfo1_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            e.Cancel = e.PageIndex == 0;
        }
    }
}
