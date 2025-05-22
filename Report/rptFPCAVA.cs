using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using DevExpress.DataAccess.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using DevExpress.XtraPrinting;
using System.Web.Configuration;
using System.Web;

namespace Report
{
    public partial class rptFPCAVA : DevExpress.XtraReports.UI.XtraReport
    {
        public rptFPCAVA()
        {
            InitializeComponent();
        }
        public string ClassId { get; set; }
        public string Id { get; set; }
        DateTime? expire = null;

        private void rptFPCAVA_BeforePrint(object sender, CancelEventArgs e)
        {
            var ds = this.DataSource as JsonDataSource;
            // ds.Fill();
            // var xx = new CustomJsonSource();
            var str = ds.JsonSource.GetJsonString();
            dynamic data = JObject.Parse(str);
            string sex = Convert.ToString(data.Sex);
            string name = (Convert.ToString(data.FirstName) + " " + Convert.ToString(data.LastName));
            name = (sex.ToLower() == "male" ? "Mr. " : "Ms. ") + name.ToUpper();
            lblName.Text = name;
            lblCer.Text = Convert.ToString(data.Title).ToUpper();
            lblCerNo.Text = "FPC-" + Convert.ToString(data.Id);
            this.Id = Convert.ToString(data.Id);

            xrBarCode1.Text = WebConfigurationManager.AppSettings["report_server_certificate"] + "/frmreportview.aspx?type=18&id=" + this.Id;


            lblHead.Text = Convert.ToString(data.TrainingDirector).ToUpper();
            lblInstructor.Text = Convert.ToString(data.Instructor).ToUpper();
            DateTime issue = Convert.ToDateTime(data.DateIssue);
            expire = data.DateExpire != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateExpire) : null;
            lblExpiryCaption.Visible = expire != null;


            DateTime? status = data.DateStatus != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateStatus) : null;

            lblIssue.Text = issue.ToString("dd MMM yyyy").ToUpper();
            lblExpire.Text = expire != null ? ((DateTime)expire).ToString("dd MMM yyyy").ToUpper() : "";
            //lblDate.Text = "JUL. 2023";//status != null ? ((DateTime)status).ToString("MMM.yyyy").ToUpper() : "";

            DateTime? from = data.DateStart != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateStart) : null;
            DateTime? to = data.DateEnd != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateEnd) : null;

            lblFrom.Text = from != null ? ((DateTime)from).ToString("dd MMM yyyy").ToUpper() : "";
            lblTo.Text = to != null ? ((DateTime)to).ToString("dd MMM yyyy").ToUpper() : "";


            int duration = Convert.ToInt32(data.Duration);
            lblDuration.Text = duration.ToString();

            //lblFormNo.Text = "FPI-TRN-02";
            //blIssueNo.Text = "01, Rev: 02";

            lblClassId.Text = Convert.ToString(data.No).ToUpper();
            this.ClassId = lblClassId.Text;
            //  lblCourseId.Text = Convert.ToString(data.CourseId).ToUpper();

            string groupcode = Convert.ToString(data.JobGroupCode);

            img_ins1.ImageUrl = "https://ava.airpocket.app/upload/ins/" + data.CustomerId+".png";

           // lblOpsTrn.Visible = groupcode.StartsWith("0000110") || groupcode.StartsWith("00101") || groupcode.StartsWith("00102") || groupcode.StartsWith("000010602");
           // lblOpsTrnCaption.Visible = lblOpsTrn.Visible;


        }

        string folder = WebConfigurationManager.AppSettings["folder"];

        private void rptFPCAVA_AfterPrint(object sender, EventArgs e)
        {
           // string imageExportFile = /*Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)*/folder + @"\" + "FPC-" + this.Id + ".png";
          //  this.ExportOptions.Image.ExportMode = ImageExportMode.SingleFile;
           // this.ExportOptions.Image.Format = System.Drawing.Imaging.ImageFormat.Png;

          //  this.ExportToImage(imageExportFile);
        }
    }
}
