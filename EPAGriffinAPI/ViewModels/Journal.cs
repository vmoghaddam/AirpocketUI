using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class JournalX
    {
        public int Id { get; set; }
        public int TypeId { get; set; }
        public string Title { get; set; }
        public string Remark { get; set; }
        public string Website { get; set; }
        public static void Fill(Models.Journal entity, ViewModels.JournalX journal)
        {
            entity.Id = journal.Id;
            entity.TypeId = journal.TypeId;
            entity.Title = journal.Title;
            entity.Remark = journal.Remark;
            entity.Website = journal.Website;
        }
        public static void FillDto(Models.Journal entity, ViewModels.JournalX journal)
        {
            journal.Id = entity.Id;
            journal.TypeId = entity.TypeId;
            journal.Title = entity.Title;
            journal.Remark = entity.Remark;
            journal.Website = entity.Website;
        }
    }
}