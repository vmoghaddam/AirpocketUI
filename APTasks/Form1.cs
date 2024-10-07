using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Configuration;
using System.Net;

namespace APTasks
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            listBox1.Items.Clear();
        }

        void CheckDelayedFlights()
        {
            

            if (this.listBox1.InvokeRequired)
            {
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(DateTime.Now.ToString()); }));
            }
            else
            {
                listBox1.Items.Add(DateTime.Now.ToString());
            }

            string url = ConfigurationManager.AppSettings["url_delay"];
            using (WebClient webClient = new WebClient())
            {
                try
                {
                    var result = webClient.DownloadString(url);
                    if (this.listBox1.InvokeRequired)
                    {
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(result); }));
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("----------------------------------------------"); }));
                    }
                    else
                    {
                        listBox1.Items.Add(result);
                        listBox1.Items.Add("--------------------------------------------");
                    }
                }
                catch(Exception ex)
                {
                    listBox1.Items.Add("Calling Webservice Failed");
                    listBox1.Items.Add("--------------------------------------------");
                }
                

            }

        }

        private void button1_Click(object sender, EventArgs e)
        {
            CheckDelayedFlights();
        }
        private void PollDelays(object sender, EventArgs e)
        {
            try
            {
                CheckDelayedFlights();
            }
            catch(Exception ex)
            {

            }
           
        }
        void vareshflts()
        {


            if (this.listBox1.InvokeRequired)
            {
                listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(DateTime.Now.ToString()); }));
            }
            else
            {
                listBox1.Items.Add(DateTime.Now.ToString());
            }
            var dt = DateTime.Now.ToString("yyyy-MM-dd");
            string url = "https://xpi.sbvaresh.ir/api/flt/ext/get/0?from="+ dt;
            using (WebClient webClient = new WebClient())
            {
                try
                {
                    var result = webClient.DownloadString(url);
                    if (this.listBox1.InvokeRequired)
                    {
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(result); }));
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("----------------------------------------------"); }));
                    }
                    else
                    {
                        listBox1.Items.Add(result);
                        listBox1.Items.Add("--------------------------------------------");
                    }
                }
                catch (Exception ex)
                {
                    listBox1.Items.Add("Calling Webservice Failed");
                    listBox1.Items.Add("--------------------------------------------");
                }


            }

        }
        private void SyncVareshFlights(object sender, EventArgs e)
        {
            try
            {
                vareshflts();
            }
            catch (Exception ex)
            {

            }

        }
        private void Form1_Load(object sender, EventArgs e)
        {
            System.Timers.Timer theTimer;
            theTimer = new System.Timers.Timer(30000*1);
            theTimer.Elapsed += SyncVareshFlights;
            
            theTimer.Start();
        }
    }
}
