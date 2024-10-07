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
    public partial class rptRoster : DevExpress.XtraReports.UI.XtraReport
    {
        public rptRoster(string _date, string _rev)
        {
            InitializeComponent();
            if (!string.IsNullOrEmpty(_rev) && Convert.ToInt32(_rev) > 0)
                lblRev.Text = "REVISION " + _rev;


        }
        public bool hasCPT { get; set; }
        public bool hasIP { get; set; }
        public bool hasFO { get; set; }
        public bool hasSAFETY { get; set; }
        public bool hasOBS { get; set; }
        public bool hasOBSC { get; set; }
        public bool hasCHECK { get; set; }
        public bool hasCHECKC { get; set; }
        public bool hasISCCM { get; set; }
        public bool hasSCCM = true;
        public bool hasCCM = true;
        public bool hasFM = false;

        public int sccmMax { get; set; }
        public float cellFontSize = 8.3f;
        public float cellFontSize2 = 8.0f;
        public List<RosterRow> RosterRows { get; set; }

        private void rptRoster_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            var ds = this.DataSource as JsonDataSource;
            // ds.Fill();
            // var xx = new CustomJsonSource();
            var str = ds.JsonSource.GetJsonString();
            dynamic data = JObject.Parse(str);
            DateTime gdate = Convert.ToDateTime(data.date);

            var main = Convert.ToString(data.main);
            RosterRows= JsonConvert.DeserializeObject<List<RosterRow>>(main);
            sccmMax = 1;
            foreach (var row in RosterRows)
            {
                var sccms = string.IsNullOrEmpty(row.SCCM) ? 0 : row.SCCM.Split(',').Length;
                if (sccms > sccmMax)
                    sccmMax = sccms;
            }

            lblDate.Text = Convert.ToString(data.day) + " " + gdate.ToString("yyyy-MM-dd") + " (" + Convert.ToString(data.pdate) + ")";
            hasIP = Convert.ToBoolean(data.hasIP);
            hasCPT = Convert.ToBoolean(data.hasCPT);
            hasFO = Convert.ToBoolean(data.hasFO);
            hasSAFETY = Convert.ToBoolean(data.hasSAFETY);
            hasOBS= Convert.ToBoolean(data.hasOBS);
            hasOBSC = Convert.ToBoolean(data.hasOBSC);
            hasISCCM = Convert.ToBoolean(data.hasISCCM);
            hasCHECK= Convert.ToBoolean(data.hasCHECK);
            hasCHECKC = Convert.ToBoolean(data.hasCHECKC);
            hasFM = Convert.ToBoolean(data.hasFM);
            //var hasCHECK = result.Where(q => !string.IsNullOrEmpty(q.CHECK)).FirstOrDefault() != null;
            //var hasCHECKC = result.Where(q => !string.IsNullOrEmpty(q.CHECKC)).FirstOrDefault() != null;

            //  lblIP.Visible = hasIP;
            // lblIPH.Visible = hasIP;
            // var x=ds.GetEnumerator() ;


        }

        private void Detail1_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {

        }
        
        private void DetailReport_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            table.BeginInit();
            XRTableRow row = table.Rows[0];
            var cockpitCellWidth = 90;
            var fmWidth = 60;
            var cockpitCount = (hasIP ? 1 : 0) + (hasCPT ? 1 : 0) + (hasFO ? 1 : 0)+ (hasSAFETY ? 1 : 0) + (hasOBS ? 1 : 0) + (hasCHECK ? 1 : 0);
            var cockpitWidth = cockpitCount * cockpitCellWidth;
            var isccmWidth = hasISCCM ?  60 : 0;
            var _sccmCell = sccmMax > 1 ? 100 : 120;
            var sccmWidth = hasSCCM ? sccmMax* _sccmCell : 0;
            var obscWidth = hasOBSC ? 80 : 0;
            var checkcWidth = hasCHECKC ? 80 : 0;

            var _w = (this.PageWidth - this.Margins.Left - this.Margins.Right) - fmWidth - (65 * 2 + 45 * 4);
            var ccmWidth = _w - cockpitWidth - isccmWidth - sccmWidth-obscWidth-checkcWidth;
            table.WidthF = this.PageWidth - this.Margins.Left - this.Margins.Right;
            row.Cells[0].WidthF = 65;
            row.Cells[1].WidthF = 65;

            row.Cells[2].WidthF = 45;
            row.Cells[3].WidthF = 45;

            row.Cells[4].WidthF = 45;
            row.Cells[5].WidthF = 45;
            if (hasIP)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.IP");
            }
            if (hasCPT)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.CPT");
            }
            if (hasFO)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.FO");
            }
            if (hasSAFETY)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.SAFETY");
            }
            if (hasCHECK)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.CHECK");
            }
            if (hasOBS)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.OBS");
            }
            if (hasFM)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize2, FontStyle.Regular);
                cell.WidthF = fmWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.FM");
            }
            else
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize2, FontStyle.Regular);
                cell.WidthF = fmWidth;
                row.Cells.Add(cell);
                cell.Text = "";
            }
            if (hasISCCM)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = isccmWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.ISCCM");
            }
            if (hasSCCM)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = sccmWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.SCCM");
            }
            if (hasCCM)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = ccmWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.CCM");
            }
            if (hasCHECKC)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = checkcWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.CHECKC");
            }
            if (hasOBSC)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Regular);
                cell.WidthF = obscWidth;
                row.Cells.Add(cell);
                cell.DataBindings.Add("Text", null, "main.OBSC");
            }
           
            //table.AdjustSize();





            table.EndInit();
        }

        private void Detail_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            var cockpitCellWidth = 90;
            var fmWidth = 60;
            var cockpitCount = (hasIP ? 1 : 0) + (hasCPT ? 1 : 0) + (hasFO ? 1 : 0) + (hasSAFETY ? 1 : 0) + (hasOBS ? 1 : 0) + (hasCHECK ? 1 : 0);  
            var cockpitWidth = cockpitCount * cockpitCellWidth;
            var isccmWidth = hasISCCM ? 60 : 0;
            var _sccmCell = sccmMax > 1 ? 100 : 120;
            var sccmWidth = hasSCCM ? sccmMax * _sccmCell : 0;
            var obscWidth = hasOBSC ?80 : 0;
            var checkcWidth = hasCHECKC ? 80 : 0;

            var _w = (this.PageWidth - this.Margins.Left - this.Margins.Right) - fmWidth - (65 * 2 + 45 * 4);
            var ccmWidth = _w - cockpitWidth - isccmWidth - sccmWidth - obscWidth-checkcWidth;

            //2024-02-05
            tableC.BeginInit();
            tableC.WidthF = this.PageWidth - this.Margins.Left - this.Margins.Right;
            XRTableRow rowC = tableC.Rows[0];
           
           // rowC.Cells[2].WidthF = fmWidth;
            rowC.Cells[0].WidthF = 2 * 65 + 45 * 2 + 45 * 2;
            rowC.Cells[1].WidthF = cockpitWidth;

            tableC.EndInit();




            tableH.BeginInit();
            XRTableRow row = tableH.Rows[0];

            tableH.WidthF = this.PageWidth - this.Margins.Left - this.Margins.Right;
            row.Cells[0].WidthF = 65;
            row.Cells[1].WidthF = 65;

            row.Cells[2].WidthF = 45 * 2;


            row.Cells[3].WidthF = 45;
            row.Cells[4].WidthF = 45;
            if (hasIP)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.Text = "IP";
            }
            if (hasCPT)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.Text = "CPT";
            }
            if (hasFO)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.Text = "FO";
            }
            if (hasSAFETY)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.Text = "SAFETY";
            }
            if (hasCHECK)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = cockpitCellWidth;
                row.Cells.Add(cell);
                cell.Text = "CHECK";
            }
            if (hasOBS)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = cockpitCellWidth ;
                row.Cells.Add(cell);
                cell.Text = "OBS";
            }
            if (hasFM || 1==1)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize2, FontStyle.Bold);
                cell.WidthF = fmWidth;
                row.Cells.Add(cell);
                cell.Text = "F/M";
            }
            if (hasISCCM)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = isccmWidth;
                row.Cells.Add(cell);
                cell.Text = "ISCCM";
            }
            if (hasSCCM)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = sccmWidth;
                row.Cells.Add(cell);
                cell.Text = "SCCM";
            }
            if (hasCCM)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = ccmWidth;
                row.Cells.Add(cell);
                cell.Text = "CCM";
            }
            if (hasCHECKC)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = checkcWidth;
                row.Cells.Add(cell);
                cell.Text = "CHECKC";
            }
            if (hasOBSC)
            {
                XRTableCell cell = new XRTableCell();
                cell.TextTrimming = StringTrimming.None;
                // cell.Font.FontFamily = "Segoe UI";
                //cell.Font.Size = 
                cell.Font = new Font("Segoe UI", cellFontSize, FontStyle.Bold);
                cell.WidthF = obscWidth;
                row.Cells.Add(cell);
                cell.Text = "OBS";
            }
            
            //table.AdjustSize();


            tableH.EndInit();
        }
    }

    public class RosterRow
    {

        public string FlightNumber { get; set; }
        public string Register { get; set; }
        public string FromAirportIATA { get; set; }
        public string ToAirportIATA { get; set; }
        public string DepLocal { get; set; }
        public string ArrLocal { get; set; }
        public string Dep { get; set; }
        public string Arr { get; set; }
        public string IP { get; set; }
        public string CPT { get; set; }
        public string FO { get; set; }
        public string SAFETY { get; set; }
        public string CHECK { get; set; }
        public string OBS { get; set; }
        public string ISCCM { get; set; }
        public string SCCM { get; set; }
        public string CCM { get; set; }
        public string CHECKC { get; set; }
        public string OBSC { get; set; }
        public string FM { get; set; }
        public string POSITIONING { get; set; }
    }
}
