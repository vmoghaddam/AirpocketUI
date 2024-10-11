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

namespace APTasks
{
    public partial class frmNira : Form
    {
        public frmNira()
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

            string url = textBox1.Text;
            using (MyWebClient webClient = new MyWebClient())
            {
                 
                try
                {
                    var result = webClient.DownloadString(url);
                    if (this.listBox1.InvokeRequired)
                    {
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(url); }));
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add(result); }));
                        listBox1.Invoke(new MethodInvoker(delegate { listBox1.Items.Add("----------------------------------------------"); }));
                    }
                    else
                    {
                        listBox1.Items.Add(url);
                        listBox1.Items.Add(result);
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
        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                CheckDelayedFlights();
            }
            catch (Exception ex)
            {

            }
        }
        private void SyncNira(object sender, EventArgs e)
        {
            try
            {
                CheckDelayedFlights();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }
        private void frmNira_Load(object sender, EventArgs e)
        {
            
        }

        private void button2_Click(object sender, EventArgs e)
        {
            System.Timers.Timer theTimer;
            theTimer = new System.Timers.Timer(1000 * 60 * 15);
            theTimer.Elapsed += SyncNira;
             

            theTimer.Start();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            const string sPath = "save.txt";

            System.IO.StreamWriter SaveFile = new System.IO.StreamWriter(sPath);
            foreach (var item in listBox1.Items)
            {
                SaveFile.WriteLine(item);
            }

            SaveFile.Close();

            MessageBox.Show("Programs saved!");
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
