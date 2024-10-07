using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class Course
    {
        public int Id { get; set; }
        public int CourseTypeId { get; set; }
        public DateTime DateStart { get; set; }
        public decimal? DateStartP { get; set; }
        public DateTime? DateEnd { get; set; }
        public decimal? DateEndP { get; set; }
        public string Instructor { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public int? OrganizationId { get; set; }
        public int? Duration { get; set; }
        public int? DurationUnitId { get; set; }
        public int? StatusId { get; set; }
        public string Remark { get; set; }
        public int? Capacity { get; set; }
        public int? Tuition { get; set; }
        public int? CurrencyId { get; set; }
        public DateTime? DateDeadlineRegistration { get; set; }
        public decimal? DateDeadlineRegistrationP { get; set; }
        public string TrainingDirector { get; set; }
        public string Title { get; set; }
        public int? AircraftTypeId { get; set; }
        public int? AircraftModelId { get; set; }
        public int? CaoTypeId { get; set; }
        public bool? Recurrent { get; set; }
        public int? Interval { get; set; }
        public int? CalanderTypeId { get; set; }
        public bool? IsInside { get; set; }
        public bool? Quarantine { get; set; }
        public DateTime? DateStartPractical { get; set; }
        public DateTime? DateEndPractical { get; set; }
        public decimal? DateStartPracticalP { get; set; }
        public decimal? DateEndPracticalP { get; set; }
        public int? DurationPractical { get; set; }
        public int? DurationPracticalUnitId { get; set; }
        public bool? IsGeneral { get; set; }
        public int? CustomerId { get; set; }
        public string No { get; set; }
        public bool? IsNotificationEnabled { get; set; }

        List<AircraftType> courseRelatedAircraftTypes = null;
        public List<AircraftType> CourseRelatedAircraftTypes
        {
            get
            {
                if (courseRelatedAircraftTypes == null)
                    courseRelatedAircraftTypes = new List<AircraftType>();
                return courseRelatedAircraftTypes;

            }
            set { courseRelatedAircraftTypes = value; }
        }

        List<CourseType> courseRelatedCourseTypes = null;
        public List<CourseType> CourseRelatedCourseTypes
        {
            get
            {
                if (courseRelatedCourseTypes == null)
                    courseRelatedCourseTypes = new List<CourseType>();
                return courseRelatedCourseTypes;

            }
            set { courseRelatedCourseTypes = value; }
        }

        List<Option> courseRelatedStudyFields = null;
        public List<Option> CourseRelatedStudyFields
        {
            get
            {
                if (courseRelatedStudyFields == null)
                    courseRelatedStudyFields = new List<Option>();
                return courseRelatedStudyFields;

            }
            set { courseRelatedStudyFields = value; }
        }

        List<EmployeeView> courseRelatedEmployees = null;
        public List<EmployeeView> CourseRelatedEmployees
        {
            get
            {
                if (courseRelatedEmployees == null)
                    courseRelatedEmployees = new List<EmployeeView>();
                return courseRelatedEmployees;

            }
            set { courseRelatedEmployees = value; }
        }

        List<CourseView> courseRelatedCourses = null;
        public List<CourseView> CourseRelatedCourses
        {
            get
            {
                if (courseRelatedCourses == null)
                    courseRelatedCourses = new List<CourseView>();
                return courseRelatedCourses;

            }
            set { courseRelatedCourses = value; }
        }

        List<JobGroup> courseRelatedGroups = null;
        public List<JobGroup> CourseRelatedGroups
        {
            get
            {
                if (courseRelatedGroups == null)
                    courseRelatedGroups = new List<JobGroup>();
                return courseRelatedGroups;

            }
            set { courseRelatedGroups = value; }
        }

        List<int> courseAircraftTypes = null;
        public List<int> CourseAircraftTypes
        {
            get
            {
                if (courseAircraftTypes == null)
                    courseAircraftTypes = new List<int>();
                return courseAircraftTypes;

            }
            set { courseAircraftTypes = value; }
        }


        List<int> courseCatRates = null;
        public List<int> CourseCatRates
        {
            get
            {
                if (courseCatRates == null)
                    courseCatRates = new List<int>();
                return courseCatRates;

            }
            set { courseCatRates = value; }
        }


        public static void Fill(Models.Course entity, ViewModels.Course course)
        {
            entity.Id = course.Id;
            entity.CourseTypeId = course.CourseTypeId;
            entity.DateStart = course.DateStart;
            entity.DateStartP = Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateDigital(course.DateStart));
            entity.DateEnd = course.DateEnd;
            entity.DateEndP = course.DateEnd != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateDigital((DateTime)course.DateEnd)) : null;
            entity.Instructor = course.Instructor;
            entity.Location = course.Location;
            entity.Department = course.Department;
            entity.OrganizationId = course.OrganizationId;
            entity.Duration = course.Duration;
            entity.DurationUnitId = course.DurationUnitId;
            entity.StatusId = course.StatusId;
            entity.Remark = course.Remark;
            entity.Capacity = course.Capacity;
            entity.Tuition = course.Tuition;
            entity.CurrencyId = course.CurrencyId;
            entity.DateDeadlineRegistration = course.DateDeadlineRegistration;
            entity.DateDeadlineRegistrationP = course.DateDeadlineRegistration != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateDigital((DateTime)course.DateDeadlineRegistration)) : null;
            entity.TrainingDirector = course.TrainingDirector;
            entity.Title = course.Title;
            entity.AircraftTypeId = course.AircraftTypeId;
            entity.AircraftModelId = course.AircraftModelId;
            entity.CaoTypeId = course.CaoTypeId;
            entity.Recurrent = course.Recurrent;
            entity.Interval = course.Interval;
            entity.CalanderTypeId = course.CalanderTypeId;
            entity.IsInside = course.IsInside;
            entity.Quarantine = course.Quarantine;
            entity.DateStartPractical = course.DateStartPractical;
            entity.DateEndPractical = course.DateEndPractical;
            entity.DateStartPracticalP = course.DateStartPractical != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateDigital((DateTime)course.DateStartPractical)) : null; ;
            entity.DateEndPracticalP = course.DateEndPractical != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateDigital((DateTime)course.DateEndPractical)) : null; ;
            entity.DurationPractical = course.DurationPractical;
            entity.DurationPracticalUnitId = course.DurationPracticalUnitId;
            entity.IsGeneral = course.IsGeneral;
            entity.CustomerId = course.CustomerId;
            entity.No = course.No;
            entity.IsNotificationEnabled = course.IsNotificationEnabled;
        }

        public static void FillDto(Models.Course entity, ViewModels.Course course)
        {

            course.Id = entity.Id;
            course.CourseTypeId = entity.CourseTypeId;
            course.DateStart = entity.DateStart;
            course.DateStartP = entity.DateStartP;
            course.DateEnd = entity.DateEnd;
            course.DateEndP = entity.DateEndP;
            course.Instructor = entity.Instructor;
            course.Location = entity.Location;
            course.Department = entity.Department;
            course.OrganizationId = entity.OrganizationId;
            course.Duration = entity.Duration;
            course.DurationUnitId = entity.DurationUnitId;
            course.StatusId = entity.StatusId;
            course.Remark = entity.Remark;
            course.Capacity = entity.Capacity;
            course.Tuition = entity.Tuition;
            course.CurrencyId = entity.CurrencyId;
            course.DateDeadlineRegistration = entity.DateDeadlineRegistration;
            course.DateDeadlineRegistrationP = entity.DateDeadlineRegistrationP;
            course.TrainingDirector = entity.TrainingDirector;
            course.Title = entity.Title;
            course.AircraftTypeId = entity.AircraftTypeId;
            course.AircraftModelId = entity.AircraftModelId;
            course.CaoTypeId = entity.CaoTypeId;
            course.Recurrent = entity.Recurrent;
            course.Interval = entity.Interval;
            course.CalanderTypeId = entity.CalanderTypeId;
            course.IsInside = entity.IsInside;
            course.Quarantine = entity.Quarantine;
            course.DateStartPractical = entity.DateStartPractical;
            course.DateEndPractical = entity.DateEndPractical;
            course.DateStartPracticalP = entity.DateStartPracticalP;
            course.DateEndPracticalP = entity.DateEndPracticalP;
            course.DurationPractical = entity.DurationPractical;
            course.DurationPracticalUnitId = entity.DurationPracticalUnitId;
            course.IsGeneral = entity.IsGeneral;
            course.CustomerId = entity.CustomerId;
            course.No = entity.No;
            course.IsNotificationEnabled = entity.IsNotificationEnabled;
        }

        //public static void FillDto<TEntity, TDto>(TEntity entity,TDto course) where TEntity  : class where TDto :class
        //{
        //    JsonSerializerSettings settings = new JsonSerializerSettings();

        //    settings.PreserveReferencesHandling = PreserveReferencesHandling.None;
        //    settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        //    settings.Formatting = Formatting.Indented;

        //    // Do the serialization and output to the console
        //    string json = JsonConvert.SerializeObject(entity, settings);
        //    course = JsonConvert.DeserializeObject<TDto>(json);

        //}
    }
    public class ActiveCourseSummary
    {
        public Nullable<int> Total { get; set; }
        public Nullable<int> Pending { get; set; }
        public Nullable<int> Registered { get; set; }
        public Nullable<int> Attended { get; set; }
        public Nullable<int> Canceled { get; set; }
        public Nullable<int> Failed { get; set; }
        public Nullable<int> Passed { get; set; }
    }
    public class ActiveCourse
    {
        public int Id { get; set; }
        public string No { get; set; }
        public Nullable<bool> IsNotificationEnabled { get; set; }
        public int CourseTypeId { get; set; }
        public System.DateTime DateStart { get; set; }
        public Nullable<decimal> DateStartP { get; set; }
        public Nullable<System.DateTime> DateEnd { get; set; }
        public Nullable<decimal> DateEndP { get; set; }
        public string Instructor { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public Nullable<int> OrganizationId { get; set; }
        public Nullable<int> Duration { get; set; }
        public Nullable<int> DurationUnitId { get; set; }
        public Nullable<int> StatusId { get; set; }
        public string Remark { get; set; }
        public Nullable<int> Capacity { get; set; }
        public Nullable<int> Tuition { get; set; }
        public Nullable<int> CurrencyId { get; set; }
        public Nullable<System.DateTime> DateDeadlineRegistration { get; set; }
        public Nullable<decimal> DateDeadlineRegistrationP { get; set; }
        public string TrainingDirector { get; set; }
        public string Title { get; set; }
        public Nullable<int> AircraftTypeId { get; set; }
        public Nullable<int> AircraftModelId { get; set; }
        public Nullable<int> CaoTypeId { get; set; }
        public Nullable<bool> Recurrent { get; set; }
        public Nullable<int> Interval { get; set; }
        public Nullable<int> CalanderTypeId { get; set; }
        public Nullable<bool> IsInside { get; set; }
        public Nullable<bool> Quarantine { get; set; }
        public Nullable<System.DateTime> DateStartPractical { get; set; }
        public Nullable<System.DateTime> DateEndPractical { get; set; }
        public Nullable<decimal> DateStartPracticalP { get; set; }
        public Nullable<decimal> DateEndPracticalP { get; set; }
        public Nullable<int> DurationPractical { get; set; }
        public Nullable<int> DurationPracticalUnitId { get; set; }
        public Nullable<int> CT_CalendarTypeId { get; set; }
        public string CT_Title { get; set; }
        public Nullable<int> CT_LicenseResultBasicId { get; set; }
        public string CT_Remark { get; set; }
        public Nullable<int> CT_CourseCategoryId { get; set; }
        public Nullable<int> CT_Interval { get; set; }
        public Nullable<bool> CT_IsGeneral { get; set; }
        public Nullable<bool> CT_Status { get; set; }
        public Nullable<int> CT_Id { get; set; }
        public string CC_Title { get; set; }
        public string CaoTypeTitle { get; set; }
        public string CaoTypeRemark { get; set; }
        public string Organization { get; set; }
        public string DurationUnit { get; set; }
        public string Duration2 { get; set; }
        public string Status { get; set; }
        public string Currency { get; set; }
        public string AircraftType { get; set; }
        public string Manufacturer { get; set; }
        public Nullable<int> ManufacturerId { get; set; }
        public string AircraftModel { get; set; }
        public string CalendarType { get; set; }
        public string DurationPracticalUnit { get; set; }
        public Nullable<int> Remain { get; set; }
        public Nullable<System.DateTime> ExpireDate { get; set; }
        public Nullable<bool> IsGeneral { get; set; }
        public Nullable<int> CustomerId { get; set; }
        public Nullable<int> RemainRegistration { get; set; }
        public Nullable<int> Total { get; set; }
        public Nullable<int> Pending { get; set; }
        public Nullable<int> Registered { get; set; }
        public Nullable<int> Attended { get; set; }
        public Nullable<int> Canceled { get; set; }
        public Nullable<int> Failed { get; set; }
        public Nullable<int> Passed { get; set; }
        public static void FillDto(Models.ViewCourseNotificationEnabled entity, ViewModels.ActiveCourse activeCourse)
        {
            activeCourse.Id = entity.Id;
            activeCourse.No = entity.No;
            activeCourse.IsNotificationEnabled = entity.IsNotificationEnabled;
            activeCourse.CourseTypeId = entity.CourseTypeId;
            activeCourse.DateStart = entity.DateStart;
            activeCourse.DateStartP = entity.DateStartP;
            activeCourse.DateEnd = entity.DateEnd;
            activeCourse.DateEndP = entity.DateEndP;
            activeCourse.Instructor = entity.Instructor;
            activeCourse.Location = entity.Location;
            activeCourse.Department = entity.Department;
            activeCourse.OrganizationId = entity.OrganizationId;
            activeCourse.Duration = entity.Duration;
            activeCourse.DurationUnitId = entity.DurationUnitId;
            activeCourse.StatusId = entity.StatusId;
            activeCourse.Remark = entity.Remark;
            activeCourse.Capacity = entity.Capacity;
            activeCourse.Tuition = entity.Tuition;
            activeCourse.CurrencyId = entity.CurrencyId;
            activeCourse.DateDeadlineRegistration = entity.DateDeadlineRegistration;
            activeCourse.DateDeadlineRegistrationP = entity.DateDeadlineRegistrationP;
            activeCourse.TrainingDirector = entity.TrainingDirector;
            activeCourse.Title = entity.Title;
            activeCourse.AircraftTypeId = entity.AircraftTypeId;
            activeCourse.AircraftModelId = entity.AircraftModelId;
            activeCourse.CaoTypeId = entity.CaoTypeId;
            activeCourse.Recurrent = entity.Recurrent;
            activeCourse.Interval = entity.Interval;
            activeCourse.CalanderTypeId = entity.CalanderTypeId;
            activeCourse.IsInside = entity.IsInside;
            activeCourse.Quarantine = entity.Quarantine;
            activeCourse.DateStartPractical = entity.DateStartPractical;
            activeCourse.DateEndPractical = entity.DateEndPractical;
            activeCourse.DateStartPracticalP = entity.DateStartPracticalP;
            activeCourse.DateEndPracticalP = entity.DateEndPracticalP;
            activeCourse.DurationPractical = entity.DurationPractical;
            activeCourse.DurationPracticalUnitId = entity.DurationPracticalUnitId;
            activeCourse.CT_CalendarTypeId = entity.CT_CalendarTypeId;
            activeCourse.CT_Title = entity.CT_Title;
            activeCourse.CT_LicenseResultBasicId = entity.CT_LicenseResultBasicId;
            activeCourse.CT_Remark = entity.CT_Remark;
            activeCourse.CT_CourseCategoryId = entity.CT_CourseCategoryId;
            activeCourse.CT_Interval = entity.CT_Interval;
            activeCourse.CT_IsGeneral = entity.CT_IsGeneral;
            activeCourse.CT_Status = entity.CT_Status;
            activeCourse.CT_Id = entity.CT_Id;
            activeCourse.CC_Title = entity.CC_Title;
            activeCourse.CaoTypeTitle = entity.CaoTypeTitle;
            activeCourse.CaoTypeRemark = entity.CaoTypeRemark;
            activeCourse.Organization = entity.Organization;
            activeCourse.DurationUnit = entity.DurationUnit;
            activeCourse.Duration2 = entity.Duration2;
            activeCourse.Status = entity.Status;
            activeCourse.Currency = entity.Currency;
            activeCourse.AircraftType = entity.AircraftType;
            activeCourse.Manufacturer = entity.Manufacturer;
            activeCourse.ManufacturerId = entity.ManufacturerId;
            activeCourse.AircraftModel = entity.AircraftModel;
            activeCourse.CalendarType = entity.CalendarType;
            activeCourse.DurationPracticalUnit = entity.DurationPracticalUnit;
            activeCourse.Remain = entity.Remain;
            activeCourse.ExpireDate = entity.ExpireDate;
            activeCourse.IsGeneral = entity.IsGeneral;
            activeCourse.CustomerId = entity.CustomerId;
            activeCourse.RemainRegistration = entity.RemainRegistration;
            activeCourse.Total = entity.Total;
            activeCourse.Pending = entity.Pending;
            activeCourse.Registered = entity.Registered;
            activeCourse.Attended = entity.Attended;
            activeCourse.Canceled = entity.Canceled;
            activeCourse.Failed = entity.Failed;
            activeCourse.Passed = entity.Passed;
        }

        List<Models.ViewApplicableCoursePerson> applicablePeople = null;
        public List<Models.ViewApplicableCoursePerson> ApplicablePeople
        {
            get
            {
                if (applicablePeople == null)
                    applicablePeople = new List<Models.ViewApplicableCoursePerson>();
                return applicablePeople;
            }
            set { applicablePeople = value; }

        }


    }

    public class CoursePersonId
    {
        public int CourseId { get; set; }
        public int PersonId { get; set; }
    }
    public class ActiveCourseStatus
    {
        public int CourseId { get; set; }
        public bool Email { get; set; }
        public bool SMS { get; set; }
        public bool AppNotification { get; set; }
        public int StatusId { get; set; }

        public string OldStatus { get; set; }
        public string No { get; set; }
        public DateTime? IssueDate { get; set; }

        public string Remark { get; set; }
        public List<int> People { get; set; }
    }

    public class Certificate
    {
        public string CourseTitle { get; set; }
        public int Id { get; set; }
        public int CourseId { get; set; }

        public int PersonId { get; set; }

        public Nullable<System.DateTime> DateIssue { get; set; }
        public DateTime? DateExpire { get; set; }
        public string No { get; set; }

        public int CourseTypeId { get; set; }
        public static void Fill(Models.PersonCourse entity, ViewModels.Certificate certificate)
        {
            entity.Id = certificate.Id;
            entity.PersonId = certificate.PersonId;
            entity.CourseId = certificate.CourseId;
            entity.DateIssue = certificate.DateIssue;
            entity.DateExpire = certificate.DateExpire;
            entity.CerNumber = certificate.No;
            entity.StatusId = 71;
        }
    }
}