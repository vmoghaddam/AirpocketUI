using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using System.Net.Http;
using System.Web.Http;

namespace EPAGriffinAPI.DAL
{
    public class PersonRepository : GenericRepository<Person>
    {
        public PersonRepository(EPAGRIFFINEntities context)
         : base(context)
        {
        }
        public IQueryable<ViewIPAccess> GetViewIPAccess()
        {
            return this.GetQuery<ViewIPAccess>();
        }
        public IQueryable<AspNetUser> GetAspNetUsers()
        {
            return this.GetQuery<AspNetUser>();
        }
        public virtual async Task<Person> GetPersonByNID(string nid)
        {
            return await dbSet.FirstOrDefaultAsync(q => q.NID == nid);
        }
        public virtual async Task<MatchingList> GetMatchingListById(int id)
        {
            return await this.context.MatchingLists.FirstOrDefaultAsync(q=>q.Id==id);
        }
        public void Delete (MatchingList entity)
        {
            this.context.MatchingLists.Remove(entity);
        }
        public virtual async Task<Person> GetPersonById(int id)
        {
            return await dbSet.FirstOrDefaultAsync(q => q.Id == id);
        }
        public virtual void Insert(Models.MatchingList entity)
        {
            this.context.MatchingLists.Add(entity);
        }
        public virtual void Insert(Models.UserExt entity)
        {
            this.context.UserExts.Add(entity);
        }
        public virtual void InsertStation(string id, string stn)
        {
            //this.context.UserExts.Add(entity);
            this.context.Database.ExecuteSqlCommand(
                      "UPDATE UserExt SET Station = '"+stn+"' WHERE Id = '"+id+"'");
        }

        public virtual string GetStation(string id )
        {
            

            var stn_ds = context.Database.SqlQuery<string>(
                       "SELECT Station FROM  UserExt Where Id='"+id+"'").ToList();
            if (stn_ds != null && stn_ds.Count > 0)
                return stn_ds.First();
            else
                return "";
        }
        //public virtual void Insert(Models.aspuser entity)
        //{
        //    this.context.UserExts.Add(entity);
        //}
        public virtual async Task<PersonCustomer> GetPersonCustomer(int cid, int pid)
        {
            return await this.context.PersonCustomers.FirstOrDefaultAsync(q => q.CustomerId == cid && q.PersonId == pid);
        }
        public virtual async Task<Employee> GetEmployee(int eid)
        {
            return await this.context.Employees.FirstOrDefaultAsync(q => q.Id == eid);
        }
        public string GetEmployeeGroupCode(int id)
        {
            var emp = this.context.ViewEmployees.FirstOrDefault(q => q.Id == id).JobGroupCode;
            
            return emp ;
        }
        public IQueryable<ViewMatchingList> GetViewMatchingList()
        {
            return this.GetQuery<ViewMatchingList>();
        }
        public virtual async Task<ViewEmployee> GetViewEmployeesByUserId(string userid, int cid)
        {
            return await this.context.ViewEmployees.FirstOrDefaultAsync(q => q.UserId == userid && q.CustomerId == cid);
        }
        public virtual async Task<ViewEmployee> GetViewEmployeesByUserId(string userid )
        {
            return await this.context.ViewEmployees.FirstOrDefaultAsync(q => q.UserId == userid  );
        }
        public IQueryable<ViewEmployee> GetETEST()
        {
            return this.GetQuery<ViewEmployee>();
        }
        public virtual async Task<ViewEmployee> GetViewEmployeesTEST(int id)
        {
            return await this.context.ViewEmployees.FirstOrDefaultAsync(q => q.Id == id);
        }
        public virtual async Task<bool> HasAcType(int pid)
        {
            return await this.context.Certifications.Where(q => q.PersonId == pid && q.TypeId == 5007).CountAsync() > 0;
        }


        public IQueryable<AspNetRoleClaim> GetRoleClaims(  )
        {
            return    this.GetQuery<AspNetRoleClaim>();
        }

       

        public IQueryable<ViewEmployee> GetViewEmployees()
        {
            return this.GetQuery<ViewEmployee>();
        }

        public IQueryable<ViewEmployeeACType> GetViewEmployeeACTypes()
        {
            return this.GetQuery<ViewEmployeeACType>();
        }
        public IQueryable<ViewUser> GetViewUsers()
        {
            return this.GetQuery<ViewUser>();
        }
        public IQueryable<ViewRole> GetViewRoles()
        {
            return this.GetQuery<ViewRole>();
        }
        public IQueryable<ViewUserRoleClaim> GetViewUserRoleClaim()
        {
            return this.GetQuery<ViewUserRoleClaim>();
        }
        public IQueryable<ViewRoleClaim> GetViewRoleClaim()
        {
            return this.GetQuery<ViewRoleClaim>();
        }
        public IQueryable<ViewClaim> GetViewClaim()
        {
            return this.GetQuery<ViewClaim>();
        }
        public IQueryable<ViewUserRole> GetViewUserRoles()
        {
            return this.GetQuery<ViewUserRole>();
        }

        public IQueryable<ViewIdeaLast> GetViewIdeaLast()
        {
            return this.GetQuery<ViewIdeaLast>();
        }
        public IQueryable<ViewEmployeeLight> GetViewEmployeesLight()
        {
            return this.GetQuery<ViewEmployeeLight>();
        }
        public IQueryable<ViewCrew> GetViewCrews()
        {
            return this.GetQuery<ViewCrew>();
        }

