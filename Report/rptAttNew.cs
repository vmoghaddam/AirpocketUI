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
    public partial class rptAttNew : DevExpress.XtraReports.UI.XtraReport
    {
        public rptAttNew(string _cid)
        {
            InitializeComponent();
            int cid = Convert.ToInt32(_cid);
            var context = new ppa_cspnEntities();

            var course = context.ViewCourseNews.Where(q => q.Id == cid).FirstOrDefault();

            var query = context.ViewCoursePeoples.Where(q => q.CourseId == cid).OrderBy(q => q.LastName).ToList();
            var sessions = context.ViewCourseSessions.Where(q => q.CourseId == cid).OrderBy(q => q.DateStart).ToList();
            var atts = context.ViewCourseSessionPresences.Where(q => q.CourseId == cid).ToList();
            var syllabi = context.ViewSyllabus.Where(q => q.CourseId == cid).ToList();
            var ds = (from x in query
                      select new PersonAtt()
                      {
                          FullName = x.Name,
                          NID = x.NID,
                          Result = x.CoursePeopleStatus == "UNKNOWN" ? "" : x.CoursePeopleStatus.Substring(0, 1).ToUpper(),
                          Department = x.EmployeeLocation,
                          PersonId = (int)x.PersonId,

                      }).ToList();
            var c = 1;
            foreach (var emp in ds)
            {
                var empatts = atts.Where(q => q.PersonId == emp.PersonId).ToList();
                int k = 1;
                foreach (var se in sessions)
                {
                    var empse = empatts.FirstOrDefault(q => q.PersonId == emp.PersonId && q.SessionKey == se.Key);
                    if (empse != null && empse.IsPresent == 1)
                    {
                        switch (k)
                        {
                            case 1:
                                emp.S01 = "*";//"✓";
                                break;
                            case 2:
                                emp.S02 = "*";// "✓";
                                break;
                            case 3:
                                emp.S03 = "*";// "✓";
                                break;
                            case 4:
                                emp.S04 = "*";// "✓";
                                break;
                            case 5:
                                emp.S05 = "*";// "✓";
                                break;
                            default:
                                break;
                        }
                    }
                    k++;
                }
                emp.No = c.ToString();
                c++;
            }

            var record = new CourseProfile();
            record.CoursePeople = query;
            record.CourseSessions = sessions;
            record.CourseSessionPresence = atts;
            record.Syllabi = syllabi;
            record.Attendats = ds;


            this.DataSource =new List<CourseProfile> { record };

        }

    }
}
