using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Collections.Generic;
using System.Linq;

namespace Report
{
    public partial class rptLogA : DevExpress.XtraReports.UI.XtraReport
    {
        
        public rptLogA(int cid)
        {
            InitializeComponent();
            ppa_cspnEntities ctx = new ppa_cspnEntities();
            var ds = from x in ctx.ViewLogBook18
                     where x.CrewId==cid
                     orderby x.Date,x.OffBlock
                     select x;
            
            this.DataSource = ds.ToList();
            

        }

        private void lblCur_AfterPrint(object sender, EventArgs e)
        {
            
        }

        private void lblCur_BeforePrint(object sender, CancelEventArgs e)
        {
        
        }

        private void lblCur_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
           // var lbl = sender as XRLabel;
           

        }
        public int blSum = 0;
        public int blCur = 0;

        public string formatMinutes(int? mm)
        {
            if (mm == null)
                return ":";
            if (mm == 0)
                return ":";
            var str= (mm / 60).ToString().PadLeft(2, '0') + ":" + (mm % 60).ToString().PadLeft(2, '0');
            if (str == "00:00")
                str = ":";
            if (str.Replace(" ","") == ":")
                str = ":";
            return str;
        }
        private void lblCur_SummaryCalculated(object sender, TextFormatEventArgs e)
        {
            //lblAll.Text = e.Text;
           
           // blSum = blSum + Convert.ToInt32(e.Value);
            //blCur = Convert.ToInt32(e.Value);

            e.Text = formatMinutes(Convert.ToInt32(e.Value));
            
            

        }

        private void lblPre_BeforePrint(object sender, CancelEventArgs e)
        {
            // (sender as XRLabel).Text = formatMinutes(blSum);
          
        }

        private void lblAll_BeforePrint(object sender, CancelEventArgs e)
        {
            // var x = this.GetCurrentRow();
           
             
            
        }