        public IQueryable<ViewCertification> GetViewCertifications()
        {
            return this.GetQuery<ViewCertification>();
        }

        public IQueryable<ViewPersonAircraftType> GetViewPersonAircraftType()
        {
            return this.GetQuery<ViewPersonAircraftType>();
        }

        //internal async Task<bool> AddRole (string name)
        //{
        //    AspNetRole role = new AspNetRole() { Id = Guid.NewGuid().ToString() };
        //    role.Name = name;
            
        //    this.context.AspNetRoles.Add(role);
        //}


        internal async Task<bool> UpdateUser(dynamic dto )
        {
            var email = Convert.ToString(dto.Email);
            var password = Convert.ToString(dto.Password);
            var userName = Convert.ToString(dto.UserName);
            var fn = Convert.ToString(dto.FirstName);
            var ln = Convert.ToString(dto.LastName);
            string Id = Convert.ToString(dto.Id);

         //   var user = await this.context.AspNetUsers.FirstOrDefaultAsync(q => q.Id == Id);
          //  user.UserName = userName;
          //  user.Email = email;
            var userExt = await this.context.UserExts.FirstOrDefaultAsync(q => q.Id == Id);
            if (userExt==null)
            {
                userExt = new UserExt();
                userExt.Id = Id;
                this.context.UserExts.Add(userExt);
            }
            userExt.FirstName = fn;
            userExt.LastName = ln;

            return true;


        }


        internal async Task<bool> UpdateUserId(int id,string userid)
        {
            
            var person = await this.context.People.FirstOrDefaultAsync(q => q.Id == id);
            person.UserId = userid;

            return true;


        }

        internal async Task<CustomActionResult> DeleteCertification(int Id)
        {
            var certification = await this.context.Certifications.FirstOrDefaultAsync(q => q.Id == Id);
            if (certification != null)
                this.context.Certifications.Remove(certification);
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        internal async Task<CustomActionResult> SaveCertification(Certification dto)
        {
            var exist= await this.context.Certifications.FirstOrDefaultAsync(q => q.TypeId == dto.TypeId && q.EmployeeId == dto.EmployeeId && q.Id!=dto.Id);
            
            if (exist != null && exist.TypeId!=5007)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, "This type of certificate already exists.");
            Certification entity = null;
            if (dto.Id==-1)
            {
                entity = new Certification();
                this.context.Certifications.Add(entity);
            }
            else
                entity= await this.context.Certifications.FirstOrDefaultAsync(q => q.Id==dto.Id);
            entity.Level = dto.Level;
            entity.Limitation = dto.Limitation;
            entity.Occupation = dto.Occupation;
            entity.PersonId = dto.PersonId;
            entity.Rating = dto.Rating;
            entity.TypeId = dto.TypeId;
            entity.TypeTitle = dto.TypeTitle;
            entity.AcTypeId = dto.AcTypeId;
            entity.AirPocket = dto.AirPocket;
            entity.Class = dto.Class;
            entity.DateExpire = dto.DateExpire == null ? null :(Nullable<DateTime>) ((DateTime)dto.DateExpire).Date;
            entity.DateIRValid = dto.DateIRValid == null ? null : (Nullable<DateTime>)((DateTime)dto.DateIRValid).Date;
            entity.DateIssue = dto.DateIssue == null ? null : (Nullable<DateTime>)((DateTime)dto.DateIssue).Date;
            entity.Description = dto.Description;
            entity.EmployedBy = dto.EmployedBy;
            entity.EmployedById = dto.EmployedById;
            entity.EmployeeId = dto.EmployeeId;
            entity.Title = dto.Title;
            entity.No = dto.No;
            return new CustomActionResult(HttpStatusCode.OK, "");

        }

        internal async Task<ViewModels.Employee> GetEmployeeDtoByNID(string nid, int cid)
        {
            ViewModels.Employee employee = null;
            var entity = await this.context.People.SingleOrDefaultAsync(q => q.NID == nid && !q.IsDeleted);
            if (entity == null)
                return null;
            employee = new ViewModels.Employee();
            employee.Person = new ViewModels.Person();
            ViewModels.Person.FillDto(entity, employee.Person);
            var actypes = await context.ViewPersonAircraftTypes.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.AircraftTypes = ViewModels.PersonAircraftType.GetDtos(actypes);
            var educations = await context.ViewPersonEducations.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Educations = ViewModels.PersonEducation.GetDtos(educations);
            var exp = await context.ViewPersonExperienses.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Expreienses = ViewModels.PersonExperiense.GetDtos(exp);
            var rating = await context.ViewPersonRatings.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Ratings = ViewModels.PersonRating.GetDtos(rating);
            var doc = await context.ViewPersonDocuments.Where(q => q.PersonId == entity.Id).ToListAsync();
            var docIds = doc.Select(q => q.Id).ToList();
            var files = await context.ViewPersonDocumentFiles.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Documents = ViewModels.PersonDocument.GetDtos(doc, files);
            var certificates = await this.context.ViewCertificates.Where(q => q.PersonId == entity.Id && q.IsLast == 1).OrderBy(q => q.ExpireStatus).ThenBy(q => q.Remain).ToListAsync();
            employee.Person.Certificates = certificates;
            var pc = context.PersonCustomers.SingleOrDefault(q => q.CustomerId == cid && q.PersonId == entity.Id && !q.IsDeleted);

            if (pc != null)
            {
                var emp = await context.Employees.FirstOrDefaultAsync(q => q.Id == pc.Id);
                if (emp != null)
                {
                    employee.CustomerId = cid;
                    employee.DateActiveEnd = pc.DateActiveEnd;
                    employee.DateActiveStart = pc.DateActiveStart;
                    employee.DateJoinCompany = pc.DateJoinCompany;
                    employee.DateJoinCompanyP = pc.DateJoinCompanyP;
                    employee.DateConfirmedP = pc.DateConfirmedP;
                    employee.DateConfirmed = pc.DateConfirmed;
                    employee.DateLastLogin = pc.DateLastLogin;
                    employee.DateLastLoginP = pc.DateLastLoginP;
                    employee.DateRegister = pc.DateRegister;
                    employee.DateRegisterP = pc.DateRegisterP;
                    employee.Id = pc.Id;
                    employee.IsActive = pc.IsActive;
                    employee.Password = pc.Password;
                    employee.PersonId = entity.Id;
                    employee.GroupId = pc.GroupId;
                    employee.PID = emp.PID;
                    employee.Phone = emp.Phone;
                    employee.BaseAirportId = emp.BaseAirportId;
                    employee.DateInactiveBegin = emp.DateInactiveBegin;
                    employee.DateInactiveEnd = emp.DateInactiveEnd;
                    employee.InActive = emp.InActive;
                    var locs = await context.ViewEmployeeLocations.Where(q => q.EmployeeId == pc.Id).ToListAsync();
                    employee.Locations = ViewModels.EmployeeLocation.GetDtos(locs);


                }


            }



            return employee;
        }

