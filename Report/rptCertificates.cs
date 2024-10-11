using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;

namespace Report
{
    public partial class rptCertificates : DevExpress.XtraReports.UI.XtraReport
    {
        public rptCertificates()
        {
            InitializeComponent();
        }

        private void GroupHeader1_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            var str = Convert.ToString(GetCurrentColumnValue("ImageUrl"));
           // img.ImageUrl = str;

           // img.ImageSource = new DevExpress.XtraPrinting.Drawing.ImageSource(new Bitmap("E:\\ap\\upload\\clientsfiles\\" + str));



            var rank = Convert.ToString(GetCurrentColumnValue("JobGroup"));
            if (rank=="TRE" || rank=="TRI" || rank=="P1" || rank=="P2")
            {
                xcabin_image.Visible = false;
                xcabin_name.Visible = false;
                xcabin_title.Visible = false;

               // xcoc_a.Visible = true;
              //  xcoc_b.Visible = true;
              //  xcoc_c.Visible = true;
            }
            else
            {
               // xcabin_image.Visible = true;
               // xcabin_name.Visible = true;
              //  xcabin_title.Visible = true;

                xcoc_a.Visible = false;
                xcoc_b.Visible = false;
                xcoc_c.Visible = false;
            }


            //barcode
            //'https://fleet.flypersia.aero/trncard/frmreportview.aspx?type=11&pid='+ToStr([PersonId]*2+1237)

        }

        private void Detail_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
           
        }
    }
}
