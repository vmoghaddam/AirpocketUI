using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using DevExpress.XtraReports.UI;
using System.Drawing.Printing;

namespace Report
{
    public partial class rptRosterFP : DevExpress.XtraReports.UI.XtraReport
    {
        public rptRosterFP()
        {
            InitializeComponent();
        }
        public XRTable CreateXRTable()
        {
            int cellsInRow = 3;
            int rowsCount = 3;
            float rowHeight = 25f;

            XRTable table = new XRTable();
            table.Borders = DevExpress.XtraPrinting.BorderSide.All;
            table.BeginInit();

            for (int i = 0; i < rowsCount; i++)
            {
                XRTableRow row = new XRTableRow();
                row.HeightF = rowHeight;
                for (int j = 0; j < cellsInRow; j++)
                {
                    XRTableCell cell = new XRTableCell();
                    row.Cells.Add(cell);
                }
                table.Rows.Add(row);
            }

            table.BeforePrint += new PrintEventHandler(table_BeforePrint);
            table.AdjustSize();
            table.EndInit();
            return table;
        }

        // The following code makes the table span to the entire page width.
        void table_BeforePrint(object sender, PrintEventArgs e)
        {
            XRTable table = ((XRTable)sender);
            table.LocationF = new DevExpress.Utils.PointFloat(0F, 0F);
            table.WidthF = this.PageWidth - this.Margins.Left - this.Margins.Right;
        }

        private void rptRosterFP_BeforePrint(object sender, PrintEventArgs e)
        {
            
            //var tbl1 = CreateXRTable();
            //this.Detail.Controls.Add(tbl1);
        }
    }
}