        internal async Task<ViewModels.Employee> GetEmployeeViewDtoByNID(string nid, int cid)
        {
            ViewModels.Employee employee = null;
            var entity = await this.context.People.SingleOrDefaultAsync(q => q.NID == nid && !q.IsDeleted);
            if (entity == null)
                return null;
            employee = new ViewModels.Employee();
            employee.Person = new ViewModels.Person();
            ViewModels.Person.FillDto(entity, employee.Person);
            var actypes = await context.ViewPersonAircraftTypes.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.AircraftTypes = ViewModels.PersonAircraftType.GetDtos(actypes);
            var educations = await context.ViewPersonEducations.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Educations = ViewModels.PersonEducation.GetDtos(educations);
            var exp = await context.ViewPersonExperienses.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Expreienses = ViewModels.PersonExperiense.GetDtos(exp);
            var rating = await context.ViewPersonRatings.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Ratings = ViewModels.PersonRating.GetDtos(rating);
            var doc = await context.ViewPersonDocuments.Where(q => q.PersonId == entity.Id).ToListAsync();
            var docIds = doc.Select(q => q.Id).ToList();
            var files = await context.ViewPersonDocumentFiles.Where(q => q.PersonId == entity.Id).ToListAsync();
            employee.Person.Documents = ViewModels.PersonDocument.GetDtos(doc, files);


            var certificates=await this.context.ViewCertificates.Where(q => q.PersonId == entity.Id && q.IsLast == 1).OrderBy(q => q.ExpireStatus).ThenBy(q => q.Remain).ToListAsync();
            employee.Person.Certificates = certificates;

            var courses = await this.context.ViewPersonActiveCourses.Where(q => q.PersonId == entity.Id).OrderBy(q => q.StatusId).ToListAsync();
            employee.Person.Courses = courses;


            var pc = context.PersonCustomers.SingleOrDefault(q => q.CustomerId == cid && q.PersonId == entity.Id && !q.IsDeleted);

            if (pc != null)
            {
                var emp = await context.Employees.FirstOrDefaultAsync(q => q.Id == pc.Id);
                if (emp != null)
                {
                    employee.CustomerId = cid;
                    employee.DateActiveEnd = pc.DateActiveEnd;
                    employee.DateActiveStart = pc.DateActiveStart;
                    employee.DateJoinCompany = pc.DateJoinCompany;
                    employee.DateJoinCompanyP = pc.DateJoinCompanyP;
                    employee.DateConfirmedP = pc.DateConfirmedP;
                    employee.DateConfirmed = pc.DateConfirmed;
                    employee.DateLastLogin = pc.DateLastLogin;
                    employee.DateLastLoginP = pc.DateLastLoginP;
                    employee.DateRegister = pc.DateRegister;
                    employee.DateRegisterP = pc.DateRegisterP;
                    employee.Id = pc.Id;
                    employee.IsActive = pc.IsActive;
                    employee.Password = pc.Password;
                    employee.PersonId = entity.Id;
                    employee.GroupId = pc.GroupId;
                    employee.PID = emp.PID;
                    employee.Phone = emp.Phone;
                    employee.BaseAirportId = emp.BaseAirportId;
                    employee.DateInactiveBegin = emp.DateInactiveBegin;
                    employee.DateInactiveEnd = emp.DateInactiveEnd;
                    var locs = await context.ViewEmployeeLocations.Where(q => q.EmployeeId == pc.Id).ToListAsync();
                    employee.Locations = ViewModels.EmployeeLocation.GetDtos(locs);


                }


            }



            return employee;
        }