        private void lblAll_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            
          
        }

        private void lblAll_PrintOnPage_1(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text =formatMinutes( rows.Sum(q => q.BlockTime)+0*60+(init_total_time));
        }

        private void lblPre_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2  ) * 18).ToList();
            (sender as XRLabel).Text =formatMinutes( rows.Sum(q => q.BlockTime) + (init_total_time));
        }

        private void xrTableCell46_BeforePrint(object sender, CancelEventArgs e)
        {
            
        }

        private void xrTableCell46_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.MultiPilotTime)+ initMulti);
        }

        private void xrTableCell49_BeforePrint(object sender, CancelEventArgs e)
        {

        }

        private void xrTableCell49_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.MultiPilotTime)+ initMulti);
        }

        private void xrTableCell72_SummaryCalculated(object sender, TextFormatEventArgs e)
        {
            e.Text = formatMinutes(Convert.ToInt32(e.Value));
        }

        private void  SummaryCalculated(object sender, TextFormatEventArgs e)
        {
            e.Text = formatMinutes(Convert.ToInt32(e.Value));
        }

        //
        private void xrTableCell47_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text =  (rows.Sum(q => q.DayTakeOff!=null? q.DayTakeOff:0)+takeoff_day).ToString();
        }

        private void xrTableCell62_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = (rows.Sum(q => q.NightTakeOff != null ? q.NightTakeOff : 0)+takeoff_night).ToString();
        }

        private void xrTableCell65_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = (rows.Sum(q => q.DayLanding != null ? q.DayLanding : 0)+landing_day).ToString();
        }

        private void xrTableCell68_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = (rows.Sum(q => q.NightLanding != null ? q.NightLanding : 0)+landing_night).ToString();
        }

        private void xrTableCell73_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.NightTime)+ initNight);
        }

        private void xrTableCell78_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.IFRTime)+ initIFR);
        }

        private void xrTableCell83_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.PICTime)+initPIC);
        }

        private void xrTableCell88_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.COPILOTTime)+ initCoPilot);
        }
        /// ITS TRUE
        //int initMulti = 0; //10158*60+5;//91 * 60 + 20;   
        //int single_time = 0; //62*60; // 61 * 60;
        //int init_total_time = 0; //10223*60+5; // 152 * 60 + 20;  //multi + single;
        //int initIFR = 0; //10072*60+5; // 20 * 60 + 40; 
        //int initPIC = 0; //6565*60+30; // 9 * 60 + 30; 
        //int initDual = 0; //299*60+20; // 81 * 60 + 50;



        //int takeoff_day = 0;
        //int takeoff_night = 0;
        //int landing_day = 0;
        //int landing_night = 0;

        //int init_ip = 0; //2017*60+33;



        //int initNight = 0; // 3500 * 60 + 57;  


        //int initCoPilot = 0; // 3296 * 60 + 15;  
        ////////

        //NOV
        int initMulti =  91 * 60 + 20;   
        int single_time =   61 * 60;
        int init_total_time =   152 * 60 + 20;  //multi + single;
        int initIFR =   20 * 60 + 40; 
        int initPIC =   9 * 60 + 30; 
        int initDual =  81 * 60 + 50;



        int takeoff_day = 0;
        int takeoff_night = 0;
        int landing_day = 0;
        int landing_night = 0;

        int init_ip = 0; //2017*60+33;



        int initNight = 0; // 3500 * 60 + 57;  


        int initCoPilot = 0; // 3296 * 60 + 15;  
        //


        private void xrTableCell93_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.DUALTime)+initDual);
        }

        private void xrTableCell98_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex/2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.IPTime)+init_ip);
        }

        private void xrTableCell74_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.NightTime)+ initNight);
        }

        private void xrTableCell79_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.IFRTime)+ initIFR);
        }

        private void xrTableCell84_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.PICTime)+initPIC);
        }

        private void xrTableCell89_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.COPILOTTime)+ initCoPilot);
        }

        private void xrTableCell94_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.DUALTime)+initDual);
        }

        private void xrTableCell99_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(rows.Sum(q => q.IPTime)+init_ip);
        }

        private void xrTableCell50_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex/2) + 1) * 18).ToList();
            (sender as XRLabel).Text =  (rows.Sum(q => q.DayTakeOff)+takeoff_day).ToString();
        }

        private void xrTableCell63_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex/2) + 1) * 18).ToList();
            (sender as XRLabel).Text = (rows.Sum(q => q.NightTakeOff)+takeoff_night).ToString();
        }

        private void xrTableCell66_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = (rows.Sum(q => q.DayLanding)+landing_day).ToString();
        }

        private void xrTableCell69_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = (rows.Sum(q => q.NightLanding)+landing_night).ToString();
        }

        private void xrTableCell43_SummaryCalculated(object sender, TextFormatEventArgs e)
        {
            e.Text = formatMinutes(Convert.ToInt32(e.Value));
        }

        private void xrTableCell42_BeforePrint(object sender, CancelEventArgs e)
        {
            
        }

        private void xrTableCell71_BeforePrint(object sender, CancelEventArgs e)
        {
            var text = (sender as XRLabel).Text;
            if (string.IsNullOrEmpty(text))
                (sender as XRLabel).Text = ":";
            else
                (sender as XRLabel).Text = formatMinutes(Convert.ToInt32((sender as XRLabel).Text));
        }

        private void xrTableCell56_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take((e.PageIndex / 2) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(0 + single_time);
        }

        private void xrTableCell4_BeforePrint(object sender, CancelEventArgs e)
        {

        }

        private void xrTableCell57_PrintOnPage(object sender, PrintOnPageEventArgs e)
        {
            var ds = this.DataSource as List<ViewLogBook18>;
            var rows = ds.Take(((e.PageIndex / 2) + 1) * 18).ToList();
            (sender as XRLabel).Text = formatMinutes(0 + single_time);
        }
    }
}
