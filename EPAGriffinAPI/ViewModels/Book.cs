using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ISBN { get; set; }
        public DateTime? DateRelease { get; set; }
        public DateTime? DateExposure { get; set; }
        public DateTime? DateCreate { get; set; }
        public DateTime? DatePublished { get; set; }
        public int? PublisherId { get; set; }
        public int? FolderId { get; set; }
        public string ISSNPrint { get; set; }
        public string ISSNElectronic { get; set; }
        public string DOI { get; set; }
        public string Pages { get; set; }
        public int CategoryId { get; set; }
        public int? CustomerId { get; set; }
        public string Abstract { get; set; }
        public string ImageUrl { get; set; }
        public bool? IsExposed { get; set; }
        public Nullable<System.DateTime> DateDeadline { get; set; }
        public string Duration { get; set; }
        public Nullable<int> LanguageId { get; set; }
        public string Language { get; private set; }
        public string ExternalUrl { get; set; }
        public Nullable<int> NumberOfLessens { get; set; }
        public int TypeId { get; set; }
        public int? Issue { get; set; }
        public Nullable<int> JournalId { get; set; }
        public string Journal { get; private set; }
        public string Conference { get; set; }
        public Nullable<int> ConferenceLocationId { get; set; }
        public string DateConference { get; set; }
        public string Sender { get; set; }
        public string No { get; set; }
        public string PublishedIn { get; set; }
        public string INSPECAccessionNumber { get; set; }
        public string Edition { get; set; }
        public string DateEffective { get; set; }

        public bool? IsVisited { get; set; }
        public bool? IsDownloaded { get; set; }

        public DateTime? DateVisit { get; set; }

        public DateTime? DateDownload { get; set; }

        public string Authors { get; set; }
        public string Keywords { get; set; }
        public string Publisher { get; set; }
        public string Category { get; private set; }
        public string BookKey { get;  set; }
        public Nullable<int> CourseId { get; set; }

        public DateTime? DateValidUntil { get; set; }
        public DateTime? DeadLine { get; set; }

        public List<string> BookGrps { get; set; }

        List<ViewBookFileX> bookFiles = null;
        public List<ViewBookFileX> BookFiles
        {
            get
            {
                if (bookFiles == null)
                    bookFiles = new List<ViewBookFileX>();
                return bookFiles;

            }
            set { bookFiles = value; }
        }


        List<AircraftType> bookRelatedAircraftTypes = null;
        public List<AircraftType> BookRelatedAircraftTypes
        {
            get
            {
                if (bookRelatedAircraftTypes == null)
                    bookRelatedAircraftTypes = new List<AircraftType>();
                return bookRelatedAircraftTypes;

            }
            set { bookRelatedAircraftTypes = value; }
        }


        List<Option> bookRelatedStudyFields = null;
        public List<Option> BookRelatedStudyFields
        {
            get
            {
                if (bookRelatedStudyFields == null)
                    bookRelatedStudyFields = new List<Option>();
                return bookRelatedStudyFields;

            }
            set { bookRelatedStudyFields = value; }
        }

        List<EmployeeView> bookRelatedEmployees = null;
        public List<EmployeeView> BookRelatedEmployees
        {
            get
            {
                if (bookRelatedEmployees == null)
                    bookRelatedEmployees = new List<EmployeeView>();
                return bookRelatedEmployees;

            }
            set { bookRelatedEmployees = value; }
        }

        //List<JobGroup> bookRelatedGroups = null;
        //public List<JobGroup> BookRelatedGroups
        //{
        //    get
        //    {
        //        if (bookRelatedGroups == null)
        //            bookRelatedGroups = new List<JobGroup>();
        //        return bookRelatedGroups;

        //    }
        //    set { bookRelatedGroups = value; }
        //}

        List<BookTypeGroup> bookRelatedGroups = null;
        public List<BookTypeGroup> BookRelatedGroups
        {
            get
            {
                if (bookRelatedGroups == null)
                    bookRelatedGroups = new List<BookTypeGroup>();
                return bookRelatedGroups;

            }
            set { bookRelatedGroups = value; }
        }

        public class _bookgrp {
            public string title { get; set; }
            public string code { get; set; }
            public string code2 { get; set; }
            public string code3 { get; set; }
            public bool selected {get;set;}
        }

        List<_bookgrp> bookGroups = null;
        public List<_bookgrp> BookGroups
        {
            get
            {
                if (bookGroups == null)
                    bookGroups = new List<_bookgrp>();
                return bookGroups;

            }
            set { bookGroups = value; }
        }



        List<string> bookKeywords = null;
        public List<string> BookKeywords
        {
            get
            {
                if (bookKeywords == null)
                    bookKeywords = new List<string>();
                return bookKeywords;

            }
            set { bookKeywords = value; }
        }

        List<int> courseIds = null;
        public List<int> CourseIds
        {
            get
            {
                if (courseIds == null)
                    courseIds = new List<int>();
                return courseIds;

            }
            set { courseIds = value; }
        }

        List<int> bookAuthors = null;
        public List<int> BookAuthors
        {
            get
            {
                if (bookAuthors == null)
                    bookAuthors = new List<int>();
                return bookAuthors;

            }
            set { bookAuthors = value; }
        }


        public List<Models.ViewBookChapter> Chapters { get; set; }

        public static void Fill(Models.Book entity, ViewModels.Book book)
        {
            entity.Id = book.Id;
            entity.Title = book.Title;
            entity.ISBN = book.ISBN;
            entity.DateRelease = book.DateRelease;
            entity.PublisherId = book.PublisherId;
            entity.FolderId = book.FolderId;
            entity.ISSNPrint = book.ISSNPrint;
            entity.ISSNElectronic = book.ISSNElectronic;
            entity.DOI = book.DOI;
            entity.Pages = book.Pages;
            entity.CategoryId = book.CategoryId;
            entity.CustomerId = book.CustomerId;
            entity.Abstract = book.Abstract;
            entity.DateCreate = book.DateCreate;
            entity.DatePublished = book.DatePublished;
            if (book.IsExposed == true && entity.DatePublished == null)
            {
                entity.DatePublished = DateTime.Now;
            }
            if (book.IsExposed == false || book.IsExposed == null)
                entity.DatePublished = null;
            entity.ImageUrl = book.ImageUrl;

            if (entity.Id == -1)
                entity.DateCreate = DateTime.Now;


            entity.DateDeadline = book.DateDeadline;
            entity.Duration = book.Duration;
            entity.LanguageId = book.LanguageId;
            entity.ExternalUrl = book.ExternalUrl;
            entity.NumberOfLessens = book.NumberOfLessens;
            entity.TypeId = book.TypeId;
            entity.JournalId = book.JournalId;
            entity.Conference = book.Conference;
            entity.ConferenceLocationId = book.ConferenceLocationId;
            entity.DateConference = book.DateConference;
            entity.Sender = book.Sender;
            entity.No = book.No;
            entity.PublishedIn = book.PublishedIn;
            entity.INSPECAccessionNumber = book.INSPECAccessionNumber;
            entity.Edition = book.Edition;
            entity.DateEffective = book.DateEffective;
            entity.Issue = book.Issue;
            entity.DeadLine = book.DeadLine;
            entity.DateValidUntil = book.DateValidUntil;
            entity.BookKey = book.BookKey;
            entity.CourseId = book.CourseId;
        }
        public static void FillDto(Models.Book entity, ViewModels.Book book)
        {
            book.Id = entity.Id;
            book.Title = entity.Title;
            book.ISBN = entity.ISBN;
            book.DateRelease = entity.DateRelease;
            book.PublisherId = entity.PublisherId;
            book.FolderId = entity.FolderId;
            book.ISSNPrint = entity.ISSNPrint;
            book.ISSNElectronic = entity.ISSNElectronic;
            book.DOI = entity.DOI;
            book.Pages = entity.Pages;
            book.CategoryId = entity.CategoryId;
            book.CustomerId = entity.CustomerId;
            book.Abstract = entity.Abstract;
            book.DateCreate = entity.DateCreate;
            book.DatePublished = entity.DatePublished;
            book.ImageUrl = entity.ImageUrl;
            book.IsExposed = entity.DatePublished != null;


            book.DateDeadline = entity.DateDeadline;
            book.Duration = entity.Duration;
            book.LanguageId = entity.LanguageId;
            book.ExternalUrl = entity.ExternalUrl;
            book.NumberOfLessens = entity.NumberOfLessens;
            book.TypeId = entity.TypeId;
            book.JournalId = entity.JournalId;
            book.Conference = entity.Conference;
            book.ConferenceLocationId = entity.ConferenceLocationId;
            book.DateConference = entity.DateConference;
            book.Sender = entity.Sender;
            book.No = entity.No;
            book.PublishedIn = entity.PublishedIn;
            book.INSPECAccessionNumber = entity.INSPECAccessionNumber;
            book.Edition = entity.Edition;
            book.DateEffective = entity.DateEffective;
            book.Issue = entity.Issue;
            book.DeadLine = entity.DeadLine;
            book.DateValidUntil = entity.DateValidUntil;
            book.BookKey = entity.BookKey;
            book.CourseId = entity.CourseId;
        }

        public static void FillDto(Models.ViewBookApplicableEmployee entity, ViewModels.Book book)
        {
            book.Id = entity.BookId;
            book.Title = entity.Title;
            book.ISBN = entity.ISBN;
            book.DateRelease = entity.DateRelease;
            book.PublisherId = entity.PublisherId;
            book.Publisher = entity.Publisher;
            
            book.Category = entity.Category;
            book.ISSNPrint = entity.ISSNPrint;
            book.ISSNElectronic = entity.ISSNElectronic;
            book.DOI = entity.DOI;
            book.Pages = entity.Pages;
            book.CategoryId = entity.CategoryId;
            book.CustomerId = entity.CustomerId;
            book.Abstract = entity.Abstract;
            book.DateCreate = entity.DateCreate;
            book.DateRelease = entity.DateRelease;
            book.DateExposure = entity.DateExposure;
            book.ImageUrl = entity.ImageUrl;
            book.IsExposed = entity.IsExposed==1;


            book.DateDeadline = entity.DateDeadline;
            book.Duration = entity.Duration;
            book.LanguageId = entity.LanguageId;
            book.Language = entity.Language;
            book.ExternalUrl = entity.ExternalUrl;
            book.NumberOfLessens = entity.NumberOfLessens;
            book.TypeId = entity.TypeId;
            book.JournalId = entity.JournalId;
            book.Journal = entity.Journal;
            book.Conference = entity.Conference;
            book.ConferenceLocationId = entity.ConferenceLocationId;
            book.DateConference = entity.DateConference;
            book.Sender = entity.Sender;
            book.No = entity.No;
            book.PublishedIn = entity.PublishedIn;
            book.INSPECAccessionNumber = entity.INSPECAccessionNumber;
            book.Edition = entity.Edition;
            book.DateEffective = entity.DateEffective;

          //  book.Issue = entity.Issue;

            book.Keywords = entity.Keywords;
            book.Authors = entity.Authors;
            book.IsVisited = entity.IsVisited;
            book.IsDownloaded = entity.IsDownloaded;
            book.DateVisit = entity.DateVisit;
            book.DateDownload = entity.DateDownload;
            book.DateValidUntil = entity.DateValidUntil;
            book.DeadLine = entity.DeadLine;
            


        }
    }
    public class BookTypeGroup
    {
        public int Id { get; set; }
        public int? TypeId { get; set; }

        public string Title { get; set; }
        public string FullCode { get; set; }
        public string Remark { get; set; }
        public string Parent { get; set; }
        public string Type { get; set; }

    }
    public class BookAutor
    {
        public int Id { get; set; }
        public int PersonMiscId { get; set; }
        public int TypeId { get; set; }
        public int BookId { get; set; }
        public static void Fill(Models.BookAutor entity, ViewModels.BookAutor bookautor)
        {
            entity.Id = bookautor.Id;
            entity.PersonMiscId = bookautor.PersonMiscId;
            entity.TypeId = bookautor.TypeId;
            entity.BookId = bookautor.BookId;
        }
        public static void FillDto(Models.BookAutor entity, ViewModels.BookAutor bookautor)
        {
            bookautor.Id = entity.Id;
            bookautor.PersonMiscId = entity.PersonMiscId;
            bookautor.TypeId = entity.TypeId;
            bookautor.BookId = entity.BookId;
        }
    }

    public class ViewBookFileX
    {
        public string Title { get; set; }
        public string FileUrl { get; set; }
        public string Remark { get; set; }
        public int DocumentId { get; set; }
        public string SysUrl { get; set; }
        public string FileType { get; set; }
        public int? DocumentTypeId { get; set; }
        public int? FileTypeId { get; set; }
        public int? ParentId { get; set; }
        public int BookId { get; set; }
        public int Id { get; set; }
        public int? ChapterId { get; set; }
        public static void Fill(Models.ViewBookFile entity, ViewModels.ViewBookFileX viewbookfile)
        {
            entity.Title = viewbookfile.Title;
            entity.FileUrl = viewbookfile.FileUrl;
            entity.Remark = viewbookfile.Remark;
            entity.DocumentId = viewbookfile.DocumentId;
            entity.SysUrl = viewbookfile.SysUrl;
            entity.FileType = viewbookfile.FileType;
            entity.DocumentTypeId = viewbookfile.DocumentTypeId;
            entity.FileTypeId = viewbookfile.FileTypeId;
            entity.ParentId = viewbookfile.ParentId;
            entity.BookId = viewbookfile.BookId;
            entity.Id = viewbookfile.Id;
        }
        public static void FillDto(Models.ViewBookFile entity, ViewModels.ViewBookFileX viewbookfile)
        {
            viewbookfile.Title = entity.Title;
            viewbookfile.FileUrl = entity.FileUrl;
            viewbookfile.Remark = entity.Remark;
            viewbookfile.DocumentId = entity.DocumentId;
            viewbookfile.SysUrl = entity.SysUrl;
            viewbookfile.FileType = entity.FileType;
            viewbookfile.DocumentTypeId = entity.DocumentTypeId;
            viewbookfile.FileTypeId = entity.FileTypeId;
            viewbookfile.ParentId = entity.ParentId;
            viewbookfile.BookId = entity.BookId;
            viewbookfile.Id = entity.Id;
            viewbookfile.ChapterId = entity.ChapterId;
        }
    }

    public class BookDto
    {

        public string Title { get; set; }

        List<string> files = new List<string>();
        public List<string> Files
        {
            get
            {
                if (files == null)
                    files = new List<string>();
                return files;
            }
            set { files = value; }
        }
    }

    public class BookExpose
    {
        public int BookId { get; set; }
        public bool SMS { get; set; }
        public bool Email { get; set; }
        public bool AppNotification { get; set; }

        public int CustomerId { get; set; }
    }
}