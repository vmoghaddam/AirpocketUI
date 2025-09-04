using DevExpress.XtraReports.UI;
using System;
using System.Collections;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using Newtonsoft;

using System.Text.Json;

namespace Report
{
    public partial class rptTest : DevExpress.XtraReports.UI.XtraReport
    {
        public rptTest(string _id)
        {
            InitializeComponent();

            int id = Convert.ToInt32(_id);
            using (var context = new ppa_cspnEntities())
            {
                var ds = context.ViewQAGrounds
                                .Where(q => q.Id == id)
                                .ToList();

                this.DataSource = ds; 
            }
        }

    }
}
