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
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;

using System.Web;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PersonController : ODataController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        [Route("odata/send/up")]
        public IHttpActionResult GetSendUp()
        {
            var result = unitOfWork.PersonRepository.SendUp();

            return Ok(true);
        }

        [Route("odata/send/cp")]
        public IHttpActionResult GetSendCp()
        {
            var result = unitOfWork.PersonRepository.SendCP();

            return Ok(true);
        }
        [Route("odata/employees/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewEmployee> GetEmployeesByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewEmployees().Where(q => q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employee/actypes/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewEmployeeACType> GetEmployeeAcTypes(int id)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewEmployeeACTypes().Where(q => q.EmployeeId == id);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/users/new")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewUser> GetUsersNew()
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewUsers();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/users")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewUser> GetUsers()
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewUsers();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/roles")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewRole> GetRoles()
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewRoles();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/claims")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewClaim> GetClaims()
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewClaim();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/role/claims/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewRoleClaim> GetRoleClaims(int id)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewRoleClaim().Where(q => q.RoleId == id);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/user/claims/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewUserRoleClaim> GetUserClaims(string id)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewUserRoleClaim().Where(q => q.UserId == id);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }


        [Route("odata/user/roles/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewUserRole> GetUserRoles(string id)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewUserRoles().Where(q => q.UserId == id);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

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
        [Route("odata/users/register")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserRegister(dynamic dto)
        {
            var email = Convert.ToString(dto.Email);
            var password = Convert.ToString(dto.Password);
            var userName = Convert.ToString(dto.UserName);
            var fn = Convert.ToString(dto.FirstName);
            var ln = Convert.ToString(dto.LastName);
            var personId = Convert.ToInt32(dto.PersonId);
            var station = "";
            if (dto.Station!=null)
                station=Convert.ToString(dto.Station);

            string PhoneNumber = "";
            if (dto.PhoneNumber != null)
            {
                PhoneNumber = Convert.ToString(dto.PhoneNumber);
            }

            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = new ApplicationUser() { UserName = userName, Email = email };
            user.PhoneNumber = PhoneNumber;

            IdentityResult result = await UserManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            }

            ApplicationUser created = await UserManager.FindByNameAsync(userName);
            if (dto.Roles != null)
            {
                var roles = JsonConvert.DeserializeObject<List<string>>(JsonConvert.SerializeObject(dto.Roles)); //dto.Roles as List<string>;
                foreach (var x in roles)
                {
                    await UserManager.AddToRoleAsync(created.Id, x);

                }

            }


            var ext = new UserExt()
            {
                Id = created.Id,
                FirstName = fn,
                LastName = ln,
            };

            unitOfWork.PersonRepository.Insert(ext);

            if (personId != -1)
            {
                await unitOfWork.PersonRepository.UpdateUserId(personId, created.Id);
            }

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            if (!string.IsNullOrEmpty(station))
                unitOfWork.PersonRepository.InsertStation(created.Id, station);



            return Ok(dto);




        }

        [Route("odata/users/update")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserUpdate(dynamic dto)
        {
            var email = Convert.ToString(dto.Email);
            var password = Convert.ToString(dto.Password);
            var userName = Convert.ToString(dto.UserName);
            var fn = Convert.ToString(dto.FirstName);
            var ln = Convert.ToString(dto.LastName);
            var personId = Convert.ToInt32(dto.PersonId);
            string st = "";
            if (dto.Station != null)
                st = Convert.ToString(dto.Station);
            string Id = Convert.ToString(dto.Id);
            string PhoneNumber = "";
            if (dto.PhoneNumber != null)
            {
                PhoneNumber = Convert.ToString(dto.PhoneNumber);
            }
            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            //    IdentityRole idrole = new IdentityRole();
            //    RoleStore<IdentityRole> roleStore = new RoleStore<IdentityRole>();
            //    RoleManager<IdentityRole> roleManager = new RoleManager<IdentityRole>(roleStore);


            var user = await UserManager.FindByIdAsync(Id);
            user.UserName = userName;
            user.Email = email;
            user.PhoneNumber = PhoneNumber;

            //if (!string.IsNullOrEmpty(st))
            //{
            //    // user.SecurityStamp = st;

            //}


            IdentityResult result = await UserManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            }
            await unitOfWork.PersonRepository.UpdateUser(dto);
            if (personId != -1)
            {
                await unitOfWork.PersonRepository.UpdateUserId(personId, user.Id);
            }
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            var _roles = await UserManager.GetRolesAsync(Id);
            if (_roles != null && _roles.Count > 0)
            {
                await UserManager.RemoveFromRolesAsync(Id, _roles.ToArray());
            }

            if (dto.Roles != null)
            {
                var roles = JsonConvert.DeserializeObject<List<string>>(JsonConvert.SerializeObject(dto.Roles)); //dto.Roles as List<string>;
                foreach (var x in roles)
                {
                    await UserManager.AddToRoleAsync(Id, x);

                }

            }

            if (!string.IsNullOrEmpty(st))
            {
                // user.SecurityStamp = st;
                unitOfWork.PersonRepository.InsertStation(user.Id, st);

            }

            return Ok(dto);




        }

        [Route("odata/users/password")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserPassword(dynamic dto)
        {

            var password = Convert.ToString(dto.Password);

            string Id = Convert.ToString(dto.Id);
            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await UserManager.FindByIdAsync(Id);

            var token = await UserManager.GeneratePasswordResetTokenAsync(Id);
            IdentityResult result = await UserManager.ResetPasswordAsync(Id, token, password);


            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            }

            return Ok(dto);




        }


        [Route("odata/users/password/all")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> PostUserPasswordAll()
        {
            //var dbctx = new EPAGRIFFINEntities();
            //var people = from x in dbctx.People
            //             where !string.IsNullOrEmpty(x.UserId) && !string.IsNullOrEmpty(x.Telegram)
            //             select x ;

            //foreach(var p in people)
            //{
            //    ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            //    var user = await UserManager.FindByIdAsync(p.UserId);
            //    if (user != null)
            //    {
            //        var token = await UserManager.GeneratePasswordResetTokenAsync(p.UserId);
            //        IdentityResult result = await UserManager.ResetPasswordAsync(p.UserId, token, p.Telegram);
            //    }
               

            //}

           // var password = Convert.ToString(dto.Password);

           // string Id = Convert.ToString(dto.Id);
           

           


            //if (!result.Succeeded)
            //{
            //    return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            //}

            return Ok(true);




        }

        [Route("odata/users/disable")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserDisabled(dynamic dto)
        {

            //var password = Convert.ToString(dto.Password);
            var password = "Aa123456##$$Atrina1359@aA";
            string Id = Convert.ToString(dto.Id);
            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await UserManager.FindByIdAsync(Id);

            var token = await UserManager.GeneratePasswordResetTokenAsync(Id);
            IdentityResult result = await UserManager.ResetPasswordAsync(Id, token, password);

            IdentityResult result2 = UserManager.SetLockoutEnabled(Id, true);

            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            }

            return Ok(dto);




        }


        [Route("odata/users/enable")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserEnabled(dynamic dto)
        {

            //var password = Convert.ToString(dto.Password);
            var password = "1234@aA";
            string Id = Convert.ToString(dto.Id);
            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await UserManager.FindByIdAsync(Id);

            var token = await UserManager.GeneratePasswordResetTokenAsync(Id);
            IdentityResult result = await UserManager.ResetPasswordAsync(Id, token, password);

            IdentityResult result2 = UserManager.SetLockoutEnabled(Id, false);

            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            }

            return Ok(dto);




        }


        [Route("odata/users/password/assign")]

        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> GetUserPasswordAssign()
        {
            var dbctx = new EPAGRIFFINEntities();
            var person = dbctx.People.FirstOrDefault(q => q.UserId == "4034");
            var password = "1234@bB";

            string Id = "4034";
            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await UserManager.FindByIdAsync(Id);

            var token = await UserManager.GeneratePasswordResetTokenAsync(Id);
            IdentityResult result = await UserManager.ResetPasswordAsync(Id, token, password);

            //IdentityResult result2=await UserManager.UpdateSecurityStampAsync();
            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.BadRequest, GetErrorResult(result));

            }

            person.EmailPassword = password;
            dbctx.SaveChanges();

            return Ok(true);




        }

        [Route("odata/users/password/change")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserPasswordChange(dynamic dto)
        {

            var password = Convert.ToString(dto.Password);
            var old = Convert.ToString(dto.Old);
            var username = Convert.ToString(dto.UserName);
            var confirmed = Convert.ToString(dto.Confirmed);
            if (password != confirmed)
                return new CustomActionResult(HttpStatusCode.NotAcceptable, "'Password' and 'Confirm Password' do not match.");

            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            ApplicationUser user = await UserManager.FindByNameAsync(username);
            IdentityResult result = await UserManager.ChangePasswordAsync(user.Id, old, password);
            if (!result.Succeeded)
            {
                return new CustomActionResult(HttpStatusCode.NotAcceptable, GetErrorResult(result));

            }

            return Ok(dto);




        }

        [Route("odata/users/delete")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostUserDelete(dynamic dto)
        {

            string Id = Convert.ToString(dto.Id);
            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            ApplicationUser user = await UserManager.FindByIdAsync(Id);
            await UserManager.DeleteAsync(user);



            return Ok(dto);




        }


        [Route("odata/user/roles/add")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostAddUserRole(dynamic dto)
        {
            var userId = Convert.ToString(dto.userId);
            var role = Convert.ToString(dto.role);

            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();


            //ApplicationUser user = await UserManager.FindByIdAsync(userId);
            IdentityResult result2 = await UserManager.AddToRoleAsync(userId, role);



            return Ok(dto);




        }

        [Route("odata/user/roles/remove")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostRemoveUserRole(dynamic dto)
        {
            var userId = Convert.ToString(dto.userId);
            var role = Convert.ToString(dto.role);

            ApplicationUserManager UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();


            //ApplicationUser user = await UserManager.FindByIdAsync(userId);
            IdentityResult result2 = await UserManager.RemoveFromRoleAsync(userId, role);



            return Ok(dto);




        }

        [Route("odata/employees/light/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewEmployee> GetEmployeesLightByCustomerId(int cid)
        {
            try
            {
                //abdi
                //var date = DateTime.Now;
                //var m = date.Month;
                //var d = date.Day;
                //if (d > 21)
                //{
                //    throw new HttpResponseException(HttpStatusCode.Unauthorized);
                //}
                // return unitOfWork.PersonRepository.GetViewEmployeesLight().Where(q => q.CustomerId == cid);
                return unitOfWork.PersonRepository.GetViewEmployees().Where(q => q.CustomerId == cid);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/light/crew/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewEmployee> GetEmployeesLightCrewByCustomerId(int cid)
        {
            try
            {
                //abdi
                //var date = DateTime.Now;
                //var m = date.Month;
                //var d = date.Day;
                //if (d > 21)
                //{
                //    throw new HttpResponseException(HttpStatusCode.Unauthorized);
                //}
                // return unitOfWork.PersonRepository.GetViewEmployees().Where(q => q.CustomerId == cid && (q.JobGroupCode.StartsWith("00101") || q.JobGroupCode.StartsWith("00102")));

                //  return unitOfWork.PersonRepository.GetViewEmployeesLight().Where(q => q.CustomerId == cid && (q.JobGroupCode.StartsWith("00101") || q.JobGroupCode.StartsWith("00102")));
                return unitOfWork.PersonRepository.GetViewEmployees().Where(q => q.CustomerId == cid && (q.JobGroupCode.StartsWith("00101") || q.JobGroupCode.StartsWith("00102")));
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }


        [Route("odata/employees/group/{groupId}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewEmployee> GetEmployeesByGroupId(int groupId)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewEmployees().Where(q => q.GroupId == groupId);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/group/code/{code}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewEmployee> GetEmployeesByGroupCode(string code)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewEmployees().Where(q => q.JobGroupCode.StartsWith(code));
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/group/code2/{code}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewEmployee> GetEmployeesByGroupCode2(string code)
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewEmployees().Where(q => q.JobGroupCode2.StartsWith(code));
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }


        [Route("odata/authors")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewPersonMisc> GetAuthors()
        {
            try
            {
                return unitOfWork.PersonMiscRepository.GetViewPersonMisc().Where(q => q.TypeId == 75);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/matchinglist")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewMatchingList> GetMatchingList()
        {
            try
            {
                return unitOfWork.PersonRepository.GetViewMatchingList();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/activecourses/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewPersonActiveCourse> GetEmployeesActiveCourses(int id)
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewPersonActiveCourse().Where(q => q.PersonId == id).OrderBy(q => q.StatusId);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/pendingcourses/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewPersonActiveCourse> GetEmployeesPendingCourses(int id)
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewPersonActiveCourse().Where(q => q.PersonId == id && q.StatusId == null && q.CourseStatusId == 1).OrderBy(q => q.Remain);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/library/{id}/{type?}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBookApplicableEmployee> GetEmployeesLibrary(int id, int? type = null)
        {
            try
            {
                if (type == null)
                    return unitOfWork.BookRepository.GetViewBookApplicableEmployee().Where(q => q.IsExposed == 1 && q.EmployeeId == id).OrderBy(q => q.IsVisited).ThenBy(q => q.IsDownloaded).ThenByDescending(q => q.DateExposure);
                else
                    return unitOfWork.BookRepository.GetViewBookApplicableEmployee().Where(q => q.IsExposed == 1 && q.EmployeeId == id && q.TypeId == (int)type).OrderBy(q => q.IsVisited).ThenBy(q => q.IsDownloaded).ThenByDescending(q => q.DateExposure);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/library/{id}/{cid}/{type?}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBookApplicableEmployee> GetEmployeesLibraryCustomer(int id, int cid, int? type = null)
        {
            try
            {
                if (type == null)
                    return unitOfWork.BookRepository.GetViewBookApplicableEmployee().Where(q => q.CustomerId == cid && q.EmployeeCustomerId == cid && q.IsExposed == 1 && q.EmployeeId == id).OrderBy(q => q.IsVisited).ThenBy(q => q.IsDownloaded).ThenByDescending(q => q.DateExposure);
                else
                    return unitOfWork.BookRepository.GetViewBookApplicableEmployee().Where(q => q.CustomerId == cid && q.EmployeeCustomerId == cid && q.IsExposed == 1 && q.EmployeeId == id && q.TypeId == (int)type).OrderBy(q => q.IsVisited).ThenBy(q => q.IsDownloaded).ThenByDescending(q => q.DateExposure);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/pifs/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBookApplicableEmployee> GetPIFs(int id)
        {
            try
            {
                var emp = unitOfWork.PersonRepository.GetEmployeeGroupCode(id);
                var str = "";
                if (emp.StartsWith("00101"))
                    str = "PIF";
                else if (emp.StartsWith("00102"))
                    str = "CIF";
                else
                    return null;

                return unitOfWork.BookRepository.GetViewBookApplicableEmployee()
                    .Where(q => q.IsExposed == 1 && q.EmployeeId == id && q.Category == str)
                    .OrderBy(q => q.IsVisited)
                    .ThenBy(q => q.IsSigned)
                    .ThenBy(q => q.RemainingValid == null ? 10000000 : (q.RemainingValid < 0 ? 20000000 : q.RemainingValid))
                    .ThenByDescending(q => q.DateRelease);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/memos/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBookApplicableEmployee> GetMemos(int id)
        {
            try
            {

                return unitOfWork.BookRepository.GetViewBookApplicableEmployee()
                    .Where(q => q.IsExposed == 1 && q.EmployeeId == id && q.Category != "PIF" && q.Category != "CIF" && q.TypeId == 86)
                    .OrderBy(q => q.IsVisited)
                    .ThenBy(q => q.RemainingDeadLine == null ? 10000000 : q.RemainingDeadLine)
                    //.ThenBy(q => q.IsDownloaded)
                    .ThenByDescending(q => q.DateRelease);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/library/item/{id}/{itemId}")]
        public async Task<IHttpActionResult> GetBook(int id, int itemId)
        {
            var course = await unitOfWork.BookRepository.GetEmployeeBookDto(itemId, id);
            return Ok(course);
        }



        [Route("odata/employees/certificates/last/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCertificate> GetEmployeesCertificates(int id)
        {
            //soosk
            try
            {
                return unitOfWork.CourseRepository.GetViewCertificates().Where(q => q.PersonId == id && q.IsLast == 1).OrderBy(q => q.ExpireStatus).ThenBy(q => q.Remain);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }

        [Route("odata/employees/expiringcertificates/last/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCertificate> GetEmployeesExpiringCertificates(int id)
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewCertificates().Where(q => q.PersonId == id && q.IsLast == 1 && q.Remain != null && q.Remain <= 30).OrderBy(q => q.ExpireStatus).ThenBy(q => q.Remain);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        class crewexpire
        {
            public string Title { get; set; }
            public bool IsExpired { get; set; }
            public bool IsExpiring { get; set; }
            public int? Remaining { get; set; }
        }
        [Route("odata/crew/expires/{id}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetCrewExpires(int id)
        {
            try
            {
                var result = new List<crewexpire>();
                var crew = await unitOfWork.FlightRepository.GetViewCrew().FirstOrDefaultAsync(q => q.PersonId == id);
                if (crew == null)
                    return Ok(result);

                if (crew.RemainMedical <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "Medical",
                        Remaining = crew.RemainMedical,
                        IsExpired = crew.RemainMedical <= 0,
                        IsExpiring = crew.RemainMedical <= 30,


                    });
                //Crew Member Certificate
                if (crew.RemainCMC <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "Crew Member Certificate",
                        Remaining = crew.RemainCMC,
                        IsExpired = crew.RemainCMC <= 0,
                        IsExpiring = crew.RemainCMC <= 30,


                    });
                if (crew.RemainCCRM <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "CCRM",
                        Remaining = crew.RemainCCRM,
                        IsExpired = crew.RemainCCRM <= 0,
                        IsExpiring = crew.RemainCCRM <= 30,


                    });
                //Aviation Security
                if (crew.RemainAvSec <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "Aviation Security",
                        Remaining = crew.RemainAvSec,
                        IsExpired = crew.RemainAvSec <= 0,
                        IsExpiring = crew.RemainAvSec <= 30,


                    });
                //SEPT Theoretical 
                if (crew.RemainSEPT <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "SEPT Theoretical",
                        Remaining = crew.RemainSEPT,
                        IsExpired = crew.RemainSEPT <= 0,
                        IsExpiring = crew.RemainSEPT <= 30,


                    });
                if (crew.RemainSEPTP <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "SEPT Practical",
                        Remaining = crew.RemainSEPTP,
                        IsExpired = crew.RemainSEPTP <= 0,
                        IsExpiring = crew.RemainSEPTP <= 30,


                    });

                //Dangerous Goods
                if (crew.RemainDG <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "Dangerous Goods",
                        Remaining = crew.RemainDG,
                        IsExpired = crew.RemainDG <= 0,
                        IsExpiring = crew.RemainDG <= 30,


                    });
                if (crew.RemainSMS <= 30)
                    result.Add(new crewexpire()
                    {
                        Title = "SMS",
                        Remaining = crew.RemainSMS,
                        IsExpired = crew.RemainSMS <= 0,
                        IsExpiring = crew.RemainSMS <= 30,


                    });
                if (crew.IsCabin == 1)
                {
                    if (crew.RemainFirstAid <= 30)
                        result.Add(new crewexpire()
                        {
                            Title = "First Aid",
                            Remaining = crew.RemainFirstAid,
                            IsExpired = crew.RemainFirstAid <= 0,
                            IsExpiring = crew.RemainFirstAid <= 30,


                        });
                }
                if (crew.IsCockpit == 1)
                {
                    if (crew.RemainLPR <= 30)
                        result.Add(new crewexpire()
                        {
                            Title = "LPR",
                            Remaining = crew.RemainLPR,
                            IsExpired = crew.RemainLPR <= 0,
                            IsExpiring = crew.RemainLPR <= 30,


                        });
                    //Skill Test/Proficiency
                    if (crew.RemainProficiency <= 30)
                        result.Add(new crewexpire()
                        {
                            Title = "Skill Test/Proficiency",
                            Remaining = crew.RemainProficiency,
                            IsExpired = crew.RemainProficiency <= 0,
                            IsExpiring = crew.RemainProficiency <= 30,


                        });
                    if (crew.RemainColdWeather <= 30)
                        result.Add(new crewexpire()
                        {
                            Title = "Cold Weather",
                            Remaining = crew.RemainColdWeather,
                            IsExpired = crew.RemainColdWeather <= 0,
                            IsExpiring = crew.RemainColdWeather <= 30,


                        });
                    if (crew.RemainHotWeather <= 30)
                        result.Add(new crewexpire()
                        {
                            Title = "Hot Weather",
                            Remaining = crew.RemainHotWeather,
                            IsExpired = crew.RemainHotWeather <= 0,
                            IsExpiring = crew.RemainHotWeather <= 30,


                        });
                }
                return Ok(result);
                //  return unitOfWork.CourseRepository.GetViewCertificates().Where(q => q.PersonId == id && q.IsLast == 1 && q.Remain != null && q.Remain <= 30).OrderBy(q => q.ExpireStatus).ThenBy(q => q.Remain);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }


        [Route("odata/crew/expiring/certificates/{id}")]
        [EnableQuery]
        // [Authorize]
        public async Task<IHttpActionResult> GetCrewExpiringCertificates(int id)
        {
            try
            {
                var result = new List<crewexpire>();
                var crew = await unitOfWork.FlightRepository.GetViewCrew().FirstOrDefaultAsync(q => q.PersonId == id);
                if (crew == null)
                    return Ok(result);

                var _shared = new List<int?>() { 1185, 1186, 1190, 1189, 1192, 1187, 1188, 1191 };
                var _cabin = new List<int?>() { 1202 };
                var _cockpit = new List<int?>() { 1184, 1182, 1194, 1195 };
                if (crew.IsCabin == 1)
                    _shared = _shared.Concat(_cabin).ToList();
                if (crew.IsCockpit == 1)
                    _shared = _shared.Concat(_cockpit).ToList();

                var items = await unitOfWork.PersonRepository.GetViewCertifications().Where(q => q.PersonId == id && q.Remain <= 30 && _shared.Contains(q.TypeId))
                    .OrderBy(q => q.Remain).ThenBy(q => q.TypeId).ToListAsync();
                foreach (var x in items)
                {
                    result.Add(new crewexpire()
                    {
                        Title = x.TypeTitle,
                        Remaining = x.Remain,
                        IsExpired = x.Remain <= 0,
                        IsExpiring = x.Remain <= 30,
                    });
                }


                //if (crew.RemainMedical <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "Medical",
                //        Remaining = crew.RemainMedical,
                //        IsExpired = crew.RemainMedical <= 0,
                //        IsExpiring = crew.RemainMedical <= 30,


                //    });
                ////Crew Member Certificate
                //if (crew.RemainCMC <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "Crew Member Certificate",
                //        Remaining = crew.RemainCMC,
                //        IsExpired = crew.RemainCMC <= 0,
                //        IsExpiring = crew.RemainCMC <= 30,


                //    });
                //if (crew.RemainCCRM <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "CCRM",
                //        Remaining = crew.RemainCCRM,
                //        IsExpired = crew.RemainCCRM <= 0,
                //        IsExpiring = crew.RemainCCRM <= 30,


                //    });
                ////Aviation Security
                //if (crew.RemainAvSec <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "Aviation Security",
                //        Remaining = crew.RemainAvSec,
                //        IsExpired = crew.RemainAvSec <= 0,
                //        IsExpiring = crew.RemainAvSec <= 30,


                //    });
                ////SEPT Theoretical 
                //if (crew.RemainSEPT <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "SEPT Theoretical",
                //        Remaining = crew.RemainSEPT,
                //        IsExpired = crew.RemainSEPT <= 0,
                //        IsExpiring = crew.RemainSEPT <= 30,


                //    });
                //if (crew.RemainSEPTP <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "SEPT Practical",
                //        Remaining = crew.RemainSEPTP,
                //        IsExpired = crew.RemainSEPTP <= 0,
                //        IsExpiring = crew.RemainSEPTP <= 30,


                //    });

                ////Dangerous Goods
                //if (crew.RemainDG <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "Dangerous Goods",
                //        Remaining = crew.RemainDG,
                //        IsExpired = crew.RemainDG <= 0,
                //        IsExpiring = crew.RemainDG <= 30,


                //    });
                //if (crew.RemainSMS <= 30)
                //    result.Add(new crewexpire()
                //    {
                //        Title = "SMS",
                //        Remaining = crew.RemainSMS,
                //        IsExpired = crew.RemainSMS <= 0,
                //        IsExpiring = crew.RemainSMS <= 30,


                //    });
                //if (crew.IsCabin == 1)
                //{
                //    if (crew.RemainFirstAid <= 30)
                //        result.Add(new crewexpire()
                //        {
                //            Title = "First Aid",
                //            Remaining = crew.RemainFirstAid,
                //            IsExpired = crew.RemainFirstAid <= 0,
                //            IsExpiring = crew.RemainFirstAid <= 30,


                //        });
                //}
                //if (crew.IsCockpit == 1)
                //{
                //    if (crew.RemainLPR <= 30)
                //        result.Add(new crewexpire()
                //        {
                //            Title = "LPR",
                //            Remaining = crew.RemainLPR,
                //            IsExpired = crew.RemainLPR <= 0,
                //            IsExpiring = crew.RemainLPR <= 30,


                //        });
                //    //Skill Test/Proficiency
                //    if (crew.RemainProficiency <= 30)
                //        result.Add(new crewexpire()
                //        {
                //            Title = "Skill Test/Proficiency",
                //            Remaining = crew.RemainProficiency,
                //            IsExpired = crew.RemainProficiency <= 0,
                //            IsExpiring = crew.RemainProficiency <= 30,


                //        });
                //    if (crew.RemainColdWeather <= 30)
                //        result.Add(new crewexpire()
                //        {
                //            Title = "Cold Weather",
                //            Remaining = crew.RemainColdWeather,
                //            IsExpired = crew.RemainColdWeather <= 0,
                //            IsExpiring = crew.RemainColdWeather <= 30,


                //        });
                //    if (crew.RemainHotWeather <= 30)
                //        result.Add(new crewexpire()
                //        {
                //            Title = "Hot Weather",
                //            Remaining = crew.RemainHotWeather,
                //            IsExpired = crew.RemainHotWeather <= 0,
                //            IsExpiring = crew.RemainHotWeather <= 30,


                //        });
                //}
                return Ok(result);
                //  return unitOfWork.CourseRepository.GetViewCertificates().Where(q => q.PersonId == id && q.IsLast == 1 && q.Remain != null && q.Remain <= 30).OrderBy(q => q.ExpireStatus).ThenBy(q => q.Remain);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }


        [Route("odata/employees/certificates/all/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCertificate> GetEmployeesCertificatesAll(int id)
        {
            try
            {
                return unitOfWork.CourseRepository.GetViewCertificates().Where(q => q.PersonId == id).OrderByDescending(q => q.IsLast).ThenBy(q => q.ExpireStatus).ThenBy(q => q.Remain).ThenByDescending(q => q.DateIssue);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

        }
        [Route("odata/employee/certificates/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCertification> GetEmployeesCertifications(int id)
        {

            return unitOfWork.PersonRepository.GetViewCertifications().Where(q => q.EmployeeId == id);
            // return db.ViewAirports.AsNoTracking() ;


        }
        [Route("odata/employee/certificates/type/{id}/{tid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCertification> GetEmployeesCertificationsByType2(int id, int tid)
        {

            return unitOfWork.PersonRepository.GetViewCertifications().Where(q => q.EmployeeId == id && q.TypeId == tid);
            // return db.ViewAirports.AsNoTracking() ;


        }
        [Route("odata/employee/certificates/{id}/{tid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewCertification> GetEmployeesCertificationsByType(int id, int tid)
        {

            return unitOfWork.PersonRepository.GetViewCertifications().Where(q => q.EmployeeId == id && q.TypeId == tid);
            // return db.ViewAirports.AsNoTracking() ;


        }
        [Route("odata/certificate/save")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostCertificate(Models.Certification dto)
        {
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var result = await unitOfWork.PersonRepository.SaveCertification(dto);
            if (result.Code != HttpStatusCode.OK)
                return result;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);


        }

        [Route("odata/certificate/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostDeleteCertificate(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            var result = await unitOfWork.PersonRepository.DeleteCertification(id);
            if (result.Code != HttpStatusCode.OK)
                return result;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);


        }
        [Route("odata/employee/active")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostEmployeeActive(dynamic dto)
        {
            var Id = Convert.ToInt32(dto.Id);
            await unitOfWork.PersonRepository.ActiveEmployee(Id);
            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            return Ok(dto);

        }






        [Route("odata/profile/save/new")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostEmployee2(ViewModels.Employee dto)
        {
            try
            {
                 return Ok(true);
                if (dto == null)
                    return Exceptions.getNullException(ModelState);
                if (!ModelState.IsValid)
                {
                    // return BadRequest(ModelState);
                    return Exceptions.getModelValidationException(ModelState);
                }
                var validate = unitOfWork.PersonRepository.Validate(dto);
                if (validate.Code != HttpStatusCode.OK)
                    return validate;

                ///////////////////////////////////////
                //   if (dto.Person.VisaExpireDate!=null)
                //    dto.Person.VisaExpireDate=((DateTime)dto.Person.VisaExpireDate).AddHours(3).AddMinutes(30);
                ///////////////////////////////////////////
                Person person = null;
                if (dto.PersonId != -1)
                    person = await unitOfWork.PersonRepository.GetPersonById(dto.PersonId);
                else
                    person = await unitOfWork.PersonRepository.GetPersonByNID(dto.Person.NID);
                if (person == null)
                {
                    person = new Person();
                    person.DateCreate = DateTime.Now;
                    unitOfWork.PersonRepository.Insert(person);
                }
                ViewModels.Person.Fill(person, dto.Person);
                PersonCustomer personCustomer = await unitOfWork.PersonRepository.GetPersonCustomer((int)dto.CustomerId, dto.Person.PersonId);
                if (personCustomer == null)
                {
                    personCustomer = new PersonCustomer();

                    person.PersonCustomers.Add(personCustomer);
                }
                ViewModels.PersonCustomer.Fill(personCustomer, dto);
                Employee employee = await unitOfWork.PersonRepository.GetEmployee(personCustomer.Id);
                if (employee == null)
                    employee = new Employee();
                personCustomer.Employee = employee;
                ViewModels.Employee.Fill(employee, dto);
                unitOfWork.PersonRepository.FillEmployeeLocations(employee, dto);

                unitOfWork.PersonRepository.FillAircraftTypes(person, dto);
                unitOfWork.PersonRepository.FillDocuments(person, dto);
                unitOfWork.PersonRepository.FillEducations(person, dto);
                unitOfWork.PersonRepository.FillExps(person, dto);
                unitOfWork.PersonRepository.FillRatings(person, dto);



                var saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;

                dto.Id = employee.Id;
                return Ok(dto);

            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null)
                    msg += "    " + ex.InnerException.Message;
                return Ok(msg);
            }


        }


        [Route("odata/app/employee/update")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostAppEmployee(ViewModels.EmployeeAbs dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }

            var result = await unitOfWork.PersonRepository.UpdateAppEmployee(dto);


            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(dto);




        }
        //======================================
        [Route("odata/matchinglist/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostMatchingList(dynamic dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }

            var firstId = Convert.ToInt32(dto.First);
            var secondId = Convert.ToInt32(dto.Second);


            MatchingList entity = new MatchingList()
            {
                FirstCrewId = firstId,
                SecondCrewId = secondId,
                IsActive = true,
            };

            unitOfWork.PersonRepository.Insert(entity);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }

        //=======================================

        [Route("odata/person/misc/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostPersonMisc(ViewModels.PersonMiscellaneous dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.PersonMiscRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            PersonMisc entity = null;

            if (dto.Id == -1)
            {
                entity = new PersonMisc();
                unitOfWork.PersonMiscRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.PersonMiscRepository.GetByID(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.PersonMiscellaneous.Fill(entity, dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            dto.Id = entity.Id;
            return Ok(dto);
        }

        [Route("odata/person/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeletePerson(dynamic dto)
        {
            var PersonId = Convert.ToInt32(dto.PersonId);
            var entity = await unitOfWork.PersonRepository.GetByID(PersonId);

            if (entity == null)
            {
                return NotFound();
            }





            unitOfWork.PersonRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
            {
                return new CustomActionResult(HttpStatusCode.NotAcceptable, "The selected item can not be deleted because of its related logs in Flight Pockect system.");
                // return saveResult;
            }

            return Ok(dto);
        }


        [Route("odata/person/misc/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeletePersonMisc(ViewModels.PersonMiscellaneous dto)
        {
            var entity = await unitOfWork.PersonMiscRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }



            var canDelete = unitOfWork.PersonMiscRepository.CanDelete(entity);
            if (canDelete.Code != HttpStatusCode.OK)
                return canDelete;

            unitOfWork.PersonMiscRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }

        [Route("odata/matchinglist/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteMatchingList(dynamic dto)
        {
            var id = Convert.ToInt32(dto.Id);
            var entity = await unitOfWork.PersonRepository.GetMatchingListById(id);

            if (entity == null)
            {
                return NotFound();
            }



            unitOfWork.PersonRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }

        [Route("odata/employee/nid/{cid}/{nid}")]
        public async Task<IHttpActionResult> GetEmployee(string nid, int cid)
        {
            //soosk
            var employee = await unitOfWork.PersonRepository.GetEmployeeDtoByNID(nid, cid);
            return Ok(employee);
        }

        [Route("odata/employee/view/nid/{cid}/{nid}")]
        public async Task<IHttpActionResult> GetEmployeeForView(string nid, int cid)
        {
            //soosk
            var employee = await unitOfWork.PersonRepository.GetEmployeeViewDtoByNID(nid, cid);
            return Ok(employee);
        }

        [Route("odata/employee/{id}")]
        public async Task<IHttpActionResult> GetEmployeeById(int id)
        {
            var employee = await unitOfWork.PersonRepository.GetEmployeeDtoByID(id);
            return Ok(employee);
        }
        [Route("odata/employee/profile/{id}")]
        public async Task<IHttpActionResult> GetEmployeeProfileById(int id)
        {
            var employee = await unitOfWork.PersonRepository.GetEmployeeDtoByID(id);
            return Ok(employee);
        }


        [Route("odata/employee/training/card/{id}")]
        public async Task<IHttpActionResult> GetTrainingCard(int id)
        {
            var employee = await unitOfWork.PersonRepository.GetTrainingCard(id);
            return Ok(employee);
        }

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
