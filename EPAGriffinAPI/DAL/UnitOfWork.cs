using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace EPAGriffinAPI.DAL
{
    public class UnitOfWork : IDisposable
    {
        public EPAGRIFFINEntities context = null;
        public UnitOfWork()
        {
            context = new EPAGRIFFINEntities();
            context.Configuration.LazyLoadingEnabled = false;
        }

        private GenericRepository<ViewCity> viewCityRepository;
        private GenericRepository<ViewCaoType> viewCaoTypeRepository;
        private GenericRepository<Organization> viewOrganizationRepository;
        private GenericRepository<Currency> viewCurrencyRepository;
        private GenericRepository<ViewJobGroup> viewJobGroupRepository;
        private GenericRepository<ViewJobGroupType> viewJobGroupTypeRepository;
        private GenericRepository<ViewLibraryFolder> viewLibraryFolderRepository;
        private CourseTypeRepository courseTypeRepository;
       



        private AirportRepository airportRepository;
        private AircraftTypeRepository aircraftTypeRepository;
        private LocationRepository locationRepository;
        private PersonRepository personRepository;
        private CourseRepository courseRepository;
        private PersonCourseRepository personCourseRepository;



        private JournalRepository journalRepository;
        public JournalRepository JournalRepository
        {
            get
            {

                if (this.journalRepository == null)
                {
                    this.journalRepository = new JournalRepository(context);
                }
                return journalRepository;
            }
        }

        private NotificationRepository notificationRepository;
        public NotificationRepository NotificationRepository
        {
            get
            {

                if (this.notificationRepository == null)
                {
                    this.notificationRepository = new NotificationRepository(context);
                }
                return notificationRepository;
            }
        }

        private MSNRepository mSNRepository;
        public MSNRepository MSNRepository
        {
            get
            {

                if (this.mSNRepository == null)
                {
                    this.mSNRepository = new MSNRepository(context);
                }
                return mSNRepository;
            }
        }

        private FlightRepository flightRepository;
        public FlightRepository FlightRepository
        {
            get
            {

                if (this.flightRepository == null)
                {
                    this.flightRepository = new FlightRepository(context);
                }
                return flightRepository;
            }
        }



        private BookRepository bookRepository;
        public BookRepository BookRepository
        {
            get
            {

                if (this.bookRepository == null)
                {
                    this.bookRepository = new BookRepository(context);
                }
                return bookRepository;
            }
        }

        private UserActivityRepository userActivityRepository;
        public UserActivityRepository UserActivityRepository
        {
            get
            {

                if (this.userActivityRepository == null)
                {
                    this.userActivityRepository = new UserActivityRepository(context);
                }
                return userActivityRepository;
            }
        }

        private DashboardRepository dashboardRepository;
        public DashboardRepository DashboardRepository
        {
            get
            {

                if (this.dashboardRepository == null)
                {
                    this.dashboardRepository = new DashboardRepository(context);
                }
                return dashboardRepository;
            }
        }

        private JobgroupRepository jobgroupRepository;
        public JobgroupRepository JobgroupRepository
        {
            get
            {

                if (this.jobgroupRepository == null)
                {
                    this.jobgroupRepository = new JobgroupRepository(context);
                }
                return jobgroupRepository;
            }
        }

        private LibraryFolderRepository libraryFolderRepository;
        public LibraryFolderRepository LibraryFolderRepository
        {
            get
            {

                if (this.libraryFolderRepository == null)
                {
                    this.libraryFolderRepository = new LibraryFolderRepository(context);
                }
                return libraryFolderRepository;
            }
        }

        private BookChapterRepository bookChapterRepository;
        public BookChapterRepository BookChapterRepository
        {
            get
            {

                if (this.bookChapterRepository == null)
                {
                    this.bookChapterRepository = new BookChapterRepository(context);
                }
                return bookChapterRepository;
            }
        }

        private OrganizationRepository organizationRepository;
        public OrganizationRepository OrganizationRepository
        {
            get
            {

                if (this.organizationRepository == null)
                {
                    this.organizationRepository = new OrganizationRepository(context);
                }
                return organizationRepository;
            }
        }


        private PersonMiscRepository personMiscRepository;
        public PersonMiscRepository PersonMiscRepository
        {
            get
            {

                if (this.personMiscRepository == null)
                {
                    this.personMiscRepository = new PersonMiscRepository(context);
                }
                return personMiscRepository;
            }
        }


        private OptionRepository optionRepository;
        public OptionRepository OptionRepository
        {
            get
            {

                if (this.optionRepository == null)
                {
                    this.optionRepository = new OptionRepository(context);
                }
                return optionRepository;
            }
        }

        public CourseTypeRepository CourseTypeRepository
        {
            get
            {

                if (this.courseTypeRepository == null)
                {
                    this.courseTypeRepository = new CourseTypeRepository(context);
                }
                return courseTypeRepository;
            }
        }
        public GenericRepository<ViewCity> ViewCityRepository
        {
            get
            {

                if (this.viewCityRepository == null)
                {
                    this.viewCityRepository = new GenericRepository<ViewCity>(context);
                }
                return viewCityRepository;
            }
        }

        private GenericRepository<Country> countryRepository;
        public GenericRepository<Country> CountryRepository
        {
            get
            {

                if (this.countryRepository == null)
                {
                    this.countryRepository = new GenericRepository<Country>(context);
                }
                return countryRepository;
            }
        }


        private GenericRepository<ViewStudyField> studyFieldRepository;
        public GenericRepository<ViewStudyField> StudyFieldRepository
        {
            get
            {

                if (this.studyFieldRepository == null)
                {
                    this.studyFieldRepository = new GenericRepository<ViewStudyField>(context);
                }
                return studyFieldRepository;
            }
        }


        private GenericRepository<ViewPost> postRepository;
        public GenericRepository<ViewPost> PostRepository
        {
            get
            {

                if (this.postRepository == null)
                {
                    this.postRepository = new GenericRepository<ViewPost>(context);
                }
                return postRepository;
            }
        }




        public GenericRepository<ViewCaoType> ViewCaoTypeRepository
        {
            get
            {

                if (this.viewCaoTypeRepository == null)
                {
                    this.viewCaoTypeRepository = new GenericRepository<ViewCaoType>(context);
                }
                return viewCaoTypeRepository;
            }
        }
        public GenericRepository<Organization> ViewOrganizationRepository
        {
            get
            {
               
                if (this.viewOrganizationRepository == null)
                {
                    this.viewOrganizationRepository = new GenericRepository<Organization>(context);
                }
                return viewOrganizationRepository;
            }
        }
        public GenericRepository<ViewJobGroup> ViewJobGroupRepository
        {
            get
            {

                if (this.viewJobGroupRepository == null)
                {
                    this.viewJobGroupRepository = new GenericRepository<ViewJobGroup>(context);
                }
                return viewJobGroupRepository;
            }
        }

        public GenericRepository<ViewJobGroupType> ViewJobGroupTypeRepository
        {
            get
            {

                if (this.viewJobGroupTypeRepository == null)
                {
                    this.viewJobGroupTypeRepository = new GenericRepository<ViewJobGroupType>(context);
                }
                return viewJobGroupTypeRepository;
            }
        }

        public GenericRepository<ViewLibraryFolder> ViewLibraryFolderRepository
        {
            get
            {

                if (this.viewLibraryFolderRepository == null)
                {
                    this.viewLibraryFolderRepository = new GenericRepository<ViewLibraryFolder>(context);
                }
                return viewLibraryFolderRepository;
            }
        }
        private GenericRepository<ViewFolderApplicable> viewFolderApplicableRepository;
        public GenericRepository<ViewFolderApplicable> ViewFolderApplicableRepository
        {
            get
            {

                if (this.viewFolderApplicableRepository == null)
                {
                    this.viewFolderApplicableRepository = new GenericRepository<ViewFolderApplicable>(context);
                }
                return viewFolderApplicableRepository;
            }
        }
        public GenericRepository<Currency> ViewCurrencyRepository
        {
            get
            {

                if (this.viewCurrencyRepository == null)
                {
                    this.viewCurrencyRepository = new GenericRepository<Currency>(context);
                }
                return viewCurrencyRepository;
            }
        }

        public AirportRepository AirportRepository
        {
            get
            {

                if (this.airportRepository == null)
                {
                    this.airportRepository = new AirportRepository(context);
                }
                return airportRepository;
            }
        }
        public LocationRepository LocationRepository
        {
            get
            {

                if (this.locationRepository == null)
                {
                    this.locationRepository = new LocationRepository(context);
                }
                return locationRepository;
            }
        }

        public PersonRepository PersonRepository
        {
            get
            {

                if (this.personRepository == null)
                {
                    this.personRepository = new PersonRepository(context);
                }
                return personRepository;
            }
        }

        public CourseRepository CourseRepository
        {
            get
            {

                if (this.courseRepository == null)
                {
                    this.courseRepository = new CourseRepository(context);
                }
                return courseRepository;
            }
        }

        public PersonCourseRepository PersonCourseRepository
        {
            get
            {

                if (this.personCourseRepository == null)
                {
                    this.personCourseRepository = new PersonCourseRepository(context);
                }
                return personCourseRepository;
            }
        }

        public AircraftTypeRepository AircraftTypeRepository
        {
            get
            {

                if (this.aircraftTypeRepository == null)
                {
                    this.aircraftTypeRepository = new AircraftTypeRepository(context);
                }
                return aircraftTypeRepository;
            }
        }

        public async Task<CustomActionResult> SaveAsync()
        {
            // context.SaveChanges();
            var result = await context.SaveAsync();
            return result;
        }

        public int Save()
        {
            // context.SaveChanges();
            var result =  context.SaveChanges();
            return result;
        }

        public CustomActionResult SaveActionResult()
        {
            // context.SaveChanges();
            var result = context.SaveActionResult();
            return result;
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}