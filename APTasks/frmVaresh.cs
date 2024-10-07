using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace APTasks
{
    public partial class frmVaresh : Form
    {
        public frmVaresh()
        {
            InitializeComponent();
        }
        System.Timers.Timer theTimer;
        private void button2_Click(object sender, EventArgs e)
        {
            //CheckDelayedFlights();

            var time = Convert.ToInt32(DateTime.Now.ToString("HHmmss"));
            if (  time== 10000 || time==30000 || time == 34500 || time == 41500 || time == 43500 || time == 120000 || time == 180000   || time == 170000
                 || time == 230500
                || time == 70000)
                CheckDelayedFlights();
             else
                 CheckDelayedFlights(time.ToString());




            
            // theTimer = new System.Timers.Timer(1000 * 15);
            theTimer = new System.Timers.Timer(1000 );
            theTimer.Elapsed += SyncNira;


            theTimer.Start();
        }

        private void SyncNira(object sender, EventArgs e)
        {
            try
            {
                var time = Convert.ToInt32(DateTime.Now.ToString("HHmmss"));
                if (  time == 10000 || time == 30000 || time == 34500 || time == 41500 || time == 43500 || time == 120000 || time == 180000   || time==170000
                     || time == 230500
                    || time == 70000)
                    CheckDelayedFlights();
               else
                   CheckDelayedFlights(time.ToString()) ;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }
        int mm = 9;
        int d1 =  16;
        int d2 = 30;
        void runURL(string url)
        {
             
            if (this.listBox1.InvokeRequired)
            {
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(DateTime.Now.ToString()); }));
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(url); }));
            }
            else
            {
                listBox1.Items.Add(DateTime.Now.ToString());
                listBox1.Items.Add(url);
            }


            using (MyWebClient webClient = new MyWebClient())
            {

                try
                {
                    var result = webClient.DownloadString(url);

                    if (this.listBox1.InvokeRequired)
                    {
                        // listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(url); }));
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(result); }));
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("----------------------------------------------"); }));
                    }
                    else
                    {
                        listBox1.Items.Add(url);
                        listBox1.Items.Add(result);
                        listBox1.Items.Add("--------------------------------------------");
                    }
                    d1++;

                }
                catch (Exception ex)
                {
                    listBox1.Items.Add("Calling Webservice Failed");
                    listBox1.Items.Add(ex.Message);
                    listBox1.Items.Add("--------------------------------------------");
                    d1++;
                    theTimer.Stop();
                    theTimer.Start();
                }


            }
        }
        void CheckDelayedFlights(string time="")
        {
            //https://vpi.apchabahar.ir/api/fdp/ext/get/0?from=2022-08-31
            if (d1 > d2)
                return;
            //  string url = "https://vpi.apchabahar.ir/api/fdp/ext/get/0?from="+"2021-"+mm.ToString().PadLeft(2,'0')+"-"+d1.ToString().PadLeft(2,'0');
            // string url = "https://vpi.apchabahar.ir/api/flt/ext/get/1?from=" + "2021-" + mm.ToString().PadLeft(2, '0') + "-" + d1.ToString().PadLeft(2, '0');
            // string url = "https://vpi.apchabahar.ir/api/flt/ext/get/status/0?from=" + "2021-" + mm.ToString().PadLeft(2, '0') + "-" + d1.ToString().PadLeft(2, '0');
            if (!string.IsNullOrEmpty(time))
            {
                if (this.listBox1.InvokeRequired)
                {
                     

                    label1.Invoke(new MethodInvoker(delegate { label1.Text= DateTime.Now.ToString() ; })); 
                }
                else
                {
                    label1.Text = DateTime.Now.ToString();
                }
            }
            else
            {
                runURL("https://wx.skybag.click/api/weather/flightfolder/irimo/");

                runURL("https://wx.skybag.click/api/weather/sigwx/irimo");


                var dt = DateTime.Now.ToString("yyyy-MM-dd");
                // runURL("https://wx.skybag.click/api/weather/sigwx/adds/date/" + dt);

                runURL("https://wx.skybag.click/api/weather/sigwx/charts/");
               // runURL("https://wx.skybag.click/api/weather/sigwx/charts/avmet");

                runURL("https://wx.skybag.click/api/weather/wind/adds/340/-1");

                runURL("https://wx.skybag.click/api/weather/wind/adds/300/-1");

                runURL("https://wx.skybag.click/api/weather/wind/adds/240/-1");

                runURL("https://wx.skybag.click/api/weather/wind/adds/180/-1");
            }
             
            

        }

        private void button1_Click(object sender, EventArgs e)
        {
             CheckDelayedFlights();
            //System.Timers.Timer theTimer;
            //theTimer = new System.Timers.Timer(1000 * 60 * 2.5);
            //theTimer.Elapsed += SyncNira;


            //theTimer.Start();
        }
    }
}
