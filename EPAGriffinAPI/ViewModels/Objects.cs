using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class  Dto
    {
        public int Id { get; set; }
    }
    public class OldNewPair
    {
        public int OldId { get; set; }
        public int NewId { get; set; }
    }

    public class resource
    {
        public int resourceId { get; set; }
        public string resourceName { get; set; }
        public int? groupId { get; set; }

        public string registers { get; set; }

        public bool assigned { get; set; }
        public DateTime? DutyEndLocal { get; set; }
        public DateTime? DutyStartLocal { get; set; }
    }
}