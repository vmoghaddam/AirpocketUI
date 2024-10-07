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
using System.Drawing.Text;
using DevExpress.Utils.Serializing;

namespace Report
{
    public partial class rptFPCPasco : DevExpress.XtraReports.UI.XtraReport
    {
        public rptFPCPasco()
        {
            InitializeComponent();
            PrintingSystemXmlSerializer.UnregisterConverter(typeof(Font));
            PrintingSystemXmlSerializer.RegisterConverter(new CustomFontConverter());
        }
        public string ClassId { get; set; }
        public string Id { get; set; }
        DateTime? expire = null;
        private void rptFPC_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
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


            lblHead.Text = Convert.ToString(data.TrainingDirector).ToUpper();
            lblInstructor.Text = Convert.ToString(data.Instructor).ToUpper();
            DateTime issue = Convert.ToDateTime(data.DateIssue);
            expire = data.DateExpire != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateExpire) : null;
            DateTime? status = data.DateStatus != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateStatus) : null;

            lblIssue2.Text = issue.ToString("dd MMM yyyy").ToUpper();
            lblExpire2.Text = expire != null ? ((DateTime)expire).ToString("dd MMM yyyy").ToUpper() : "";
            lblDate.Text = "Feb. 2022";//status != null ? ((DateTime)status).ToString("MMM.yyyy").ToUpper() : "";

            DateTime? from = data.DateStart != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateStart) : null;
            DateTime? to = data.DateEnd != null ? (Nullable<DateTime>)Convert.ToDateTime(data.DateEnd) : null;

            lblFrom.Text = from != null ? ((DateTime)from).ToString("dd MMM yyyy").ToUpper() : "";
            lblTo.Text = to != null ? ((DateTime)to).ToString("dd MMM yyyy").ToUpper() : "";


            int duration = Convert.ToInt32(data.Duration);
            lblDuration.Text = duration.ToString();

            lblFormNo.Text = "FPI-TRN-02";
            lblIssueNo.Text = "01, Rev: 01";

            lblClassId.Text = "FPC-" + Convert.ToString(data.CourseId).ToUpper();
            this.ClassId = lblClassId.Text;
            lblCourseId.Text = "FPC-" + Convert.ToString(data.CourseId).ToUpper();

            lblName.Font = new Font(CustomFontsHelper.GetFamily("Andalus"), 29F, System.Drawing.FontStyle.Regular, GraphicsUnit.Point);

            cIssue.Font = new Font(CustomFontsHelper.GetFamily("Andalus"), 14F, System.Drawing.FontStyle.Bold, GraphicsUnit.Point);
            cExpire.Font = new Font(CustomFontsHelper.GetFamily("Andalus"), 14F, System.Drawing.FontStyle.Bold, GraphicsUnit.Point);
            lblIssue2.Font = new Font(CustomFontsHelper.GetFamily("Andalus"), 14F, System.Drawing.FontStyle.Regular, GraphicsUnit.Point);
            lblExpire2.Font = new Font(CustomFontsHelper.GetFamily("Andalus"), 14F, System.Drawing.FontStyle.Regular, GraphicsUnit.Point);
        }
        string folder = WebConfigurationManager.AppSettings["folder"];
        private void rptFPC_AfterPrint(object sender, EventArgs e)
        {
            string imageExportFile = /*Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)*/folder + @"\" + "FPC-" + this.Id + ".png";
            this.ExportOptions.Image.ExportMode = ImageExportMode.SingleFile;
            this.ExportOptions.Image.Format = System.Drawing.Imaging.ImageFormat.Png;

            this.ExportToImage(imageExportFile);
        }

        private void xrPictureBox1_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
             
        }

        private void lblCourseId_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            e.Cancel = true;
        }

        private void lblIssueNo_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            e.Cancel = true;
        }

        private void xrPictureBox2_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            
        }

        private void cExpire_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
           // if (expire != null)
            //    e.Cancel = true;
        }

        private void lblExpire2_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
           // if (expire != null)
             //   e.Cancel = true;
        }
    }

    //public static class CustomFontsHelper
    //{

    //    static PrivateFontCollection fontCollection;
    //    public static FontCollection FontCollection
    //    {
    //        get
    //        {
    //            if (fontCollection == null)
    //            {
    //                fontCollection = new PrivateFontCollection();
    //                fontCollection.AddFontFile("./Fonts/MissFajardose-Regular.ttf");
    //            }
    //            return fontCollection;
    //        }
    //    }

    //    public static FontFamily GetFamily(string familyName)
    //    {
    //        return FontCollection.Families.FirstOrDefault(ff => ff.Name == familyName);
    //    }
    //}
}
