using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using DevExpress.DataAccess.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
namespace Report
{
    public partial class rptOPC : DevExpress.XtraReports.UI.XtraReport
    {
        string _pic = "PIC";
        public rptOPC(string pid)
        {
            InitializeComponent();
            _pic = pid == "1" ? "PIC" : "FO";
        }

        private void Detail_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            lblPIC.Text = _pic;
            var ds = this.DataSource as JsonDataSource;
           
            var str = ds.JsonSource.GetJsonString();
            dynamic data = JObject.Parse(str);
            string _img = Convert.ToString(data.Person.ImageUrl);
            var fn = Convert.ToString(data.Person.FirstName);
             var ln = Convert.ToString(data.Person.LastName);
             lblName.Text = fn.ToUpper() + " " + ln.ToUpper();


            //var str = "https://fleet.caspianairlines.com/upload/clientsfiles/"+ _img;

            // img.ImageUrl = "https://fleet.flypersia.aero//airpocket/upload/clientsfiles/"+ _img;
            //img.ImageUrl = "http://127.0.0.1/airpocket/upload/clientsfiles/" + _img;

            img.ImageSource = new DevExpress.XtraPrinting.Drawing.ImageSource(new Bitmap("E:\\ap\\upload\\clientsfiles\\"+_img));


            /*"C:\\inetpub\\wwwroot\\upload\\clientsfiles\\"*/

            // xrLabel22.Text = "C:\\inetpub\\wwwroot\\upload\\clientsfiles\\" + _img;

            //var fn= Convert.ToString(GetCurrentColumnValue("Person.FirstName"));
            //var ln = Convert.ToString(GetCurrentColumnValue("Person.LastName"));
            //lblName.Text = fn.ToUpper() + " " + ln.ToUpper();
        }
    }
}
