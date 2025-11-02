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
using System.Threading;
using System.Configuration;

namespace EPAGriffinAPI.DAL
{
    public class BookRepository : GenericRepository<Models.Book>
    {
        public BookRepository(EPAGRIFFINEntities context)
        : base(context)
        {
        }
        public IQueryable<ViewBook> GetViewBooks()
        {
            return this.GetQuery<ViewBook>();
        }

        public IQueryable<ViewBookApplicableEmployeeAb> GetViewBookApplicableEmployeeAb()
        {
            return this.GetQuery<ViewBookApplicableEmployeeAb>();
        }

        public IQueryable<ViewBookApplicableEmployee> GetViewBookApplicableEmployee()
        {
            return this.GetQuery<ViewBookApplicableEmployee>();
        }
        public virtual CustomActionResult CanDelete(Models.Book entity)
        {

            //var course = this.context.ViewCourses.Where(q => q.CourseTypeId == entity.Id).Count();
            //if (course > 0)
            //    return Exceptions.getCanNotDeleteException("CourseType-02-Courses found");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult Validate(ViewModels.Book dto)
        {
            //var c = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.DateStart == dto.DateStart && q.CourseTypeId == dto.CourseTypeId && q.OrganizationId == dto.OrganizationId);
            // if (c != null)
            //    return Exceptions.getDuplicateException("Course-01", "Type-Organization-DateStart");


            return new CustomActionResult(HttpStatusCode.OK, "");
        }
        public IQueryable<string> GetKeywords()
        {
            var bookKeyWords = this.context.BookKeywords.Select(q => q.Value.ToLower()).Distinct().ToList();
            return bookKeyWords.AsQueryable();
        }
        public BookDto GetBookFileUrls(int id)
        {
            var bookKeyWords = this.context.ViewBookFiles.Where(q => q.BookId == id).Select(q => new { url = q.FileUrl, title = q.Title }).ToList();
            var result = new BookDto();
            if (bookKeyWords.Count > 0)
            {
                result.Title = bookKeyWords.First().title;
                result.Files = bookKeyWords.Select(q => q.url).ToList();
            }
            return result;
        }

        public BookDto GetBookFileUrl(int id)
        {
            var bookKeyWords = this.context.ViewBookFiles.Where(q => q.Id == id).Select(q => new { url = q.FileUrl, title = q.Title }).ToList();
            var result = new BookDto();
            if (bookKeyWords.Count > 0)
            {
                result.Title = bookKeyWords.First().title;
                result.Files = bookKeyWords.Select(q => q.url).ToList();
            }
            return result;
        }
        public async Task<object> GetBookFiles(int id)
        {
            var dbbookfiles = await this.context.ViewBookFiles.Where(q => q.BookId == id).ToListAsync();
            return dbbookfiles;
        }
        public async Task<object> GetBookFiles(List<int> ids, int eid)
        {
            var dbbookfiles = await this.context.ViewBookFileVisiteds.Where(q => q.EmployeeId == eid && ids.Contains(q.BookId)).ToListAsync();
            return dbbookfiles;
        }
        public async Task<object> GetBookChapters(List<int> ids)
        {
            var _ids = ids.Select(q => (Nullable<int>)q).ToList();
            var dbchapters = await this.context.ViewBookChapters.Where(q => _ids.Contains(q.BookId)).ToListAsync();
            return dbchapters;
        }
        string getTypeByTypeId(int? typeId)
        {
            if (typeId == null)
                return "";
            switch (typeId)
            {
                case -1:
                    return "";
                case 1:
                    return "B737";
                case 2:
                    return "MD";
                default:
                    return "";
            }
        }
        public async Task<ViewModels.Book> GetBookDto(int id)
        {
            var book = new ViewModels.Book();
            var dbbook = await context.Books.FirstOrDefaultAsync(q => q.Id == id);
            ViewModels.Book.FillDto(dbbook, book);
            var dbbookfiles = await this.context.ViewBookFiles.Where(q => q.BookId == id).ToListAsync();
            book.BookFiles = new List<ViewBookFileX>();
            foreach (var x in dbbookfiles)
            {
                var bf = new ViewBookFileX();
                ViewBookFileX.FillDto(x, bf);
                book.BookFiles.Add(bf);
            }

            book.BookKeywords = await context.BookKeywords.Where(q => q.BookId == id).Select(q => q.Value).ToListAsync();
            book.BookAuthors = await context.BookAutors.Where(q => q.BookId == id).Select(q => q.PersonMiscId).ToListAsync();

            book.BookRelatedAircraftTypes = (await (from x in context.BookRelatedAircraftTypes
                                                    join y in context.ViewAircraftTypes on x.AircraftTypeId equals y.Id
                                                    where x.BookId == id
                                                    select y).ToListAsync()).Select(q => new ViewModels.AircraftType()
                                                    {
                                                        Id = q.Id,
                                                        Manufacturer = q.Manufacturer,
                                                        ManufacturerId = q.ManufacturerId,
                                                        Remark = q.Remark,
                                                        Type = q.Type
                                                    }).ToList();


            book.BookRelatedEmployees = (await (from x in context.BookRelatedEmployees
                                                join y in context.ViewEmployees on x.EmployeeId equals y.Id
                                                where x.BookId == id
                                                select y).ToListAsync()).Select(q => new ViewModels.EmployeeView()
                                                {
                                                    Name = q.Name,
                                                    NID = q.NID,
                                                    PID = q.PID,
                                                    Location = q.Location,
                                                    CaoCardNumber = q.CaoCardNumber,
                                                    NDTNumber = q.NDTNumber,
                                                    DateJoinCompany = q.DateJoinCompany,
                                                    Id = q.Id,
                                                    IDNo = q.IDNo,


                                                }).ToList();
            book.BookRelatedGroups = (await (from x in context.BookRelatedGroups
                                             join y in context.ViewJobGroups on x.GroupId equals y.Id
                                             where x.BookId == id
                                             select new { y, x.TypeId }).ToListAsync()).Select(q => new ViewModels./*JobGroup*/BookTypeGroup()
                                             {
                                                 Title = q.y.Title,
                                                 FullCode = q.y.FullCode,
                                                 Remark = q.y.Remark,
                                                 Parent = q.y.Parent,
                                                 Id = q.y.Id,
                                                 TypeId = q.TypeId ?? -1,
                                                 Type = getTypeByTypeId(q.TypeId)
                                             }).ToList();
            book.BookRelatedStudyFields = (await (from x in context.BookRelatedStudyFields
                                                  join y in context.ViewOptions on x.StudyFieldId equals y.Id
                                                  where x.BookId == id
                                                  select y).ToListAsync()).Select(q => new ViewModels.Option()
                                                  {
                                                      Title = q.Title,

                                                      Parent = q.Parent,
                                                      Id = q.Id,

                                                  }).ToList();
            book.Chapters = await context.ViewBookChapters.Where(q => q.BookId == id).OrderBy(q => q.Fullcode).ToListAsync();

            return book;
        }


        public async Task<ViewModels.Book> GetBookDtoNew(int id)
        {
            var book = new ViewModels.Book();
            var dbbook = await context.Books.FirstOrDefaultAsync(q => q.Id == id);
            ViewModels.Book.FillDto(dbbook, book);
            var dbbookfiles = await this.context.ViewBookFiles.Where(q => q.BookId == id).ToListAsync();
            book.BookFiles = new List<ViewBookFileX>();
            foreach (var x in dbbookfiles)
            {
                var bf = new ViewBookFileX();
                ViewBookFileX.FillDto(x, bf);
                book.BookFiles.Add(bf);
            }
            book.CourseIds = await context.BookCourses.Where(q => q.BookId == id).OrderByDescending(q => q.CourseId).Select(q => q.CourseId).ToListAsync();
            book.BookKeywords = await context.BookKeywords.Where(q => q.BookId == id).Select(q => q.Value).ToListAsync();
            book.BookAuthors = await context.BookAutors.Where(q => q.BookId == id).Select(q => q.PersonMiscId).ToListAsync();

            book.BookRelatedAircraftTypes = (await (from x in context.BookRelatedAircraftTypes
                                                    join y in context.ViewAircraftTypes on x.AircraftTypeId equals y.Id
                                                    where x.BookId == id
                                                    select y).ToListAsync()).Select(q => new ViewModels.AircraftType()
                                                    {
                                                        Id = q.Id,
                                                        Manufacturer = q.Manufacturer,
                                                        ManufacturerId = q.ManufacturerId,
                                                        Remark = q.Remark,
                                                        Type = q.Type
                                                    }).ToList();


            book.BookRelatedEmployees = (await (from x in context.BookRelatedEmployees
                                                join y in context.ViewEmployees on x.EmployeeId equals y.Id
                                                where x.BookId == id
                                                select y).ToListAsync()).Select(q => new ViewModels.EmployeeView()
                                                {
                                                    Name = q.Name,
                                                    NID = q.NID,
                                                    PID = q.PID,
                                                    Location = q.Location,
                                                    CaoCardNumber = q.CaoCardNumber,
                                                    NDTNumber = q.NDTNumber,
                                                    DateJoinCompany = q.DateJoinCompany,
                                                    Id = q.Id,
                                                    IDNo = q.IDNo,


                                                }).ToList();
            book.BookRelatedGroups = (await (from x in context.BookRelatedGroups
                                             join y in context.ViewJobGroups on x.GroupId equals y.Id
                                             where x.BookId == id
                                             select new { y, x.TypeId }).ToListAsync()).Select(q => new ViewModels./*JobGroup*/BookTypeGroup()
                                             {
                                                 Title = q.y.Title,
                                                 FullCode = q.y.FullCode,
                                                 Remark = q.y.Remark,
                                                 Parent = q.y.Parent,
                                                 Id = q.y.Id,
                                                 TypeId = q.TypeId ?? -1,
                                                 Type = getTypeByTypeId(q.TypeId)
                                             }).ToList();

            //varesh
            var grps = await (from x in context.BookRelatedGroups
                              join y in context.ViewJobGroups on x.GroupId equals y.Id
                              where x.BookId == id
                              select y.FullCode


                                             ).ToListAsync();

            //fucking flypersia
            /* var grps =  await (from x in context.BookRelatedGroups
                                              join y in context.ViewJobGroups on x.GroupId equals y.Id
                                              where x.BookId == id
                                              select    y.FullCode2   


                                             )  .ToListAsync();
            */
            book.BookGrps = new List<string>();
            //varesh
            /* foreach (var x in grps)
             {
                 if (x.StartsWith("00101"))
                     book.BookGrps.Add("00101");
                 else if (x.StartsWith("00102"))
                     book.BookGrps.Add("00102");
                 else if (x.StartsWith("00103"))
                     book.BookGrps.Add("00103");
                 else if (x.StartsWith("00210"))
                     book.BookGrps.Add("00210");
                 else if (x.StartsWith("00220"))
                     book.BookGrps.Add("00220");
                 else book.BookGrps.Add(x.Substring(0,3));
             }*/

            foreach (var x in grps)
            {
                if (x.StartsWith("000011006"))
                    book.BookGrps.Add("00101");
                else if (x.StartsWith("000011007"))
                    book.BookGrps.Add("00102");

                // else if (x.StartsWith("00103"))
                //    book.BookGrps.Add("00103");

                //else if (x.StartsWith("00210"))
                //    book.BookGrps.Add("00210");
                // else if (x.StartsWith("00220"))
                //     book.BookGrps.Add("00220");
                else book.BookGrps.Add(x);
            }



            //fucking flypersia


            book.BookGrps = book.BookGrps.Distinct().ToList();





            book.BookRelatedStudyFields = (await (from x in context.BookRelatedStudyFields
                                                  join y in context.ViewOptions on x.StudyFieldId equals y.Id
                                                  where x.BookId == id
                                                  select y).ToListAsync()).Select(q => new ViewModels.Option()
                                                  {
                                                      Title = q.Title,

                                                      Parent = q.Parent,
                                                      Id = q.Id,

                                                  }).ToList();
            book.Chapters = await context.ViewBookChapters.Where(q => q.BookId == id).OrderBy(q => q.Fullcode).ToListAsync();

            return book;
        }

        public async Task<ViewModels.Book> GetEmployeeBookDto(int id, int employeeId)
        {
            var book = new ViewModels.Book();
            var dbbook = await context.ViewBookApplicableEmployees.FirstOrDefaultAsync(q => q.BookId == id && q.EmployeeId == employeeId);
            ViewModels.Book.FillDto(dbbook, book);
            var dbbookfiles = await this.context.ViewBookFiles.Where(q => q.BookId == id).ToListAsync();
            book.BookFiles = new List<ViewBookFileX>();
            foreach (var x in dbbookfiles)
            {
                var bf = new ViewBookFileX();
                ViewBookFileX.FillDto(x, bf);
                book.BookFiles.Add(bf);
            }

            //book.BookKeywords = await context.BookKeywords.Where(q => q.BookId == id).Select(q => q.Value).ToListAsync();
            //book.BookAuthors = await context.BookAutors.Where(q => q.BookId == id).Select(q => q.PersonMiscId).ToListAsync();

            //book.BookRelatedAircraftTypes = (await (from x in context.BookRelatedAircraftTypes
            //                                        join y in context.ViewAircraftTypes on x.AircraftTypeId equals y.Id
            //                                        where x.BookId == id
            //                                        select y).ToListAsync()).Select(q => new ViewModels.AircraftType()
            //                                        {
            //                                            Id = q.Id,
            //                                            Manufacturer = q.Manufacturer,
            //                                            ManufacturerId = q.ManufacturerId,
            //                                            Remark = q.Remark,
            //                                            Type = q.Type
            //                                        }).ToList();


            //book.BookRelatedEmployees = (await (from x in context.BookRelatedEmployees
            //                                    join y in context.ViewEmployees on x.EmployeeId equals y.Id
            //                                    where x.BookId == id
            //                                    select y).ToListAsync()).Select(q => new ViewModels.EmployeeView()
            //                                    {
            //                                        Name = q.Name,
            //                                        NID = q.NID,
            //                                        PID = q.PID,
            //                                        Location = q.Location,
            //                                        CaoCardNumber = q.CaoCardNumber,
            //                                        NDTNumber = q.NDTNumber,
            //                                        DateJoinCompany = q.DateJoinCompany,
            //                                        Id = q.Id,
            //                                        IDNo = q.IDNo,


            //                                    }).ToList();
            //book.BookRelatedGroups = (await (from x in context.BookRelatedGroups
            //                                 join y in context.ViewJobGroups on x.GroupId equals y.Id
            //                                 where x.BookId == id
            //                                 select y).ToListAsync()).Select(q => new ViewModels.JobGroup()
            //                                 {
            //                                     Title = q.Title,
            //                                     FullCode = q.FullCode,
            //                                     Remark = q.Remark,
            //                                     Parent = q.Parent,
            //                                     Id = q.Id,
            //                                 }).ToList();
            //book.BookRelatedStudyFields = (await (from x in context.BookRelatedStudyFields
            //                                      join y in context.ViewOptions on x.StudyFieldId equals y.Id
            //                                      where x.BookId == id
            //                                      select y).ToListAsync()).Select(q => new ViewModels.Option()
            //                                      {
            //                                          Title = q.Title,

            //                                          Parent = q.Parent,
            //                                          Id = q.Id,

            //                                      }).ToList();


            return book;
        }

        public async Task<object> UpdateChapters(string key, int bookId)
        {
            var chapters = await this.context.BookChapters.Where(q => q.BookKey == key).ToListAsync();
            foreach (var x in chapters)
            {
                x.BookId = bookId;
            }


            return true;
        }

        public async Task<object> DeleteBookFile(int id)
        {
            var bookfile = await this.context.BookFiles.Where(q => q.Id == id).FirstOrDefaultAsync();
            if (bookfile != null)
                this.context.BookFiles.Remove(bookfile);


            return true;
        }



        internal void FillBookRelatedAircraftTypes(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookRelatedAircraftTypes.Where(q => q.BookId == entity.Id).ToList();
            while (existing.Count > 0)
            {
                var i = existing.First();
                this.context.BookRelatedAircraftTypes.Remove(i);
                existing.Remove(i);
            }
            foreach (var x in dto.BookRelatedAircraftTypes)
                this.context.BookRelatedAircraftTypes.Add(new Models.BookRelatedAircraftType()
                {
                    Book = entity,
                    AircraftTypeId = x.Id

                });
        }

        internal void FillBookRelatedEmployees(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookRelatedEmployees.Where(q => q.BookId == entity.Id).ToList();
            while (existing.Count > 0)
            {
                var i = existing.First();
                this.context.BookRelatedEmployees.Remove(i);
                existing.Remove(i);
            }
            foreach (var x in dto.BookRelatedEmployees)
                this.context.BookRelatedEmployees.Add(new Models.BookRelatedEmployee()
                {
                    Book = entity,
                    EmployeeId = x.Id,

                });
        }
        //magu3-1
        internal void FillBookRelatedGroups(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookRelatedGroups.Where(q => q.BookId == entity.Id).ToList();
            while (existing.Count > 0)
            {
                var i = existing.First();
                this.context.BookRelatedGroups.Remove(i);
                existing.Remove(i);
            }
            foreach (var x in dto.BookRelatedGroups)
                this.context.BookRelatedGroups.Add(new Models.BookRelatedGroup()
                {
                    Book = entity,
                    GroupId = x.Id,
                    TypeId = x.TypeId,

                });
        }

        internal void FillBookRelatedGroupsNew(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookRelatedGroups.Where(q => q.BookId == entity.Id).ToList();
            //while (existing.Count > 0)
            //{
            //    var i = existing.First();
            //    this.context.BookRelatedGroups.Remove(i);
            //    existing.Remove(i);
            //}
            this.context.BookRelatedGroups.RemoveRange(existing);

            //var groups=from x in this.context.JobGroups
            //           where x.FullCode.StartsWith
            var _grps = new List<Models.JobGroup>();
            foreach (var x in dto.BookGroups)
            {
                var qry = from q in this.context.JobGroups
                          select q;
                if (x.code == "-1")
                {
                    //var grps = this.context.JobGroups.Where(q => q.FullCode.StartsWith(x)).ToList();
                    var grps = this.context.JobGroups.ToList();
                    _grps = _grps.Concat(grps).ToList();
                }
                else
                {
                    //Modified for FLYKISH
                    qry = qry.Where(q => q.FullCode.StartsWith(x.code));
                    //qry = qry.Where(q => q.FullCode == x.FullCode);
                    var grps = qry.ToList();
                    _grps = _grps.Concat(grps).ToList();

                    if (!string.IsNullOrEmpty(x.code2))
                    {
                        _grps = _grps.Concat(this.context.JobGroups.Where(w => w.FullCode == x.code2)).ToList();
                    }

                }

            }

            //foreach (var x in dto.BookRelatedGroups)
            foreach (var x in _grps)
                this.context.BookRelatedGroups.Add(new Models.BookRelatedGroup()
                {
                    Book = entity,
                    GroupId = x.Id,
                    TypeId = null,// x.TypeId,

                });
        }

        internal void FillBookRelatedTypeGroups(Models.Book entity, ViewModels.Book dto)
        {
            //var existing = this.context.BookRelatedGroups.Where(q => q.BookId == entity.Id).ToList();
            //while (existing.Count > 0)
            //{
            //    var i = existing.First();
            //    this.context.BookRelatedGroups.Remove(i);
            //    existing.Remove(i);
            //}
            //foreach (var x in dto.BookRelatedTypeGroups)
            //    this.context.BookRelatedGroups.Add(new Models.BookRelatedGroup()
            //    {
            //        Book = entity,
            //        GroupId = x.Id,
            //         TypeId=x.TypeId,

            //    });
        }

        internal void FillBookRelatedStudyFields(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookRelatedStudyFields.Where(q => q.BookId == entity.Id).ToList();
            while (existing.Count > 0)
            {
                var i = existing.First();
                this.context.BookRelatedStudyFields.Remove(i);
                existing.Remove(i);
            }
            foreach (var x in dto.BookRelatedStudyFields)
                this.context.BookRelatedStudyFields.Add(new Models.BookRelatedStudyField()
                {
                    Book = entity,
                    StudyFieldId = x.Id,

                });
        }

        internal void FillBookAuthors(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookAutors.Where(q => q.BookId == entity.Id && q.TypeId == 1).ToList();
            while (existing.Count > 0)
            {
                var i = existing.First();
                this.context.BookAutors.Remove(i);
                existing.Remove(i);
            }
            foreach (var x in dto.BookAuthors)
                this.context.BookAutors.Add(new Models.BookAutor()
                {
                    Book = entity,
                    TypeId = 1,
                    PersonMiscId = x,


                });
        }

        internal void FillBookKeywords(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookKeywords.Where(q => q.BookId == entity.Id).ToList();
            while (existing.Count > 0)
            {
                var i = existing.First();
                this.context.BookKeywords.Remove(i);
                existing.Remove(i);
            }
            foreach (var x in dto.BookKeywords)
                this.context.BookKeywords.Add(new BookKeyword()
                {
                    Book = entity,
                    Value = x.ToLower(),
                });
        }

        internal void FillBookCourses(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookCourses.Where(q => q.BookId == entity.Id).ToList();
            while (existing.Count > 0)
            {
                var i = existing.First();
                this.context.BookCourses.Remove(i);
                existing.Remove(i);
            }
            foreach (var x in dto.CourseIds)
                this.context.BookCourses.Add(new BookCourse()
                {
                    Book = entity,
                    CourseId = x,
                });
        }

        internal void FillBookFiles(Models.Book entity, ViewModels.Book dto)
        {
            var existing = this.context.BookFiles.Where(q => q.BookId == entity.Id).ToList();
            var deleted = (from x in existing
                           where dto.BookFiles.FirstOrDefault(q => q.Id == x.Id) == null
                           select x).ToList();
            var added = (from x in dto.BookFiles
                         where existing.FirstOrDefault(q => q.Id == x.Id) == null
                         select x).ToList();
            var edited = (from x in existing
                          where dto.BookFiles.FirstOrDefault(q => q.Id == x.Id) != null
                          select x).ToList();
            foreach (var x in deleted)
                context.BookFiles.Remove(x);
            foreach (var x in added)
                context.BookFiles.Add(new BookFile()
                {
                    Book = entity,
                    ChapterId = x.ChapterId,
                    Remark = x.Remark,
                    Document = new Models.Document()
                    {
                        DocumentTypeId = x.DocumentTypeId,
                        FileType = x.FileType,
                        FileTypeId = x.FileTypeId,
                        FileUrl = x.FileUrl,
                        SysUrl = x.SysUrl,
                        Title = x.Title,


                    }

                });

            foreach (var x in edited)
            {
                var item = dto.BookFiles.FirstOrDefault(q => q.Id == x.Id);
                if (item != null)
                {
                    x.Remark = item.Remark;

                }
            }
        }
        //magu3-1
        public async Task<bool> ExposeBook(ViewModels.BookExpose dto)
        {
            try
            {
                var _airline_title = ConfigurationManager.AppSettings["airline_title"];
                var _airline_url = ConfigurationManager.AppSettings["airline_url"];
                List<string> names = new List<string>();
                List<string> numbers = new List<string>();
                List<string> sms = new List<string>();
                var book = await dbSet.FirstOrDefaultAsync(q => q.Id == dto.BookId);
                book.DatePublished = DateTime.Now;

                var applicables = this.context.ViewBookApplicableEmployees.Where(q => q.BookId == dto.BookId).Select(q => new { q.EmployeeId, q.Name, q.Title, q.Type, q.Mobile,q.Category }).ToList();

                string _issue = "";
                if (book.Issue != null)
                {
                    try
                    {
                        _issue = book.Issue.ToString();
                    }
                    catch (Exception _ex)
                    {

                    }
                }

                foreach (var x in applicables)
                {
                    var datesent = DateTime.Now.Year + "/" + DateTime.Now.Month + "/" + DateTime.Now.Day + " " + DateTime.Now.Hour + ":" + DateTime.Now.Minute;
                    //var _message = "Dear " + x.Name + ",<br/>"
                    //    + "A new " + x.Type + " added to your e-library: " + x.Title
                    //    + "<br/>"
                    //    + "Please access your WebPocket account to see more details."
                    //    + "<br/>"
                    //    + "Date Sent: " + datesent
                    //    + "<br/>"
                    //    + "Url:"
                    //    + "<br/>"
                    //    + _airline_url
                    //    + "<br/>"
                    //    + _airline_title;



                    //                   var _message = "همکار گرامی، در کتابخانه الکترونیک، مستندات  "

                    //                       + "<br/>"
                    //                       + x.Title
                    //                        + "<br/>"
                    //                       //+ "(" + x.Category + ")"
                    //                      //  + "<br/>"
                    //                       + "مرتبط با حیطه کاری شما، بارگزاری گردیده است. جهت انجام وظایف خود منطبق با دستورالعمل های به روز شرکت به سامانه کتابخانه الکترونیک طی 24 ساعت آبنده مراجعه نمایید."
                    //                        + "<br/>"
                    //                        + "https://ava.pulsepocket.app"
                    //                        + "<br/>"
                    //                         + "https://ava.skybag.app"
                    //                        + "<br/>"
                    //                        + "مدیریت ایمنی و کیفی هواپیمایی آوا";

                    //                   //+ "مستندات (اسم کتاب) مرتبط با حیطه کاری شما در کتابخانه الکترونیک بارگزاری گردیده است.";
                    //                   var _sms = "همکار گرامی، در کتابخانه الکترونیک، مستندات  "
                    //                       + "\n"
                    //                        + x.Title
                    //                        // + "\n"
                    //                         // + "(" + x.Category + ")"
                    //                         + "\n"
                    //                          + "مرتبط با حیطه کاری شما، بارگزاری گردیده است. جهت انجام وظایف خود منطبق با دستورالعمل های به روز شرکت به سامانه کتابخانه الکترونیک طی 24 ساعت آبنده مراجعه نمایید."
                    //                            + "\n"
                    //+ "https://ava.pulsepocket.app"
                    //+ "\n"
                    //+ "https://ava.skybag.app"
                    // + "\n"
                    //                        + "مدیریت ایمنی و کیفی هواپیمایی آوا";


                    var _message = "همکار گرامی، در کتابخانه الکترونیک، مستندات  "

                       + "<br/>"
                       + x.Title
                        + "<br/>"
                       //+ "(" + x.Category + ")"
                       //  + "<br/>"
                       + "مرتبط با حیطه کاری شما، بارگزاری گردیده است. جهت انجام وظایف خود منطبق با دستورالعمل های به روز شرکت به سامانه کتابخانه الکترونیک طی 24 ساعت آینده مراجعه نمایید."
                        + "<br/>"
                        + "https://mehr.pulsepocket.app/"
                        + "<br/>"
                         + "https://mehr.efb.myaero.tech/"
                        + "<br/>"
                        + "شرکت هواپیمایی مهر";

                    //+ "مستندات (اسم کتاب) مرتبط با حیطه کاری شما در کتابخانه الکترونیک بارگزاری گردیده است.";
                    var _sms = "همکار گرامی، در کتابخانه الکترونیک، مستندات  "
                        + "\n"
                         + x.Title
                          // + "\n"
                          // + "(" + x.Category + ")"
                          + "\n"
                           + "مرتبط با حیطه کاری شما، بارگزاری گردیده است. جهت انجام وظایف خود منطبق با دستورالعمل های به روز شرکت به سامانه کتابخانه الکترونیک طی 24 ساعت آینده مراجعه نمایید."
                             + "\n"
 + "https://mehr.pulsepocket.app/"
 + "\n"
 + "https://mehr.efb.myaero.tech/"
  + "\n"
                         + "شرکت هواپیمایی مهر";


                    //var _sms= "Dear " + x.Name + ","+ "\n\n"
                    //    + "A new " + x.Type + " added to your e-library: "
                    //    + "\n"
                    //    + x.Title
                    //    + "\n"
                    //    +(!string.IsNullOrEmpty(_issue)?"Issue: "+_issue+ "\n" : "")
                    //    + (!string.IsNullOrEmpty(book.Edition) ? "Revision: " + book.Edition + "\n" : "")
                    //    + "Please access your WebPocket account to see more details."
                    //    + "\n\n"
                    //    + "Date Sent: " + datesent
                    //     + "\n"
                    //    //+ "Url:"
                    //    // + "\n"
                    //    + _airline_url
                    //     + "\n"
                    //    + _airline_title;

                    // var text = "A new item added to your e-library: " + "\n\n" + $scope.dg_selected.Title + "\n\n" + "Please access your Crew Pocket account to see more details."
                    //          + "\n" + "Date Sent: " + moment(new Date()).format('MM-DD-YYYY HH:mm');


                    var notification = new Models.Notification()
                    {
                        App = dto.AppNotification,
                        CustomerId = dto.CustomerId,
                        DateSent = DateTime.Now,
                        Email = dto.Email,
                        ModuleId = 2,
                        SMS = dto.SMS,
                        UserId = x.EmployeeId,
                        TypeId = 98,
                        Message = _message,
                    };
                    this.context.Notifications.Add(notification);

                    if (!string.IsNullOrEmpty(x.Mobile))
                    {
                        names.Add(x.Name);
                        numbers.Add(x.Mobile);
                        sms.Add(_sms);
                    }
                }
                //send notification
                new Thread(() =>
                 {
                     try
                     {
                         int c = 0;
                         Magfa mgf = new Magfa();
                         foreach (var m in numbers)
                         {
                             var txt = sms[c];
                             var res = mgf.enqueue(1, m, txt);
                             c++;
                         }
                     }
                     catch (Exception eex)
                     {
                         int i = 0;
                     }

                 }).Start();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }



    }
}