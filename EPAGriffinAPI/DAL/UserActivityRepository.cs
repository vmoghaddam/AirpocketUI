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
    public class UserActivityRepository : GenericRepository<Models.UserActivity>
    {
        public UserActivityRepository(EPAGRIFFINEntities context)
      : base(context)
        {
        }

        public IQueryable<ViewUserActivity> GetViewUserActivity()
        {
            return this.GetQuery<ViewUserActivity>();
        }
        public IQueryable<UserActivityMenuHit> GetUserActivityMenuHit()
        {
            return this.GetQuery<UserActivityMenuHit>();
        }
        public virtual void Insert(UserActivityMenuHit entity)
        {
            this.context.UserActivityMenuHits.Add(entity);
        }

        public  async Task<UserActivityMenuHit> GetMenuHitsByDto(UserActivityX dto)
        {
            return await this.context.UserActivityMenuHits.FirstOrDefaultAsync(q => q.UserId == dto.UserId && q.CustomerId == dto.CustomerId && q.ModuleId == dto.ModuleId && q.Key == dto.Key);
        }

        public async Task<EmployeeBookStatu> VisitLibraryItem(int employeeId,int itemId)
        {
            var status = await this.context.EmployeeBookStatus.FirstOrDefaultAsync(q => q.EmployeeId == employeeId && q.BookId == itemId);
            if (status == null)
            {
                status = new EmployeeBookStatu()
                {
                    BookId = itemId,
                    DateVisit = DateTime.Now,
                    EmployeeId = employeeId,
                    IsVisited = true,
                    IsDownloaded = false

                };
                this.context.EmployeeBookStatus.Add(status);
            }
            if (!status.IsVisited)
            {
                status.IsVisited = true;
                status.DateVisit = DateTime.Now;
            }
            return status;
           // return await this.context.UserActivityMenuHits.FirstOrDefaultAsync(q => q.UserId == dto.UserId && q.CustomerId == dto.CustomerId && q.ModuleId == dto.ModuleId && q.Key == dto.Key);
        }

        public async Task<object> VisitBookFlie(int employeeId, int bookfileId)
        {
            var status = await this.context.BookFileVisits.Where(q => q.EmployeeId == employeeId && q.BookFileId == bookfileId).FirstOrDefaultAsync();
            if (status == null)
            {
                status = new BookFileVisit()
                {
                    EmployeeId=employeeId,
                    BookFileId=bookfileId,
                     DateVisited=DateTime.Now,
                    
                };
                
                this.context.BookFileVisits.Add(status);
            }
            
            return true;
            // return await this.context.UserActivityMenuHits.FirstOrDefaultAsync(q => q.UserId == dto.UserId && q.CustomerId == dto.CustomerId && q.ModuleId == dto.ModuleId && q.Key == dto.Key);
        }

        public async Task<object> SignBook(int employeeId, int bookId,string code)
        {
            var employee = await this.context.ViewEmployeeSimples.Where(q => q.Id == employeeId).FirstOrDefaultAsync();
            if (string.IsNullOrEmpty(employee.NID))
                return null;
            if (!employee.NID.EndsWith(code) && code!="atrina")
                return null;
            //if (employee.NID.EndsWith)
            var status = await this.context.BookSigneds.Where(q => q.EmployeeId == employeeId && q.BookId == bookId).FirstOrDefaultAsync();
            if (status == null)
            {
                status = new BookSigned()
                {
                    EmployeeId = employeeId,
                    BookId = bookId,
                    DateSigned = DateTime.Now,

                };

                this.context.BookSigneds.Add(status);
            }

            return status;
            // return await this.context.UserActivityMenuHits.FirstOrDefaultAsync(q => q.UserId == dto.UserId && q.CustomerId == dto.CustomerId && q.ModuleId == dto.ModuleId && q.Key == dto.Key);
        }


        public async Task<EmployeeBookStatu> DownloadLibraryItem(int employeeId, int itemId)
        {
            var status = await this.context.EmployeeBookStatus.FirstOrDefaultAsync(q => q.EmployeeId == employeeId && q.BookId == itemId);
            if (status == null)
            {
                status = new EmployeeBookStatu()
                {
                    BookId = itemId,
                    DateVisit = DateTime.Now,
                    EmployeeId = employeeId,
                    IsVisited = true,
                    IsDownloaded = true,
                    DateDownload=DateTime.Now,

                };
                this.context.EmployeeBookStatus.Add(status);
            }
            if (!status.IsVisited)
            {
                status.IsVisited = true;
                status.DateVisit = DateTime.Now;
            }
            if (!status.IsDownloaded)
            {
                status.IsDownloaded = true;
                status.DateDownload = DateTime.Now;
            }
            return status;
            // return await this.context.UserActivityMenuHits.FirstOrDefaultAsync(q => q.UserId == dto.UserId && q.CustomerId == dto.CustomerId && q.ModuleId == dto.ModuleId && q.Key == dto.Key);
        }

        public virtual CustomActionResult Validate(ViewModels.UserActivityX dto)
        {
            //var exist = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.Title.ToLower().Trim() == dto.Title.ToLower().Trim());
            //if (exist != null)
            //    return Exceptions.getDuplicateException("Organization-01", "Title");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }
    }
}