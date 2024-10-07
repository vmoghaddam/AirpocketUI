using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class JobGroup
    {
        public int Id { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public string FullCode { get; set; }
        public string Remark { get; set; }
        public string Parent { get; set; }
        public string ParentCode { get; set; }
        public string TitleFormated { get; set; }
        public int? TypeId { get; set; }
        public string Type { get; set; }
        public int CustomerId { get; set; }
        public static void Fill(Models.JobGroup entity, ViewModels.JobGroup jobgroup)
        {
            entity.Id = jobgroup.Id;
            entity.ParentId = jobgroup.ParentId;
            entity.Title = jobgroup.Title;
            entity.Code = jobgroup.Code;
            entity.FullCode = jobgroup.FullCode;
            entity.Remark = jobgroup.Remark;
            entity.CustomerId = jobgroup.CustomerId;
        }
        public static void FillDto(Models.JobGroup entity, ViewModels.JobGroup jobgroup)
        {
            jobgroup.Id = entity.Id;
            jobgroup.ParentId = entity.ParentId;
            jobgroup.Title = entity.Title;
            jobgroup.Code = entity.Code;
            jobgroup.FullCode = entity.FullCode;
            jobgroup.Remark = entity.Remark;
            jobgroup.CustomerId = entity.CustomerId;
        }
    }


    public class LibraryFolderDto
    {
        public int Id { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string Title { get; set; }

        public string Remark { get; set; }
        
        public static void Fill(Models.LibraryFolder entity, ViewModels.LibraryFolderDto jobgroup)
        {
            entity.Id = jobgroup.Id;
            entity.ParentId = jobgroup.ParentId;
            entity.Title = jobgroup.Title;
            
            entity.Remark = jobgroup.Remark;
           
        }
        public static void FillDto(Models.LibraryFolder entity, ViewModels.LibraryFolderDto jobgroup)
        {
            jobgroup.Id = entity.Id;
            jobgroup.ParentId = entity.ParentId;
            jobgroup.Title = entity.Title;
            
            jobgroup.Remark = entity.Remark;
            
        }
    }

    public class LibraryChapterDto
    {
        public int Id { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string Title { get; set; }

        public string Remark { get; set; }

        public string BookKey { get; set; }

        public static void Fill(Models.BookChapter entity, ViewModels.LibraryChapterDto jobgroup)
        {
            entity.Id = jobgroup.Id;
            entity.ParentId = jobgroup.ParentId;
            entity.Title = jobgroup.Title;

            entity.Remark = jobgroup.Remark;
            entity.BookKey = jobgroup.BookKey;


        }
        public static void FillDto(Models.BookChapter entity, ViewModels.LibraryChapterDto jobgroup)
        {
            jobgroup.Id = entity.Id;
            jobgroup.ParentId = entity.ParentId;
            jobgroup.Title = entity.Title;

            jobgroup.Remark = entity.Remark;
            jobgroup.BookKey = entity.BookKey;

        }
    }



}