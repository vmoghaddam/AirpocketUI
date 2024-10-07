using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class Document
    {
        public int Id { get; set; }
        public int? DocumentTypeId { get; set; }
        public int? FileTypeId { get; set; }
        public string FileUrl { get; set; }
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public string SysUrl { get; set; }
        public string FileType { get; set; }
        public static void Fill(Models.Document entity, ViewModels.Document document)
        {
            entity.Id = document.Id;
            entity.DocumentTypeId = document.DocumentTypeId;
            entity.FileTypeId = document.FileTypeId;
            entity.FileUrl = document.FileUrl;
            entity.Title = document.Title;
            entity.ParentId = document.ParentId;
            entity.SysUrl = document.SysUrl;
            entity.FileType = document.FileType;
        }
        public static void FillDto(Models.Document entity, ViewModels.Document document)
        {
            document.Id = entity.Id;
            document.DocumentTypeId = entity.DocumentTypeId;
            document.FileTypeId = entity.FileTypeId;
            document.FileUrl = entity.FileUrl;
            document.Title = entity.Title;
            document.ParentId = entity.ParentId;
            document.SysUrl = entity.SysUrl;
            document.FileType = entity.FileType;
        }
        public static ViewModels.Document GetDto(Models.Document entity)
        {
            var result = new ViewModels.Document();
            FillDto(entity, result);
            return result;
        }
        public static List<ViewModels.Document> GetDtos(List<Models.Document> entities)
        {
            var result = new List<ViewModels.Document>();
            foreach (var x in entities)
                result.Add(GetDto(x));
            return result;

        }
    }
}