using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;
using EPAGriffinAPI.ViewModels;

namespace EPAGriffinAPI.DAL
{
    public class JobgroupRepository : GenericRepository<Models.JobGroup>
    {
        public JobgroupRepository(EPAGRIFFINEntities context)
      : base(context)
        {
        }

        public IQueryable<ViewJobGroup> GetViewJobGroup()
        {
            return this.GetQuery<ViewJobGroup>();
        }
         

        
        public virtual CustomActionResult Validate(ViewModels.JobGroup dto)
        {
            //var exist = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.CustomerId==dto.CustomerId && q.Title.ToLower().Trim() == dto.Title.ToLower().Trim());
            // if (exist != null)
            //     return Exceptions.getDuplicateException("JobGroup-01", "Title");
            // var fullcode= dbSet.FirstOrDefault(q => q.Id != dto.Id && q.CustomerId == dto.CustomerId && q.FullCode == dto.FullCode);
            //if (fullcode != null)
            //    return Exceptions.getDuplicateException("JobGroup-02", "FullCode");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.JobGroup entity)
        {
            
                var employees = this.context.PersonCustomers.Count(q => q.GroupId == entity.Id);
                if (employees > 0)
                    return Exceptions.getCanNotDeleteException("JobGroup-03:Employees found");

            var children = this.context.JobGroups.Count(q => q.ParentId == entity.Id);
            if (children > 0)
                return Exceptions.getCanNotDeleteException("JobGroup-04:Children found");
            var books = this.context.BookRelatedGroups.Count(q => q.GroupId == entity.Id);
            if (books > 0)
                return Exceptions.getCanNotDeleteException("JobGroup-03:Library item found");
            var courses = this.context.CourseRelatedGroups.Count(q => q.GroupId == entity.Id);
            if (courses > 0)
                return Exceptions.getCanNotDeleteException("JobGroup-03:Course found");
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual void UpdateChildren(Models.JobGroup entity, string fullcode)
        {
            var children = dbSet.Where(q => q.ParentId == entity.Id).ToList();
            foreach (var x in children)
            {

                x.FullCode = fullcode + x.Code;
                UpdateChildren(x, x.FullCode);
            }

        }
    }

    public class LibraryFolderRepository : GenericRepository<Models.LibraryFolder>
    {
        public LibraryFolderRepository(EPAGRIFFINEntities context)
      : base(context)
        {
        }

        public IQueryable<ViewLibraryFolder> GetViewLibraryFolder()
        {
            return this.GetQuery<ViewLibraryFolder>();
        }



        public virtual CustomActionResult Validate(ViewModels.LibraryFolderDto dto)
        {
            var title = dto.Title.ToLower();
            var name =   this.context.LibraryFolders.FirstOrDefault (q => q.Id != dto.Id && q.ParentId == dto.ParentId && q.Title.ToLower() == title);
            if (name!=null)
                return Exceptions.getDuplicateException("Folder-01", "Title");
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.LibraryFolder entity)
        {

          

            var children = this.context.LibraryFolders.Count(q => q.ParentId == entity.Id);
            if (children > 0)
                return Exceptions.getCanNotDeleteException("JobGroup-04:Children found");
            var books = this.context.Books.Count(q => q.FolderId == entity.Id);
            if (books > 0)
                return Exceptions.getCanNotDeleteException("JobGroup-03:Library item(s) found");
           
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        
    }


    public class BookChapterRepository : GenericRepository<Models.BookChapter>
    {
        public BookChapterRepository(EPAGRIFFINEntities context)
      : base(context)
        {
        }

        public IQueryable<BookChapter> GetBookChapters()
        {
            return this.GetQuery<BookChapter>();
        }

        public IQueryable<ViewBookChapter> GetViewBookChapters()
        {
            return this.GetQuery<ViewBookChapter>();
        }



        public virtual CustomActionResult Validate(ViewModels.LibraryChapterDto dto)
        {
            var title = dto.Title.ToLower();
            var name = this.context.LibraryFolders.FirstOrDefault(q => q.Id != dto.Id && q.ParentId == dto.ParentId && q.Title.ToLower() == title);
            if (name != null)
                return Exceptions.getDuplicateException("chapter-01", "Title");
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.BookChapter entity)
        {



             var children = this.context.BookChapters.Count(q => q.ParentId == entity.Id);
             if (children > 0)
                return Exceptions.getCanNotDeleteException("Chapter-04:Children found");
            var books = this.context.BookFiles.Count(q => q.ChapterId == entity.Id);
            if (books > 0)
                return Exceptions.getCanNotDeleteException("Chapter-03:Book(s) found");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }


    }
}