using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace APTRN
{
    public partial class Form1 : Form
    {
        public List<crew> Crews { get; set; }
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
        void getCrew()
        {
            if (this.listBox1.InvokeRequired)
            {
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(DateTime.Now.ToString()); }));
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("GET CREW"); }));
            }
            else
            {
                listBox1.Items.Add(DateTime.Now.ToString());
                listBox1.Items.Add("GET CREW");
            }

            // string url = ConfigurationManager.AppSettings["url_metar"];
            using (WebClient webClient = new WebClient())
            {

                try
                {
                    var result = webClient.DownloadString("https://fleet.caspianairlines.com/api/odata/employees/light/crew/4?$filter=(InActive eq false) and (JobGroupRoot eq 'Cabin')&$select=NID");
                    Crews = JsonConvert.DeserializeObject<List<crew>>(result);
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

        void UpdateDuties()
        {
            //https://fleet.caspianairlines.com/xlsapi/api/idea/airpocket/duties/update/1000/0016376226/vahid/Chico1359
            foreach (var c in Crews)
            {
                if (this.listBox1.InvokeRequired)
                {
                    listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(DateTime.Now.ToString()); }));
                    listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("update "+c.NID); }));
                }
                else
                {
                    listBox1.Items.Add(DateTime.Now.ToString());
                    listBox1.Items.Add("update " + c.NID);
                }

                // string url = ConfigurationManager.AppSettings["url_metar"];
                using (MyWebClient webClient = new MyWebClient())
                {

                    try
                    {
                         
                          var result = webClient.DownloadString("https://fleet.caspianairlines.com/xlsapi/api/idea/airpocket/duties/update/1000/"+c.NID+"/vahid/Chico1359");
                        //Crews = JsonConvert.DeserializeObject<List<crew>>(result);
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
        }
        private void PollDelays(object sender, EventArgs e)
        {
            try
            {
                getCrew();
              
                //CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar"], "METAR");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf"], "TAF");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam"], "NOTAM");
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
        void DoTRN()
        {
            try
            {
                getCrew();
                UpdateDuties();
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_metar"], "METAR");
                // CheckDelayedFlights(ConfigurationManager.AppSettings["url_taf"], "TAF");
                //  CheckDelayedFlights(ConfigurationManager.AppSettings["url_notam"], "NOTAM");
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
        private void Form1_Load(object sender, EventArgs e)
        {

            //System.Timers.Timer theTimer;
            //theTimer = new System.Timers.Timer(60000 * 8);
            //theTimer.Elapsed += PollDelays;


            //theTimer.Start();
        }

        private void button1_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click_1(object sender, EventArgs e)
        {
            DoTRN();
        }
    }

    public class crew { 
      public string NID { get; set; }
    }
    public  class MyWebClient : WebClient
    {
        protected override WebRequest GetWebRequest(Uri uri)
        {
            WebRequest w = base.GetWebRequest(uri);
            w.Timeout = 20 * 60 * 1000;
            return w;
        }
    }
}
