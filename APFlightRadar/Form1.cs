using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace APFlightRadar
{
    public partial class Form1 : Form
    {
        List<string> airlines = new List<string>() {/*"VRH" ,"CPN","IRM","KIS","KRU"*/"AXV","VRH"  };
        public Form1()
        {
            InitializeComponent();
            listBox1.Items.Clear();
        }

        void CheckDelayedFlights(string url, string title)
        {

            try
            {
                if (this.listBox1.InvokeRequired)
                {
                    listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(title + "    " + DateTime.Now.ToString()); }));
                    // listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(title); }));
                }
                else
                {
                    listBox1.Items.Add(title + "    " + DateTime.Now.ToString());
                    // listBox1.Items.Add(title);
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
            catch(Exception exxxx)
            {

            }
            



        }
        private void PollDelays(object sender, EventArgs e)
        {
            try
            {

                foreach (var x in airlines)
                    CheckDelayedFlights("https://localhost:44353/api/fr/live/flights/track/1/"+x, x);

              
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


        private void PollDelays2( )
        {
            try
            {

                foreach (var x in airlines)
                    CheckDelayedFlights("https://main.apimap.airpocket.app/api/fr/live/flights/track/1/" + x, x);

               System.Threading.Thread.Sleep(5000 );
                PollDelays2();
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
                PollDelays2();
            }

        }


        private void GetData(string airline)
        {
            try
            {

                 
                CheckDelayedFlights("https://main.apimap.airpocket.app/api/fr/live/flights/track/1/" + airline,airline);
                
                Thread.Sleep(500);
                GetData(airline);
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
                PollDelays2();
            }

        }



        private void Form1_Load(object sender, EventArgs e)
        {
            //var period = Convert.ToInt32(ConfigurationManager.AppSettings["period"]);
            //System.Timers.Timer theTimer;
            //theTimer = new System.Timers.Timer(1000 * period);
            //theTimer.Elapsed += PollDelays;


            //theTimer.Start();

           
        }

        private void button1_Click(object sender, EventArgs e)
        {

           
                new Thread(() =>
                {
                    Thread.CurrentThread.IsBackground = true;
                    // GetData(x);
                    PollDelays2();
                }).Start();
            
           
            
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
                    var str = (new UTF8Encoding()).GetString(result);


                }
                catch (Exception ex)
                {

                }


            }
        }
    }
}
