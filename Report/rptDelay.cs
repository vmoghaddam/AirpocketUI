using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using System.Globalization;
using System.Web.Configuration;

namespace Report
{
    public partial class rptDelay : DevExpress.XtraReports.UI.XtraReport
    {
        public rptDelay(DateTime dt,DateTime df)
        {
            InitializeComponent();
            string customer = WebConfigurationManager.AppSettings["customer"];
            if (customer == "flypersia")
            {
                xrLabel2.Text = "گزارش تجمیعی تاخیرات پروازهای  هواپیمایی فلای پرشیا";
                xrPictureBoxFly.Visible = true;
                xrPictureBoxCaspian.Visible = false;
            }
            else
            if (customer == "ava")
            {
                xrLabel2.Text = "گزارش تجمیعی تاخیرات پروازهای  هواپیمایی آوا";
                xrPictureBoxFly.Visible = false;
                xrPictureBoxCaspian.Visible = false;
            }
            else
            {
                xrPictureBoxFly.Visible = false;
                xrPictureBoxCaspian.Visible = true;
            }

            PersianCalendar pc = new PersianCalendar();
            var dfPersian = string.Format("{0}/{1}/{2}", pc.GetYear(df), pc.GetMonth(df).ToString().PadLeft(2,'0'), pc.GetDayOfMonth(df).ToString().PadLeft(2, '0'));
            var dtPersian = string.Format("{0}/{1}/{2}", pc.GetYear(dt), pc.GetMonth(dt).ToString().PadLeft(2, '0'), pc.GetDayOfMonth(dt).ToString().PadLeft(2, '0'));
            lbldf.Text = dfPersian;
            lbldt.Text = dtPersian;
           
        }

        private void xrSubreport1_BeforePrint(object sender, CancelEventArgs e)
        {
            XRSubreport subreport = sender as XRSubreport;
            XtraReport reportSource = subreport.ReportSource as XtraReport;
            reportSource.DataSource = this.DataSource;
            
        }
    }
}
