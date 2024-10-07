using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace APWeather
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            listBox1.Items.Clear();
        }
         
        void CheckDelayedFlights(string url, string title)
        {


            if (this.listBox1.InvokeRequired)
            {
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(DateTime.Now.ToString()); }));
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(title); }));
            }
            else
            {
                listBox1.Items.Add(DateTime.Now.ToString());
                listBox1.Items.Add(title);
            }

           // string url = ConfigurationManager.AppSettings["url_metar"];
            using (WebClient webClient = new WebClient())
            {
                
                try
                {
                    var result = webClient.DownloadString(url);
                    if (this.listBox1.InvokeRequired)
                    {
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("done"); }));
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("----------------------------------------------"); }));
                    }
                    else
                    {
                        listBox1.Items.Add("done");
                        listBox1.Items.Add("--------------------------------------------");
                    }
                }
                catch (Exception ex)
                {
                    listBox1.Items.Add("Calling Webservice Failed");
                    listBox1.Items.Add(ex.Message);
                    listBox1.Items.Add("--------------------------------------------");
                }


            }

        }
        private void PollDelays(object sender, EventArgs e)
        {
            try
            {
                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_caspian"]) && _services.Contains("caspian"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_caspian"], "WX CASPIAN");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_varesh"]) && _services.Contains("varesh"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_varesh"], "WX VARESH");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_air"]) && _services.Contains("air"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_air"], "WX AIR");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_chb"]) && _services.Contains("chb"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_chb"], "WX CHB");

                // if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_atlas"]))
                //     CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_atlas"], "WX ATLAS");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_taban"]) && _services.Contains("taban"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_taban"], "WX TABAN");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_ava"]) && _services.Contains("ava"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_ava"], "WX AVA");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_fly"]) && _services.Contains("fly"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_fly"], "WX FLY");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_karoon"]) && _services.Contains("karoon"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_karoon"], "WX KAROON");


                //if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_metar"]))
                //{
                //    CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar"], "METAR");
                //    CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf"], "TAF");
                //    CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam"], "NOTAM");
                //}


                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar_taban"], "METAR TABAN");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf_taban"], "TAF  TABAN");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam_taban"], "NOTAM  TABAN");

                // if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_metar_varesh"]))
                // {
                //    CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar_varesh"], "METAR VARESH");
                //    CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf_varesh"], "TAF  VARESH");
                //    CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam_varesh"], "NOTAM  VARESH");
                //}


                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar_fly"], "METAR FLY");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf_fly"], "TAF  FLY");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam_fly"], "NOTAM  FLY");


                //CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar_chb"], "METAR CHB");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf_chb"], "TAF  CHB");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam_chb"], "NOTAM  CHB");


                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf_air"], "TAF  AIR");
                //CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam_air"], "NOTAM  AIR");
            }
            catch (Exception ex)
            {
               
                if (this.listBox1.InvokeRequired)
                {
                    listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("Calling Webservice Failed"); }));
                    listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(ex.Message); }));
                }
                else
                {
                    listBox1.Items.Add("Calling Webservice Failed");
                    listBox1.Items.Add(ex.Message);
                }
            }

        }
        string _services = "";
        private void Form1_Load(object sender, EventArgs e)
        {

            _services =  ConfigurationManager.AppSettings["services"];
            this.Text = _services;

            var period = Convert.ToInt32(ConfigurationManager.AppSettings["period"]);
            System.Timers.Timer theTimer;
            theTimer = new System.Timers.Timer(60000 *period);
            theTimer.Elapsed += PollDelays;
            

            theTimer.Start();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_caspian"]) && _services.Contains("caspian"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_caspian"], "WX CASPIAN");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_varesh"]) && _services.Contains("varesh"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_varesh"], "WX VARESH");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_air"]) && _services.Contains("air"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_air"], "WX AIR");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_chb"]) && _services.Contains("chb"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_chb"], "WX CHB");

               // if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_atlas"]))
               //     CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_atlas"], "WX ATLAS");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_taban"]) && _services.Contains("taban"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_taban"], "WX TABAN");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_ava"]) && _services.Contains("ava"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_ava"], "WX AVA");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_fly"]) && _services.Contains("fly"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_fly"], "WX FLY");

                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_wx_karoon"]) && _services.Contains("karoon"))
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_wx_karoon"], "WX KAROON");



                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_metar"]))
                {
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar"], "METAR CSPN");
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf"], "TAF CSPN");
                    CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam"], "NOTAM CSPN");
                }


                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar_taban"], "METAR TABAN");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf_taban"], "TAF  TABAN");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam_taban"], "NOTAM  TABAN");

              //  if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["url_metar_varesh"]))
              //  {
              //      CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar_varesh"], "METAR VARESH");
              //      CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf_varesh"], "TAF  VARESH");
              //      CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam_varesh"], "NOTAM  VARESH");
              //  }


            }
            catch (Exception ex)
            {

            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            using (WebClient webClient = new WebClient())
            {

                try
                {
                    var prms = new System.Collections.Specialized.NameValueCollection();
                    prms.Add("key", "vahid");
                    prms.Add("plan", "PLAN PLAN PLAN");

                    var result = webClient.UploadValues("https://localhost:44309/api/skyputer", "POST", prms);
                    var str= (new UTF8Encoding()).GetString(result);


                }
                catch (Exception ex)
                {
                     
                }


            }
        }
    }

    public class MyWebClient : WebClient
    {
        protected override WebRequest GetWebRequest(Uri uri)
        {
            WebRequest w = base.GetWebRequest(uri);
            w.Timeout = 20 * 60 * 1000;
            return w;
        }
    }
}
