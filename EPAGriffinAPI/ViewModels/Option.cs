using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class Option
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public Nullable<int> ParentId { get; set; }
        public Nullable<bool> IsSystem { get; set; }
        public Nullable<int> OrderIndex { get; set; }
        public string Parent { get; set; }
        public Nullable<int> CreatorId { get; set; }
    }
}