        internal async Task<object> GetEmployeeDtoByID(int id)
        {
            var employee = await this.context.ViewEmployees.SingleOrDefaultAsync(q => q.Id == id);
            if (employee == null)
                return null;
            var dto = new
            {
                Employee=employee
            };

            return dto;
            //ViewModels.Employee employee = null;
            //var entity = await this.context.People.SingleOrDefaultAsync(q => q.NID == nid && !q.IsDeleted);
            //if (entity == null)
            //    return null;
            //employee = new ViewModels.Employee();
            //employee.Person = new ViewModels.Person();
            //ViewModels.Person.FillDto(entity, employee.Person);
            //var actypes = await context.ViewPersonAircraftTypes.Where(q => q.PersonId == entity.Id).ToListAsync();
            //employee.Person.AircraftTypes = ViewModels.PersonAircraftType.GetDtos(actypes);
            //var educations = await context.ViewPersonEducations.Where(q => q.PersonId == entity.Id).ToListAsync();
            //employee.Person.Educations = ViewModels.PersonEducation.GetDtos(educations);
            //var exp = await context.ViewPersonExperienses.Where(q => q.PersonId == entity.Id).ToListAsync();
            //employee.Person.Expreienses = ViewModels.PersonExperiense.GetDtos(exp);
            //var rating = await context.ViewPersonRatings.Where(q => q.PersonId == entity.Id).ToListAsync();
            //employee.Person.Ratings = ViewModels.PersonRating.GetDtos(rating);
            //var doc = await context.ViewPersonDocuments.Where(q => q.PersonId == entity.Id).ToListAsync();
            //var docIds = doc.Select(q => q.Id).ToList();
            //var files = await context.ViewPersonDocumentFiles.Where(q => q.PersonId == entity.Id).ToListAsync();
            //employee.Person.Documents = ViewModels.PersonDocument.GetDtos(doc, files);

            //var pc = context.PersonCustomers.SingleOrDefault(q => q.CustomerId == cid && q.PersonId == entity.Id && !q.IsDeleted);

            //if (pc != null)
            //{
            //    var emp = await context.Employees.FirstOrDefaultAsync(q => q.Id == pc.Id);
            //    if (emp != null)
            //    {
            //        employee.CustomerId = cid;
            //        employee.DateActiveEnd = pc.DateActiveEnd;
            //        employee.DateActiveStart = pc.DateActiveStart;
            //        employee.DateJoinCompany = pc.DateJoinCompany;
            //        employee.DateJoinCompanyP = pc.DateJoinCompanyP;
            //        employee.DateConfirmedP = pc.DateConfirmedP;
            //        employee.DateConfirmed = pc.DateConfirmed;
            //        employee.DateLastLogin = pc.DateLastLogin;
            //        employee.DateLastLoginP = pc.DateLastLoginP;
            //        employee.DateRegister = pc.DateRegister;
            //        employee.DateRegisterP = pc.DateRegisterP;
            //        employee.Id = pc.Id;
            //        employee.IsActive = pc.IsActive;
            //        employee.Password = pc.Password;
            //        employee.PersonId = entity.Id;
            //        employee.GroupId = pc.GroupId;
            //        employee.PID = emp.PID;
            //        employee.Phone = emp.Phone;
            //        var locs = await context.ViewEmployeeLocations.Where(q => q.EmployeeId == pc.Id).ToListAsync();
            //        employee.Locations = ViewModels.EmployeeLocation.GetDtos(locs);


            //    }


            //}



             
        }


        internal async Task<CustomActionResult> UpdateAppEmployee(ViewModels.EmployeeAbs dto)
        {
            var employee = await this.context.Employees.FirstOrDefaultAsync(q => q.Id == dto.Id);
            var personCustomer = await this.context.PersonCustomers.FirstOrDefaultAsync(q => q.Id == dto.Id);
            var person = await this.context.People.FirstOrDefaultAsync(q => q.Id == dto.PersonId);

            person.FirstName = dto.FirstName;
            person.LastName = dto.LastName;
            person.NID = dto.NID;
            person.DateBirth = dto.DateBirth;
            person.CityId = dto.CityId;
            person.Address = dto.Address;
            //person.Mobile = dto.Mobile;
            person.Phone1 = dto.Phone1;
            person.Email = dto.Email;
            person.LinkedIn = dto.LinkedIn;
            person.WhatsApp = dto.WhatsApp;
            person.Telegram = dto.Telegram;
            person.SexId = dto.SexId;
            person.PassportNumber = dto.PassportNumber;
            person.DatePassportExpire = dto.DatePassportExpire;
            person.PostalCode = dto.PostalCode;
            employee.BaseAirportId = dto.BaseAirportId;
            personCustomer.GroupId = dto.GroupId;



            return new CustomActionResult(HttpStatusCode.OK, true);
            


        }

        public void ConfirmEmail(string id)
        {
            var user = this.context.AspNetUsers.FirstOrDefault(q => q.Id == id);
            if (user != null)
            {
                user.EmailConfirmed = true;
                this.context.SaveChanges();
            }
        }

