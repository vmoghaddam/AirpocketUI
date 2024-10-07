using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.OData;
using EPAGriffinAPI.Models;
using System.Web.Http.Description;
using System.Collections.Generic;
using System;
using System.Data.Entity.Validation;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using EPAGriffinAPI.DAL;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using System.Net.Http;
using System.Web;
using Newtonsoft.Json;
using System.Security.Claims;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BaseController : ODataController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/cache/clear/ip")]
         
        // [Authorize]
        public  IHttpActionResult  GetClearCacheIP()
        {

            IPHelper.RemoveIPCache();
            return Ok(true);

        }
        [Route("odata/cache/clear")]

        // [Authorize]
        public IHttpActionResult GetClearCache()
        {

            IPHelper.ClearCache();
            return Ok(true);

        }
        [Route("odata/cache/get")]

        // [Authorize]
        public IHttpActionResult GetCacheIP()
        {

            
            return Ok(IPHelper.GetCache());

        }

        [Route("odata/cache/set")]

        // [Authorize]
        public IHttpActionResult GetCacheIPSet()
        {

            IPHelper.SetIPAccesses2();
            return Ok(true);

        }


        [Route("odata/ip")]

        // [Authorize]
        public IHttpActionResult GetRequestIP()
        {
            // string userIpAddress = ((HttpContextWrapper)actionContext.Request.Properties["MS_HttpContext"]).Request.UserHostName;
            var ip=HttpContext.Current.Request.UserHostName;
           
            return Ok(ip);

        }

        [Route("odata/ip2/{name}")]

        // [Authorize]
        public IHttpActionResult GetRequestIP2(string name)
        {
            // string userIpAddress = ((HttpContextWrapper)actionContext.Request.Properties["MS_HttpContext"]).Request.UserHostName;
            var ip = HttpContext.Current.Request.UserHostName;
            var obj = IPHelper.IsAllowed2(ip, name);

            return Ok(obj);

        }
        [Route("odata/ipaccess")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewIPAccess> GetViewIPAccess()
        {
            
                return unitOfWork.PersonRepository.GetViewIPAccess();
                // return db.ViewAirports.AsNoTracking() ;
            
        }
        [Route("odata/aspnetusers")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<AspNetUser> GetAspNetUsers()
        {

            return unitOfWork.PersonRepository.GetAspNetUsers();
            // return db.ViewAirports.AsNoTracking() ;

        }


        [Route("odata/base/caotypes")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCaoType> GetCaoTypes()
        {
            try
            {
                return unitOfWork.ViewCaoTypeRepository.GetQuery();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/base/airlines")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<Organization> GetAirlines()
        {
            try
            {
                return unitOfWork.ViewOrganizationRepository.GetQuery().Where(q=>q.TypeId==58);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/base/ratingorganization")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<Organization> GetRatingOrganizations()
        {
            try
            {
                return unitOfWork.ViewOrganizationRepository.GetQuery().Where(q => q.TypeId == 58);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/base/publishers")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewOrganization> GetPublishers()
        {
            try
            {
                return unitOfWork.OrganizationRepository.GetViewOrganization().Where(q => q.TypeId == 77);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

       

       

        [Route("odata/base/currencies")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<Currency> GetCurrencies()
        {
            try
            {
                return unitOfWork.ViewCurrencyRepository.GetQuery();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/base/studyfields/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewStudyField> GetViewStudyField(int cid)
        {
            try
            {
                return unitOfWork.StudyFieldRepository.GetQuery().Where(q => q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/base/posts/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewPost> GetViewPost(int cid)
        {
            try
            {
                return unitOfWork.PostRepository.GetQuery().Where(q => q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        ///JobGroups
        [Route("odata/base/jobgroups/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewJobGroup> GetJobGroups(int cid)
        {
            try
            {
                return unitOfWork.ViewJobGroupRepository.GetQuery().Where(q=>q.CustomerId==cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/base/jobgroups/type/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewJobGroupType> GetJobGroupTypes(int cid)
        {
            try
            {
                return unitOfWork.ViewJobGroupTypeRepository.GetQuery().Where(q => q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/base/library/folders/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewLibraryFolder> GetLibraryFolders(int cid)
        {
            try
            {
                return unitOfWork.ViewLibraryFolderRepository.GetQuery().OrderBy(q=>q.Fullcode).ToList().AsQueryable();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }


        [Route("odata/base/library/employee/folders/{pid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewFolderApplicable> GetLibraryEmployeeFolders(int pid)
        {
            try
            {
                var result = unitOfWork.ViewFolderApplicableRepository.GetQuery().Where(q => q.EmployeeId == pid).OrderBy(q => q.FullCode).ToList();
                return result.AsQueryable();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/base/library/employee/folder/{eid}/{fid}/{pid}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetLibraryEmployeeFolder(int pid,int fid,int eid)
        {
            try
            {
                //hook
                int? parentId = pid == -1 ? null :(Nullable<int>) pid;
                var folders = unitOfWork.ViewFolderApplicableRepository.GetQuery().Where(q => q.EmployeeId == eid && q.ParentId==parentId).OrderBy(q => q.FullCode).ToList();
                var items = unitOfWork.BookRepository.GetViewBookApplicableEmployee().Where(q => q.FolderId == fid && q.EmployeeId == eid).OrderBy(q => q.Title).ToList();
                var ids = items.Select(q => q.BookId).ToList();
                var files = await unitOfWork.BookRepository.GetBookFiles(ids,eid);
                var chapters = await unitOfWork.BookRepository.GetBookChapters(ids);


                var result = new
                {
                    folders,
                    items,
                    files,
                    chapters
                };
                  return Ok( result) ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/base/library/employee/folder/{eid}/{fid}/{pid}/{cid}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetLibraryEmployeeFolderCustomer(int pid, int fid, int eid,int cid)
        {
            try
            {
                int? parentId = pid == -1 ? null : (Nullable<int>)pid;
                var folders = unitOfWork.ViewFolderApplicableRepository.GetQuery().Where(q =>q.CustomerId==cid && q.EmployeeCustomerId==cid && q.EmployeeId == eid && q.ParentId == parentId).OrderBy(q => q.FullCode).ToList();
                var items = unitOfWork.BookRepository.GetViewBookApplicableEmployee().Where(q => q.CustomerId == cid && q.EmployeeCustomerId == cid && q.FolderId == fid && q.EmployeeId == eid).OrderBy(q => q.Title).ToList();
                var ids = items.Select(q => q.BookId).ToList();
                var files = await unitOfWork.BookRepository.GetBookFiles(ids, eid);


                var result = new
                {
                    folders,
                    items,
                    files
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/base/jobgroups/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteJobGroup(ViewModels.Location dto)
        {
            var entity = await unitOfWork.JobgroupRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



          //  var canDelete = unitOfWork.JobgroupRepository.CanDelete(entity);
          //  if (canDelete.Code != HttpStatusCode.OK)
          //      return canDelete;

            unitOfWork.JobgroupRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }


        [Route("odata/base/library/folders/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteLibraryFolder(ViewModels.Location dto)
        {
            var entity = await unitOfWork.LibraryFolderRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }
            var canDelete = unitOfWork.LibraryFolderRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;
            unitOfWork.LibraryFolderRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }

        [Route("odata/base/library/chapters/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteLibraryChapter(ViewModels.Location dto)
        {
            var entity = await unitOfWork.BookChapterRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }
            var canDelete = unitOfWork.BookChapterRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;
            unitOfWork.BookChapterRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }


        [Route("odata/base/jobgroups/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostJobGroup(ViewModels.JobGroup dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.JobgroupRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            JobGroup entity = null;
            var oldFullCode = string.Empty;
            if (dto.Id == -1)
            {
                entity = new JobGroup();
                unitOfWork.JobgroupRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.JobgroupRepository.GetByID(dto.Id);
                oldFullCode = entity.FullCode;

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.JobGroup.Fill(entity, dto);

            if (dto.Id != -1 && entity.FullCode != oldFullCode)
                unitOfWork.JobgroupRepository.UpdateChildren(entity, entity.FullCode);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }



        [Route("odata/base/library/folders/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostLibraryFolder(ViewModels.LibraryFolderDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.LibraryFolderRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            LibraryFolder entity = null;
           
            if (dto.Id == -1)
            {
                entity = new LibraryFolder();
                unitOfWork.LibraryFolderRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.LibraryFolderRepository.GetByID(dto.Id);
                 

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.LibraryFolderDto.Fill(entity, dto);

            LibraryFolder parent = null;
            if (entity.ParentId!=null)
                parent= await unitOfWork.LibraryFolderRepository.GetByID(entity.ParentId);


            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;

            if (parent == null)
                entity.FullCode = entity.Id.ToString();
            else
                entity.FullCode = parent.FullCode + "-" + entity.Id.ToString();
            saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var view = unitOfWork.LibraryFolderRepository.GetViewLibraryFolder().FirstOrDefault(q => q.Id == entity.Id);

            return Ok(view);
        }

        [Route("odata/base/library/chapters/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostLibraryChapter(ViewModels.LibraryChapterDto dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
           var validate = unitOfWork.BookChapterRepository.Validate(dto);
           if (validate.Code != HttpStatusCode.OK)
                return validate;

            BookChapter entity = null;

            if (dto.Id == -1)
            {
                entity = new BookChapter();
                unitOfWork.BookChapterRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.BookChapterRepository.GetByID(dto.Id);


            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.LibraryChapterDto.Fill(entity, dto);

            BookChapter parent = null;
            if (entity.ParentId != null)
                parent = await unitOfWork.BookChapterRepository.GetByID(entity.ParentId);


            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;

            if (parent == null)
                entity.FullCode = entity.Id.ToString();
            else
                entity.FullCode = parent.FullCode + "-" + entity.Id.ToString();
            saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var view = unitOfWork.BookChapterRepository.GetViewBookChapters().FirstOrDefault(q => q.Id == entity.Id);

            return Ok(view);
        }
        ////////////////////////
        [Route("odata/organizations/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostOrganization(ViewModels.Organization dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.OrganizationRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Organization entity = null;

            if (dto.Id == -1)
            {
                entity = new Organization();
                unitOfWork.OrganizationRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.OrganizationRepository.GetByID(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.Organization.Fill(entity, dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }

        [Route("odata/organizations/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteOrganization(ViewModels.Organization dto)
        {
            var entity = await unitOfWork.OrganizationRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.OrganizationRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.OrganizationRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }
        
        ///////// Journal ///////////////
         [Route("odata/base/journals")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewJournal> GetJournals()
        {
            try
            {
                return unitOfWork.JournalRepository.GetViewJournal().Where(q=>q.TypeId==1);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/base/conferences")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewJournal> GetConferences()
        {
            try
            {
                return unitOfWork.JournalRepository.GetViewJournal().Where(q => q.TypeId == 2);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/journals/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostJournal(ViewModels.JournalX dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.JournalRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Journal entity = null;

            if (dto.Id == -1)
            {
                entity = new Journal();
                unitOfWork.JournalRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.JournalRepository.GetByID(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.JournalX.Fill(entity, dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }

        [Route("odata/journals/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteJournal(ViewModels.JournalX dto)
        {
            var entity = await unitOfWork.JournalRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.JournalRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.JournalRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }

        ///Registration////////////////
        [Route("odata/base/register/code/{mobile}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetRegistrationCode(string mobile)
        {
            var code = DateTime.Now.Millisecond.ToString();
            if (code.Length == 3)
                code += "1";
            if (code.Length == 2)
                code += DateTime.Now.Month.ToString().PadLeft(2, '0');
            if (code.Length==1)
                code+="1" + DateTime.Now.Month.ToString().PadLeft(2, '0');

            var dto = new {
                code
            };

            return Ok(dto);

        }
        private List<string> GetErrorResult(IdentityResult result)
        {

            var _result = new List<string>();
            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        _result.Add(error);
                    }
                }



                return _result;
            }

            return null;
        }
        [Route("odata/crewpocket/register")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> RegisterCrewPocket(dynamic dto)
        {
            var email = Convert.ToString(dto.Email);
            var password = Convert.ToString(dto.Password);
            string mobile = Convert.ToString(dto.Mobile);
            if (!mobile.StartsWith("0"))
                mobile = "0" + mobile;
            var fn = Convert.ToString(dto.FirstName);
            var ln = Convert.ToString(dto.LastName);
            var nid = Convert.ToString(dto.NID);
            var pos = Convert.ToString(dto.Position);
            int hb = Convert.ToInt32(dto.Home);

            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();

            var user = new ApplicationUser() { UserName = mobile, Email = email };

            IdentityResult result = await UserManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            }

            ApplicationUser created = await UserManager.FindByNameAsync(mobile);
            await UserManager.AddToRoleAsync(created.Id, "CREWPOCKET");

            var location = await unitOfWork.LocationRepository.GetLocations().FirstOrDefaultAsync(q => q.Title == "AirPocket");

            var positionId = -1;
            switch (pos)
            {
                case "TRI":
                    positionId = 1024;
                    break;
                case "TRE":
                    positionId = 1025;
                    break;
                case "LTC":
                    positionId = 1026;
                    break;
                case "P1":
                    positionId = 1023;
                    break;
                case "P2":
                    positionId = 1019;
                    break;
                case "ISCCM":
                    positionId = 1028;
                    break;
                case "SCCM":
                    positionId = 1030;
                    break;
                case "CCM":
                    positionId = 1031;
                    break;
                default:
                    break;
            }
            var person = new Models.Person()
            {
                 FirstName=fn,
                 LastName=ln,
                 Mobile=mobile,
                 NID=nid,
                 Email=email,
                 UserId=created.Id,
                 DateCreate=DateTime.Now,
                 MarriageId=16,
                 SexId= 32,
                 IsActive=true,
                 IsDeleted=false,
                 

            };
            unitOfWork.PersonRepository.Insert(person);
            var personCustomer = new PersonCustomer()
            {
                 CustomerId=3,
                // Person=person,
                 IsActive=true,
                 DateRegister=DateTime.Now,
                 DateRegisterP= Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateTimeDigital((DateTime)DateTime.Now)),
                 DateConfirmed=DateTime.Now,
                 DateConfirmedP= Convert.ToDecimal(Utils.DateTimeUtil.GetPersianDateTimeDigital((DateTime)DateTime.Now)),
                 IsDeleted=false,
                 GroupId=positionId,
                 Username=mobile,
                 Password=password,

            };
            person.PersonCustomers.Add(personCustomer);
            Employee employee = new Employee()
            {
                PID=DateTime.Now.Month.ToString()+DateTime.Now.Day.ToString()+DateTime.Now.Day.ToString()+DateTime.Now.Second.ToString()+DateTime.Now.Millisecond.ToString(),
                BaseAirportId=hb,
            };
            employee.EmployeeLocations.Add(new EmployeeLocation()
            {
                 
                IsMainLocation = true,
                LocationId = location.Id,
                
                
                

            });
            personCustomer.Employee = employee;
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(person);
        }
        ////////////////////////////
        private ClaimsPrincipal TryGetOwinUser()
        {
            if (HttpContext.Current == null)
                return null;

            var context = HttpContext.Current.GetOwinContext();
            if (context == null)
                return null;

            if (context.Authentication == null || context.Authentication.User == null)
                return null;

            return context.Authentication.User;
        }
        [Route("odata/ips/save")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostIps(dynamic dto)
        {
             var user = TryGetOwinUser();
            var claims = user.Claims;
            var _ips = Convert.ToString(dto.ips);
            var _users = Convert.ToString(dto.users);
            var result = unitOfWork.PersonRepository.SaveIPs(_ips, _users);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }

        [Route("odata/ips/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostIpsDelete(dynamic dto)
        {
            string _ids = Convert.ToString(dto.Id);
            var ids = _ids.Split('_').Select(q => Convert.ToInt32(q)).ToList();
             
            var result = unitOfWork.PersonRepository.DeleteIPs(ids);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }
        [Route("odata/verification/resend")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostResendVerification(dynamic dto)
        {
            var ckey = "b14ca5898a4e4133bbce2ea2315a1916";
            string enc = Convert.ToString(dto.code);
            string phone = Convert.ToString(dto.phone);
            var decrypt = AesOperation.DecryptString(ckey, enc);

           
            var prts = decrypt.Split(new string[] { "_**_" }, StringSplitOptions.None);
            var code = prts[2];
            Magfa m = new Magfa();
            var smsResult = m.enqueue(1, phone, "AirPocket" + "\n" + "Verification Code: " + code)[0];
           // var xxx=m.enqueue(1, "09124449584", "AirPocket" + "\n"+"resend "+  "\n" + phone+ "Verification Code: " + code)[0];
            return Ok(dto);
        }
        ///==////////////////////////

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                //db.Dispose();
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
