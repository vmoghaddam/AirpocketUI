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
    public partial class rptFPCVaresh : DevExpress.XtraReports.UI.XtraReport
    {
        public rptFPCVaresh()
        {
            InitializeComponent();
        }

        public string ClassId { get; set; }
        public string Id { get; set; }
        DateTime? expire = null;

        private void rptFPCVaresh_BeforePrint(object sender, CancelEventArgs e)
        {

            var ds = this.DataSource as JsonDataSource;
            // ds.Fill();
            // var xx = new CustomJsonSource();
            var str = ds.JsonSource.GetJsonString();
            dynamic data = JObject.Parse(str);
             
            string name = (Convert.ToString(data.FirstName) + " " + Convert.ToString(data.LastName));
            string nid = (Convert.ToString(data.NID)  );
            name =   name.ToUpper();
            lblName.Text = name;
            lblNID.Text = nid;
            lblCer.Text = Convert.ToString(data.Title).ToUpper();
            lblCerNo.Text = "VRH-TRN-" + Convert.ToString(data.No).ToUpper() + "-" + Convert.ToString(data.Id);
            this.Id = Convert.ToString(data.Id);


            //lblHead.Text = Convert.ToString(data.TrainingDirector).ToUpper();
            lblInstructor.Text = Convert.ToString(data.Instructor).ToUpper();
            DateTime issue = Convert.ToDateTime(data.DateIssue);
            expire = data.DateExpire != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateExpire) : null;
            DateTime? status = data.DateStatus != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateStatus) : null;

            lblIssue.Text = issue.ToString("yyyy/MM/dd").ToUpper();
            lblExpire.Text = expire != null ? ((DateTime)expire).ToString("yyyy/MM/dd").ToUpper() : "";
            //lblDate.Text = "JUL. 2023";//status != null ? ((DateTime)status).ToString("MMM.yyyy").ToUpper() : "";

            DateTime? from = data.DateStart != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateStart) : null;
            DateTime? to = data.DateEnd != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateEnd) : null;

            lblFrom.Text = from != null ? ((DateTime)from).ToString("yyyy/MM/dd").ToUpper() : "";
            lblTo.Text = to != null ? ((DateTime)to).ToString("yyyy/MM/dd").ToUpper() : "";


            int duration = Convert.ToInt32(data.Duration);
            lblDuration.Text = duration.ToString();

            

           // lblClassId.Text = Convert.ToString(data.No).ToUpper();
          //  this.ClassId = lblClassId.Text;
           // lblCourseId.Text = Convert.ToString(data.CourseId).ToUpper();

            string groupcode = Convert.ToString(data.JobGroupCode);
           // xrPictureBox3.Visible = groupcode.StartsWith("0000110") || groupcode.StartsWith("00101") || groupcode.StartsWith("00102") || groupcode.StartsWith("000010602");
            //lblOpsTrn.Visible = groupcode.StartsWith("0000110") || groupcode.StartsWith("00101") || groupcode.StartsWith("00102") || groupcode.StartsWith("000010602");
            //xrPictureBox1.Visible = !xrPictureBox3.Visible;
           // xrPictureBox2.Visible = !xrPictureBox3.Visible;
           // xrPictureBox1.Visible = false;
        }

        private void lblExpTitle_BeforePrint(object sender, CancelEventArgs e)
        {
            if (expire == null)
                e.Cancel = true;
        }

        private void lblExpire_BeforePrint(object sender, CancelEventArgs e)
        {
            if (expire == null)
                e.Cancel = true;
        }

        //string folder = WebConfigurationManager.AppSettings["folder"];



    }
}
