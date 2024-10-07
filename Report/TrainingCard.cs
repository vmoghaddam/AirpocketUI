using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Report
{
    public class TrainingCard
    {
        public List<TrianingCardCourse> Items { get; set; }
    }

    public class TrianingCardCourse
    {
        public string Title { get; set; }
        public DateTime Date1 { get; set; }
        public DateTime Date2 { get; set; }
        public DateTime Date3 { get; set; }
        public DateTime Date4 { get; set; }
        public DateTime Approved { get; set; }
    }
}