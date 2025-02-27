using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;

namespace Report
{
    public partial class rptCourses : DevExpress.XtraReports.UI.XtraReport
    {
        public rptCourses()
        {
            InitializeComponent();
        }

        private void GroupHeader1_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            var str = Convert.ToString(GetCurrentColumnValue("ImageUrl"));
            img.ImageUrl = str;
        }
    }
}