        public void FillEmployeeLocations(Employee employee, ViewModels.Employee dto)
        {
            var exists = this.context.EmployeeLocations.Where(q => q.EmployeeId == employee.Id).ToList();
            var dtoLocation = dto.Locations.First();
            if (exists == null || exists.Count == 0)
            {
                employee.EmployeeLocations.Add(new EmployeeLocation()
                {
                    DateActiveEnd = dtoLocation.DateActiveEnd,
                    DateActiveEndP = dtoLocation.DateActiveEnd != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateTimeDigital((DateTime)dtoLocation.DateActiveEnd)) : null,
                    DateActiveStart = dtoLocation.DateActiveStart,
                    DateActiveStartP = dtoLocation.DateActiveStart != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateTimeDigital((DateTime)dtoLocation.DateActiveStart)) : null,
                    IsMainLocation = dtoLocation.IsMainLocation,
                    LocationId = dtoLocation.LocationId,
                    OrgRoleId = dtoLocation.OrgRoleId,
                    Phone = dtoLocation.Phone,
                    Remark = dtoLocation.Remark

                });
            }
            else
            {
                exists[0].DateActiveEnd = dtoLocation.DateActiveEnd;
                exists[0].DateActiveEndP = dtoLocation.DateActiveEnd != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateTimeDigital((DateTime)dtoLocation.DateActiveEnd)) : null;
                exists[0].DateActiveStart = dtoLocation.DateActiveStart;
                exists[0].DateActiveStartP = dtoLocation.DateActiveStart != null ? (Nullable<decimal>)Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateTimeDigital((DateTime)dtoLocation.DateActiveStart)) : null;
                exists[0].IsMainLocation = dtoLocation.IsMainLocation;
                exists[0].LocationId = dtoLocation.LocationId;
                exists[0].OrgRoleId = dtoLocation.OrgRoleId;
                exists[0].Phone = dtoLocation.Phone;
                exists[0].Remark = dtoLocation.Remark;
            }

        }

        public void FillAircraftTypes(Person person, ViewModels.Employee dto)
        {
            var existing = this.context.PersonAircraftTypes.Where(q => q.PersonId == person.Id).ToList();
            var deleted = (from x in existing
                           where dto.Person.AircraftTypes.FirstOrDefault(q => q.Id == x.Id) == null
                           select x).ToList();
            var added = (from x in dto.Person.AircraftTypes
                         where existing.FirstOrDefault(q => q.Id == x.Id) == null
                         select x).ToList();
            var edited = (from x in existing
                          where dto.Person.AircraftTypes.FirstOrDefault(q => q.Id == x.Id) != null
                          select x).ToList();
            foreach (var x in deleted)
                context.PersonAircraftTypes.Remove(x);
            foreach (var x in added)
                context.PersonAircraftTypes.Add(new PersonAircraftType()
                {
                    Person = person,
                    AircraftTypeId = x.AircraftTypeId,
                    IsActive = x.IsActive,
                    Remark = x.Remark,
                    DateLimitBegin = x.DateLimitBegin,
                    DateLimitEnd = x.DateLimitEnd

                });
            foreach (var x in edited)
            {
                var item = dto.Person.AircraftTypes.FirstOrDefault(q => q.Id == x.Id);
                if (item != null)
                {
                    x.AircraftTypeId = item.AircraftTypeId;
                    x.DateLimitBegin = item.DateLimitBegin;
                    x.DateLimitEnd = item.DateLimitEnd;
                    x.IsActive = item.IsActive;
                    x.Remark = item.Remark;

                }
            }
        }
        public void FillEducations(Person person, ViewModels.Employee dto)
        {
            var existing = this.context.PersonEducations.Where(q => q.PersonId == person.Id).ToList();
            var deleted = (from x in existing
                           where dto.Person.Educations.FirstOrDefault(q => q.Id == x.Id) == null
                           select x).ToList();
            var added = (from x in dto.Person.Educations
                         where existing.FirstOrDefault(q => q.Id == x.Id) == null
                         select x).ToList();
            var edited = (from x in existing
                          where dto.Person.Educations.FirstOrDefault(q => q.Id == x.Id) != null
                          select x).ToList();
            foreach (var x in deleted)
                context.PersonEducations.Remove(x);
            foreach (var x in added)
                context.PersonEducations.Add(new PersonEducation()
                {
                    Person = person,
                    Remark = x.Remark,
                    College = x.College,
                    DateCatch = x.DateCatch,
                    EducationDegreeId = x.EducationDegreeId,
                    StudyFieldId = x.StudyFieldId,
                    Title = x.Title,
                     FileTitle=x.FileTitle,
                      FileType=x.FileType,
                       FileUrl=x.FileUrl,
                        SysUrl=x.SysUrl,

                });
            foreach (var x in edited)
            {
                var item = dto.Person.Educations.FirstOrDefault(q => q.Id == x.Id);
                if (item != null)
                {
                    x.College = item.College;
                    x.DateCatch = item.DateCatch;
                    x.EducationDegreeId = item.EducationDegreeId;
                    x.StudyFieldId = item.StudyFieldId;
                    x.Remark = item.Remark;
                    x.FileTitle = item.FileTitle;
                    x.FileType = item.FileType;
                    x.FileUrl = item.FileUrl;
                    x.SysUrl = item.SysUrl;

                }
            }
        }

        public void FillExps(Person person, ViewModels.Employee dto)
        {
            var existing = this.context.PersonExperienses.Where(q => q.PersonId == person.Id).ToList();
            var deleted = (from x in existing
                           where dto.Person.Expreienses.FirstOrDefault(q => q.Id == x.Id) == null
                           select x).ToList();
            var added = (from x in dto.Person.Expreienses
                         where existing.FirstOrDefault(q => q.Id == x.Id) == null
                         select x).ToList();
            var edited = (from x in existing
                          where dto.Person.Expreienses.FirstOrDefault(q => q.Id == x.Id) != null
                          select x).ToList();
            foreach (var x in deleted)
                context.PersonExperienses.Remove(x);
            foreach (var x in added)
                context.PersonExperienses.Add(new PersonExperiense()
                {
                    Person = person,
                    Remark = x.Remark,
                    AircraftTypeId = x.AircraftTypeId,
                    DateEnd = x.DateEnd,
                    DateStart = x.DateStart,
                    Employer = x.Employer,
                    JobTitle = x.JobTitle,
                    Organization = x.Organization,
                    OrganizationId = x.OrganizationId,


                });
            foreach (var x in edited)
            {
                var item = dto.Person.Expreienses.FirstOrDefault(q => q.Id == x.Id);
                if (item != null)
                {
                    x.AircraftTypeId = item.AircraftTypeId;
                    x.DateEnd = item.DateEnd;
                    x.DateStart = item.DateStart;
                    x.Employer = item.Employer;
                    x.JobTitle = item.JobTitle;
                    x.Organization = item.Organization;
                    x.OrganizationId = item.OrganizationId;
                    x.Remark = item.Remark;

                }
            }
        }
        public async Task<bool> ActiveEmployee(int id)
        {
            var emp = await this.context.Employees.FirstOrDefaultAsync(q => q.Id == id);
            if (emp.InActive == null || emp.InActive == false)
                emp.InActive = true;
            else
                emp.InActive = false;
            return true;
        }
        public void FillRatings(Person person, ViewModels.Employee dto)
        {
            var existing = this.context.PersonRatings.Where(q => q.PersonId == person.Id).ToList();
            var deleted = (from x in existing
                           where dto.Person.Ratings.FirstOrDefault(q => q.Id == x.Id) == null
                           select x).ToList();
            var added = (from x in dto.Person.Ratings
                         where existing.FirstOrDefault(q => q.Id == x.Id) == null
                         select x).ToList();
            var edited = (from x in existing
                          where dto.Person.Ratings.FirstOrDefault(q => q.Id == x.Id) != null
                          select x).ToList();
            foreach (var x in deleted)
                context.PersonRatings.Remove(x);
            foreach (var x in added)
                context.PersonRatings.Add(new PersonRating()
                {
                    Person = person,

                    AircraftTypeId = x.AircraftTypeId,

                    OrganizationId = x.OrganizationId,
                    CategoryId = x.CategoryId,
                    DateExpire = x.DateExpire,
                    DateIssue = x.DateIssue,
                    RatingId = x.RatingId,

                });
            foreach (var x in edited)
            {
                var item = dto.Person.Ratings.FirstOrDefault(q => q.Id == x.Id);
                if (item != null)
                {
                    x.AircraftTypeId = item.AircraftTypeId;

                    x.OrganizationId = item.OrganizationId;
                    x.CategoryId = item.CategoryId;
                    x.DateExpire = item.DateExpire;
                    x.DateIssue = item.DateIssue;
                    x.RatingId = item.RatingId;

                }
            }
        }
        public void FillDocuments(Person person, ViewModels.Employee dto)
        {
            var existing = this.context.PersonDocuments.Include("Documents").Where(q => q.PersonId == person.Id).ToList();
            var deleted = (from x in existing
                           where dto.Person.Documents.FirstOrDefault(q => q.Id == x.Id) == null
                           select x).ToList();
            var added = (from x in dto.Person.Documents
                         where existing.FirstOrDefault(q => q.Id == x.Id) == null
                         select x).ToList();
            var edited = (from x in existing
                          where dto.Person.Documents.FirstOrDefault(q => q.Id == x.Id) != null
                          select x).ToList();
            foreach (var x in deleted)
                context.PersonDocuments.Remove(x);
            foreach (var x in added)
            {
                var pd = new PersonDocument()
                {
                    Person = person,

                    Remark = x.Remark,
                    DocumentTypeId = x.DocumentTypeId,
                    Title = x.Title,


                };
                foreach (var file in x.Documents)
                {
                    pd.Documents.Add(new Document()
                    {
                        FileType = file.FileType,
                        FileUrl = file.FileUrl,
                        SysUrl = file.SysUrl,
                        Title = file.Title,

                    });
                }
                context.PersonDocuments.Add(pd);
            }
            foreach (var x in edited)
            {
                var item = dto.Person.Documents.FirstOrDefault(q => q.Id == x.Id);
                if (item != null)
                {
                    x.DocumentTypeId = item.DocumentTypeId;
                    x.Title = item.Title;
                    x.Remark = item.Remark;
                     
                    while (x.Documents.Count > 0)
                    {
                        var f = x.Documents.First();
                        this.context.Documents.Remove(f);
                    }
                    foreach (var f in item.Documents)
                        x.Documents.Add(new Document()
                        {
                            FileType = f.FileType,
                            FileUrl = f.FileUrl,
                            SysUrl = f.SysUrl,
                            Title = f.Title,

                        });
                }
            }
        }

        //internal async Task<CustomActionResult> UpdateByIdea()
        //{
        //    var serviceRecords = HelperTraining.GetIdeaAll();
        //    var people = await this.context.People.ToListAsync();
        //    this.context.Database.CommandTimeout = 160;
        //    var ideaRecords = await this.context.ViewIdeaLasts.ToListAsync();
        //    foreach(var rec in ideaRecords)
        //    {
        //        if (rec.MappedTitle == "CRM")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.UpsetRecoveryTrainingIssueDate = rec.DateIssue;
        //                person.UpsetRecoveryTrainingExpireDate = rec.DateExpire;
        //            }
        //        }
        //        if (rec.MappedTitle == "CCRM")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.CCRMIssueDate = rec.DateIssue;
        //                person.CCRMExpireDate = rec.DateExpire;
        //            }
        //        }
        //        if (rec.MappedTitle == "SMS")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.SMSIssueDate = rec.DateIssue;
        //                person.SMSExpireDate = rec.DateExpire;
        //            }
        //        }
        //        if (rec.MappedTitle == "FIRSTAID")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.FirstAidIssueDate = rec.DateIssue;
        //                person.FirstAidExpireDate = rec.DateExpire;
        //            }
        //        }
        //        if (rec.MappedTitle == "DG")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.DangerousGoodsIssueDate = rec.DateIssue;
        //                person.DangerousGoodsExpireDate = rec.DateExpire;
        //            }
        //        }

        //        if (rec.MappedTitle == "SEPT")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.SEPTIssueDate = rec.DateIssue;
        //                person.SEPTExpireDate = rec.DateExpire;
        //            }
        //        }

        //        if (rec.MappedTitle == "AVSEC")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.AviationSecurityIssueDate = rec.DateIssue;
        //                person.AviationSecurityExpireDate = rec.DateExpire;
        //            }
        //        }

        //        if (rec.MappedTitle == "HOT-WX")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.HotWeatherOperationIssueDate = rec.DateIssue;
        //                person.HotWeatherOperationExpireDate = rec.DateExpire;
        //            }
        //        }

        //        if (rec.MappedTitle == "COLD-WX")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.ColdWeatherOperationIssueDate = rec.DateIssue;
        //                person.ColdWeatherOperationExpireDate = rec.DateExpire;
        //            }
        //        }
        //        //Re/Annual-Re/Cabin
        //        if (rec.MappedTitle == "Re/Annual-Re/Cabin")
        //        {
        //            var person = people.FirstOrDefault(q => q.NID == rec.NID);
        //            if (person != null)
        //            {
        //                person.RecurrentIssueDate = rec.DateIssue;
        //                person.RecurrentExpireDate = rec.DateExpire;
        //            }
        //        }


        //    }
        //    var history = new ThirdPartySyncHistory()
        //    {
        //        App = "IDEA",
        //        DateSync = DateTime.Now,
        //        Remark = serviceRecords.Count + " Records Proccessed.",
        //    };
        //    this.context.ThirdPartySyncHistories.Add(history);

        //    await this.context.SaveChangesAsync();

        //    return new CustomActionResult(HttpStatusCode.OK, history);
        //}


        internal bool SaveIPs(string ips,string users)
        {
           
            var _ips = ips.Split(',').ToList();
            var _users = users.Split('_').ToList();
            foreach(var ip in _ips)
            {
                foreach (var user in _users)
                {
                    var ipacc = new IPAccess()
                    {
                        IP = ip,
                        Role = true,
                        UserId = user,
                    };
                    this.context.IPAccesses.Add(ipacc);
                }
            }
          //  IPHelper.RemoveIPCache();
            return true;
        }

        internal async Task<bool> SaveLogin(string username,string ip)
        {
            try
            {
                var item = new UserLogin()
                {
                    UserName = username,
                    ActionId = 1,
                    DateAction = DateTime.Now,
                    Ip = ip,
                };
                this.context.UserLogins.Add(item);
                await this.context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            

        }

        internal bool DeleteIPs(List<int> ids)
        {
            var _ips = this.context.IPAccesses.Where(q => ids.Contains(q.Id)).ToList();

            this.context.IPAccesses.RemoveRange(_ips);
            //IPHelper.RemoveIPCache();
            return true;
        }


        internal  List<ViewIPAccess>  GetIPAccess()
        {
            var result =  this.context.ViewIPAccesses.ToList ();
            return result;

        }

        internal async Task<object> GetTrainingCard(int id)
        {
            var crew = await this.context.ViewEmployees.Where(q => q.Id==id).FirstOrDefaultAsync();
            var card = new ViewModels.TrainingCard()
            {
                 BirthDate=crew.DateBirth,
                   Name=crew.Name,
                    Rank=crew.JobGroup,
                     Id=crew.Id,
                        IdNo=crew.PID,
                        ImageUrl= "http://fleet.flypersia.aero/airpocket/upload/clientsfiles/"+crew.ImageUrl,
                         NID=crew.NID,


            };
            if (crew.DateBirth != null)
            {
                card.BirthDateStr = ((DateTime)crew.DateBirth).Date.ToString("yyyy-MMM-dd");
            }
            card.Items = new List<ViewModels.TrianingCardCourse>();
            card.Items.Add(new ViewModels.TrianingCardCourse() {  Title="TYPE B737-300",Date2=null });
            card.Items.Add(new ViewModels.TrianingCardCourse() { Title = "SEPT", Date2 = crew.SEPTExpireDate,Date1=crew.SEPTIssueDate });
            card.Items.Add(new ViewModels.TrianingCardCourse() { Title = "DG", Date2 = crew.DangerousGoodsExpireDate,Date1=crew.DangerousGoodsIssueDate });
            card.Items.Add(new ViewModels.TrianingCardCourse() { Title = "SMS", Date2 = crew.SMSExpireDate,Date1=crew.SMSIssueDate });
            card.Items.Add(new ViewModels.TrianingCardCourse() { Title = "IN-FLT SECURITY", Date2 = crew.AviationSecurityExpireDate,Date1=crew.AviationSecurityIssueDate });
            card.Items.Add(new ViewModels.TrianingCardCourse() { Title = "CRM", Date2 = crew.UpsetRecoveryTrainingExpireDate ,Date1=crew.UpsetRecoveryTrainingIssueDate});
            card.Items.Add(new ViewModels.TrianingCardCourse() { Title = "FMT", Date2 = null,Date1=null });
            card.Items.Add(new ViewModels.TrianingCardCourse() { Title = "FIRST AID", Date2 = crew.FirstAidExpireDate,Date1=crew.FirstAidIssueDate });


            return card;
        }
        public object SendUp( )
        {
            var crews = this.context.ViewEmployees.Where(q => q.InActive == false &&
              (/*q.JobGroup=="TRE" || q.JobGroup=="TRI" || q.JobGroup=="P1" || q.JobGroup=="P2" */  q.JobGroup=="SCCM" || q.JobGroup=="ISCCM" || q.JobGroup=="CCM")
            )  .ToList();
            var ids = crews.Select(q => q.UserId).ToList();

            var users = this.context.AspNetUsers.Where(q => ids.Contains(q.Id)).ToList();

       
            foreach (var crew in crews)
            {
                
                var user = users.Where(q => q.Id == crew.UserId   ).FirstOrDefault();
                
                if (user!=null )
                {
                    var strs = new List<string>();
                    strs.Add("Dear " + (crew.FirstName+" "+crew.LastName).ToUpper() + ", ");
                    strs.Add("Please visit your CrewPocket account To see your roster, notifications, etc.");
                    strs.Add("You have to change your password after first login.");

                    strs.Add("https://cp.apvaresh.ir");
                    
                    strs.Add("Username: " + user.UserName);
                    // strs.Add("Password: " + /*(string.IsNullOrEmpty(crew.Telegram) ?*/ "1234@aA" /*: crew.Telegram*/));
                    strs.Add("Password: 1234@aA");
                    strs.Add("Varesh Airlines");
                    var text = String.Join("\n", strs);
                    // SendSMS(crew.Mobile, text, crew.Name);
                    // SendSMS(/*crew.Mobile*/"09122007720", text, crew.Name);
                    // SendSMS(/*crew.Mobile*/"09123938451", text, crew.Name);
                       Magfa m = new Magfa();
                    Magfa m2 = new Magfa();

                   var smsResult = m.enqueue(1, crew.Mobile, text  )[0];
                    var smsResult2 = m2.enqueue(1, "09124449584", text+"   MOBILE:"+ smsResult.ToString())[0];


                }
                else
                {
                    Magfa m2 = new Magfa();
                    var smsResult2 = m2.enqueue(1, "09124449584",crew.PersonId+"  "+crew.Name+ "  null")[0];
                }

            }

            return 100;
        }





        public object SendCP()
        {
            var crews = this.context.ViewEmployees.Where(q => q.InActive == false &&
              (q.JobGroup == "TRE" || q.JobGroup == "TRI" || q.JobGroup == "P1" || q.JobGroup == "P2"  )
            ).ToList();
            var ids = crews.Select(q => q.UserId).ToList();

            var users = this.context.AspNetUsers.Where(q => ids.Contains(q.Id)).ToList();


            foreach (var crew in crews)
            {

                var user = users.Where(q => q.Id == crew.UserId).FirstOrDefault();

                if (user != null)
                {
                    var strs = new List<string>();
                    strs.Add("Dear " + (crew.FirstName + " " + crew.LastName).ToUpper() + ", ");
                    strs.Add("SKYBAG (EFB) Account Information:");
                   

                  //  strs.Add("https://cp.aptaban.ir");

                    strs.Add("Username: " + user.UserName);
                    strs.Add("Password: "+(string.IsNullOrEmpty( crew.Telegram)?"1234@aA":crew.Telegram));
                    strs.Add("https://sbtaban.ir");
                    strs.Add("Taban Airlines");
                    var text = String.Join("\n", strs);
                    // SendSMS(crew.Mobile, text, crew.Name);
                    // SendSMS(/*crew.Mobile*/"09122007720", text, crew.Name);
                    // SendSMS(/*crew.Mobile*/"09123938451", text, crew.Name);
                    Magfa m = new Magfa();
                    Magfa m2 = new Magfa();

                    var smsResult = m.enqueue(1, crew.Mobile, text)[0];
                    var smsResult2 = m2.enqueue(1, "09124449584", text + "   MOBILE:" + smsResult.ToString())[0];


                }
                else
                {
                    Magfa m2 = new Magfa();
                    var smsResult2 = m2.enqueue(1, "09124449584", crew.PersonId + "  " + crew.Name + "  null")[0];
                }

            }

            return 100;
        }
        public virtual CustomActionResult Validate(ViewModels.Employee dto)
        {
            //return Exceptions.getDuplicateException("Location-01", "Title");
            // var c = dbSet.FirstOrDefault(q => q.Id != dto.Id && q.DateStart == dto.DateStart && q.CourseTypeId == dto.CourseTypeId && q.OrganizationId == dto.OrganizationId);
            var c = dbSet.FirstOrDefault(q => q.Id != dto.Person.PersonId && q.NID == dto.Person.NID);
            if (c != null)
                return Exceptions.getDuplicateException("Person-01", "NID");
            if (!string.IsNullOrEmpty(dto.Person.IDNo))
            {
                var idno = dbSet.FirstOrDefault(q => q.Id != dto.Person.PersonId && q.IDNo == dto.Person.IDNo);
                if (idno != null)
                    return Exceptions.getDuplicateException("Person-02", "IDNo");
            }


            var pc = context.ViewEmployees.FirstOrDefault(q => q.CustomerId == dto.CustomerId && q.Id != dto.Id && q.PID == dto.PID);
            if (pc != null)
                return Exceptions.getDuplicateException("Employee-01", "PID");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }
    }
}