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
    public partial class RptCourseProfileAtlas : DevExpress.XtraReports.UI.XtraReport
    {
        public RptCourseProfileAtlas(string _cid)
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
                            case 6:
                                emp.S06 = "*";// "✓";
                                break;
                            case 7:
                                emp.S07 = "*";// "✓";
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
            List<string> insts = new List<string>();
            if (!string.IsNullOrEmpty(course.Instructor))
                insts.Add(course.Instructor);
            if (!string.IsNullOrEmpty(course.Instructor2))
                insts.Add(course.Instructor2);
            //  cellIns.Text = string.Join(", ", insts);

            lblStart.Text = course.DateStart.ToString("yyyy-MM-dd");
            lblEnd.Text = ((DateTime)course.DateEnd).ToString("yyyy-MM-dd");
            lblDuration.Text = course.Duration + " (hrs)";
            var record = new CourseProfile()
            {
                Title = course.Title,
                TrainingDirector = course.TrainingDirector,
                Instructor = string.Join(", ", insts),
                CourseType = course.CourseType, //course.HoldingType,
                No = course.No,
                Location = course.Location,
                HoldingType = course.HoldingType == "Attendance Class" ? "Attendance" : "Distance Learning",


            };
            cellDir.Text = course.TrainingDirector;

            record.CoursePeople = query;
            record.CourseSessions = sessions;
            record.CourseSessionPresence = atts;
            record.Syllabi = syllabi;
            if (record.Syllabi == null || record.Syllabi.Count == 0)
            {
                record.Syllabi2 = new List<Syllabus>() { new Syllabus() { }, new Syllabus() { }, new Syllabus() { }, new Syllabus() { }, new Syllabus() { }, new Syllabus() { } };
            }
            else
            {
                record.Syllabi2 = new List<Syllabus>();
                foreach (var rec in record.Syllabi)
                {
                    record.Syllabi2.Add(new Syllabus()
                    {
                        Ttitle = rec.Title,
                        Instructor = rec.Instructor,
                        DateStr = rec.SessionStart == null ? "-" : ((DateTime)rec.SessionStart).ToString("yyyy-MM-dd"),
                        HourStr = rec.Duration == null ? "-" : (((int)rec.Duration) / 60).ToString() + ":" + (((int)rec.Duration) % 60).ToString().PadLeft(2, '0'),

                    });
                }
            }

            record.Attendats = ds;



            var sessionsCount = sessions.Count;
            xrTable1.BeginInit();
            xrTable2.BeginInit();

            switch (sessionsCount)
            {
                case 1:
                    cellSe01.Visible = true;
                    cellSe01.Text = ((DateTime)sessions[0].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[0].DateEnd).ToString("HH:mm");

                    s1r1s.Visible = true;



                    xrTable1.Rows[0].DeleteCell(cellSe02);
                    xrTable2.Rows[0].DeleteCell(s2r1s);



                    xrTable1.Rows[0].DeleteCell(cellSe03);
                    xrTable2.Rows[0].DeleteCell(s3r1s);



                    xrTable1.Rows[0].DeleteCell(cellSe04);
                    xrTable2.Rows[0].DeleteCell(s4r1s);




                    xrTable1.Rows[0].DeleteCell(cellSe05);
                    xrTable2.Rows[0].DeleteCell(s5r1s);



                    break;
                case 2:
                    cellSe01.Visible = true;
                    cellSe01.Text = ((DateTime)sessions[0].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[0].DateEnd).ToString("HH:mm");
                    s1r1s.Visible = true;


                    cellSe02.Visible = true;
                    cellSe02.Text = ((DateTime)sessions[1].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[1].DateEnd).ToString("HH:mm");

                    s2r1s.Visible = true;


                    xrTable1.Rows[0].DeleteCell(cellSe03);
                    xrTable2.Rows[0].DeleteCell(s3r1s);




                    xrTable1.Rows[0].DeleteCell(cellSe04);
                    xrTable2.Rows[0].DeleteCell(s4r1s);




                    xrTable1.Rows[0].DeleteCell(cellSe05);
                    xrTable2.Rows[0].DeleteCell(s5r1s);




                    break;
                case 3:
                    cellSe01.Visible = true;
                    cellSe01.Text = ((DateTime)sessions[0].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[0].DateEnd).ToString("HH:mm");

                    s1r1s.Visible = true;


                    cellSe02.Visible = true;
                    cellSe02.Text = ((DateTime)sessions[1].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[1].DateEnd).ToString("HH:mm");

                    s2r1s.Visible = true;


                    cellSe03.Visible = true;
                    cellSe03.Text = ((DateTime)sessions[2].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[2].DateEnd).ToString("HH:mm");

                    s3r1s.Visible = true;



                    xrTable1.Rows[0].DeleteCell(cellSe04);
                    xrTable2.Rows[0].DeleteCell(s4r1s);




                    xrTable1.Rows[0].DeleteCell(cellSe05);
                    xrTable2.Rows[0].DeleteCell(s5r1s);




                    break;
                case 4:
                    cellSe01.Visible = true;
                    cellSe01.Text = ((DateTime)sessions[0].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[0].DateEnd).ToString("HH:mm");

                    s1r1s.Visible = true;

                    cellSe02.Visible = true;
                    cellSe02.Text = ((DateTime)sessions[1].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[1].DateEnd).ToString("HH:mm");

                    s2r1s.Visible = true;


                    cellSe03.Visible = true;
                    cellSe03.Text = ((DateTime)sessions[2].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[2].DateEnd).ToString("HH:mm");

                    s3r1s.Visible = true;


                    cellSe04.Visible = true;
                    cellSe04.Text = ((DateTime)sessions[3].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                     + ((DateTime)sessions[3].DateEnd).ToString("HH:mm");

                    s4r1s.Visible = true;


                    xrTable1.Rows[0].DeleteCell(cellSe05);

                    xrTable2.Rows[0].DeleteCell(s5r1s);







                    break;

                case 5:
                    cellSe01.Text = ((DateTime)sessions[0].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                        + ((DateTime)sessions[0].DateEnd).ToString("HH:mm");

                    cellSe01.Visible = true;

                    s1r1s.Visible = true;


                    cellSe02.Visible = true;
                    cellSe02.Text = ((DateTime)sessions[1].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[1].DateEnd).ToString("HH:mm");

                    s2r1s.Visible = true;


                    cellSe03.Visible = true;
                    cellSe03.Text = ((DateTime)sessions[2].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[2].DateEnd).ToString("HH:mm");

                    s3r1s.Visible = true;


                    cellSe04.Visible = true;
                    cellSe04.Text = ((DateTime)sessions[3].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[3].DateEnd).ToString("HH:mm");

                    s4r1s.Visible = true;


                    cellSe05.Visible = true;
                    cellSe05.Text = ((DateTime)sessions[4].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[4].DateEnd).ToString("HH:mm");

                    s5r1s.Visible = true;


                    break;

                case 6:
                    cellSe01.Text = ((DateTime)sessions[0].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                        + ((DateTime)sessions[0].DateEnd).ToString("HH:mm");

                    cellSe01.Visible = true;

                    s1r1s.Visible = true;


                    cellSe02.Visible = true;
                    cellSe02.Text = ((DateTime)sessions[1].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[1].DateEnd).ToString("HH:mm");

                    s2r1s.Visible = true;


                    cellSe03.Visible = true;
                    cellSe03.Text = ((DateTime)sessions[2].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[2].DateEnd).ToString("HH:mm");

                    s3r1s.Visible = true;


                    cellSe04.Visible = true;
                    cellSe04.Text = ((DateTime)sessions[3].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[3].DateEnd).ToString("HH:mm");

                    s4r1s.Visible = true;


                    cellSe05.Visible = true;
                    cellSe05.Text = ((DateTime)sessions[4].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[4].DateEnd).ToString("HH:mm");

                    s5r1s.Visible = true;

                    cellSe06.Visible = true;
                    cellSe06.Text = ((DateTime)sessions[5].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[5].DateEnd).ToString("HH:mm");

                    s6r1s.Visible = true;


                    break;

                case 7:
                    cellSe01.Text = ((DateTime)sessions[0].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                        + ((DateTime)sessions[0].DateEnd).ToString("HH:mm");

                    cellSe01.Visible = true;

                    s1r1s.Visible = true;


                    cellSe02.Visible = true;
                    cellSe02.Text = ((DateTime)sessions[1].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[1].DateEnd).ToString("HH:mm");

                    s2r1s.Visible = true;


                    cellSe03.Visible = true;
                    cellSe03.Text = ((DateTime)sessions[2].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[2].DateEnd).ToString("HH:mm");

                    s3r1s.Visible = true;


                    cellSe04.Visible = true;
                    cellSe04.Text = ((DateTime)sessions[3].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[3].DateEnd).ToString("HH:mm");

                    s4r1s.Visible = true;


                    cellSe05.Visible = true;
                    cellSe05.Text = ((DateTime)sessions[4].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[4].DateEnd).ToString("HH:mm");

                    s5r1s.Visible = true;

                    cellSe06.Visible = true;
                    cellSe06.Text = ((DateTime)sessions[5].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[5].DateEnd).ToString("HH:mm");

                    s6r1s.Visible = true;

                    cellSe07.Visible = true;
                    cellSe07.Text = ((DateTime)sessions[6].DateStart).ToString("yyyy-MM-dd HH:mm - ")
                       + ((DateTime)sessions[6].DateEnd).ToString("HH:mm");

                    s7r1s.Visible = true;


                    break;
                default:
                    break;
            }
            var _w = this.PageWidth - this.Margins.Left - this.Margins.Right;

            hFullName.WidthF = _w - sessionsCount * 90 - (hNo.WidthF + hNID.WidthF /*+ hDep.WidthF*/ + hResult.WidthF + hSig.WidthF);
            cFullName.WidthF = _w - sessionsCount * 90 - (hNo.WidthF + hNID.WidthF /*+ hDep.WidthF*/ + hResult.WidthF + hSig.WidthF);
            //  xrTableCell46.WidthF = _w - sessionsCount * 90 - (hNo.WidthF + hNID.WidthF + hDep.WidthF + hResult.WidthF + hSig.WidthF);



            xrTable1.EndInit();
            xrTable2.EndInit();


            xrTableSY.EndInit();
            xrTable1.EndInit();






            this.DataSource = new List<CourseProfile> { record };
        }

    }
}
