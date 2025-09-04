using DevExpress.Data.ODataLinq.Helpers;
using DevExpress.XtraReports.UI;
using System;
using System.Collections;
using System.ComponentModel;
using System.Data.Entity;
using System.Drawing;
using System.Security.Cryptography;
using System.Linq;

namespace Report
{
    public partial class rptHazard : DevExpress.XtraReports.UI.XtraReport
    {
        public rptHazard(string _id)
        {
            InitializeComponent();

            int id = Convert.ToInt32(_id);
            using (var context = new ppa_cspnEntities())
            {
                var ds = context.ViewQAHazards
                                .Where(q => q.Id == id)
                                .ToList();

                this.DataSource = ds;
            }
        }

    }
}
