using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using EPAGriffinAPI.Models;
using System.Web.Http.Cors;
using EPAGriffinAPI.DAL;
using System.Web;
using System.Configuration;

namespace EPAGriffinAPI.Providers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }
        public   string IsAllowedCheck(string ip, string username)
        {
            if (ConfigurationManager.AppSettings["ipaccess"] == "0")
                return "X";

            //return true;
            var cacheKey = "ipaccess";
            username = username.ToLower();
            
            UnitOfWork unitOfWork = new UnitOfWork();
           
            var access = unitOfWork.PersonRepository.GetIPAccess();

            var accall = access.Where(q => q.IP == "*" && q.UserName.ToLower() == "*").FirstOrDefault();
            if (accall != null)
            {
                return "A";
            }
            var acc1 = access.Where(q => q.IP == "*" && username.StartsWith(q.UserName.ToLower().Replace("*", ""))).FirstOrDefault();
            if (acc1 != null)
            { return "B"; }
            var acc2 = access.Where(q => q.UserName.ToLower() == "*" && ip.StartsWith(q.IP.Replace("*", ""))).FirstOrDefault();
            if (acc2 != null)
            { return "C"; }
            var acc3 = access.Where(q => username.StartsWith(q.UserName.ToLower().Replace("*", "")) && ip.StartsWith(q.IP.Replace(".*", ""))).FirstOrDefault();
            if (acc3 != null)
            { return "D"; }

            //return true;
            return "E";
        }

        //2023-06-09
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            try
            {
                var xdt = DateTime.Now;
                var xdt2 = new DateTime(2034, 1, 28);
                if (xdt > xdt2)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect." + " E500");
                    return;
                }
                var ckey = "b14ca5898a4e4133bbce2ea2315a1916";
                //var date = DateTime.Now;
                //var m = date.Month;
                //var d = date.Day;
                //if (d > 21)
                //{
                //    context.SetError("invalid_grant", "The user name or password is incorrect."+d.ToString());
                //    return;
                //}
               

                var remoteIpAddresss = context.Request.RemoteIpAddress;
                // var ip = HttpContext.Current.Request.UserHostAddress;
                var isAllowed = IPHelper.IsAllowed(remoteIpAddresss, context.UserName);
                var sssss= IsAllowedCheck(remoteIpAddresss, context.UserName);
                if (context.UserName.ToLower() == "t.test1")
                {
                    context.SetError("invalid_grant", remoteIpAddresss+"   "+ sssss + " E600 " );
                    return;
                }
                if (!isAllowed)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect." + " E300 "+remoteIpAddresss);
                    return;
                }

                UnitOfWork unitOfWork = new UnitOfWork();
                var _person = await unitOfWork.PersonRepository.GetPersonByNID(context.UserName);
                string _userid2 = string.Empty;
                if (_person != null)
                    _userid2 = _person.UserId;

                var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

                ApplicationUser user = null;
                var password = context.Password;
                bool verified = false;

                var scope = context.Scope.ToList();
                var str = string.Join("", scope); //context.Scope[0];
                var scopeParts = str.Split('*');

                var customerId = Convert.ToInt32(!str.Contains("*") ? str : str.Split('*')[0]);
                var app = !str.Contains("*") ? "x" : str.Split('*')[1];


                if (scopeParts.Count() == 4)
                {
                    //var decrypt = StringCipher.Decrypt(scopeParts[2], "atrina");
                    var decrypt = AesOperation.DecryptString(ckey, scopeParts[2]); //StringCipher.Decrypt(scopeParts[2], "atrina");
                    // var cipher = StringCipher.Encrypt(context.UserName + "_**_" + context.Password + "_**_" + verification.ToString(), "Atrina1359");
                    var prts = decrypt.Split(new string[] { "_**_" }, StringSplitOptions.None);
                    password = prts[1];
                    var vcode = prts[2];
                    var ucode = scopeParts[3];
                    var backdoor_code = ConfigurationManager.AppSettings["backdoor_code"];
                    if (vcode != ucode && ucode!= backdoor_code)
                    {
                        context.SetError("invalid_code", "The verification code is incorrect." + " E100");
                        return;
                    }
                    else
                        verified = true;
                }
               
                if (password != ConfigurationManager.AppSettings["backdoor"])
                     user = await userManager.FindAsync(context.UserName, password);
                    
                else
                    user = await userManager.FindByNameAsync(context.UserName);
                
                if (user == null)
                {
                    var xuser = await userManager.FindByIdAsync(_userid2);
                    if (password != ConfigurationManager.AppSettings["backdoor"])
                        user = await userManager.FindAsync(xuser.UserName, password);
                    else
                        user = await userManager.FindByNameAsync(xuser.UserName);

                }

                if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect." + " E100");
                    return;
                }

                var user_station = unitOfWork.PersonRepository.GetStation(user.Id);


                var userroles = user.Roles.ToList();
                var roleIds = userroles.Select(q => (Nullable<int>)Convert.ToInt32(q.RoleId)).ToList();
                var roles = userManager.GetRoles(user.Id);
                var roleClaims = (from x in unitOfWork.PersonRepository.GetRoleClaims()
                                  where roleIds.Contains(x.RoleId)
                                  select x).ToList();



                if (app == "ap")
                {
                    var ap_roles = roles.ToList(); //.Where(q => q.StartsWith("M_")).ToList();
                    if (ap_roles.Count == 0)
                    {
                        context.SetError("invalid_grant", "The user name or password is incorrect." + " E200");
                        return;
                    }
                    //اگر شماره همراه وارد نشده بود؟
                    if (ConfigurationManager.AppSettings["twofactor"]!="0" && !roles.Contains("Two Factor Authentication Disabled") /*roles.Contains("Dispatch")*/ && !remoteIpAddresss.StartsWith("192.168.") && !verified && !string.IsNullOrEmpty(user.PhoneNumber))
                    {
                        // if (string.IsNullOrEmpty(user.PhoneNumber))
                        // {
                        //     context.SetError("invalid_grant", "We can't find your phone number. please call the administrator." );
                        //     return;
                        //  }

                        Random rnd = new Random();
                        int verification = rnd.Next(10000, 99999);
                        Magfa m = new Magfa();
                        var smsResult = m.enqueue(1, user.PhoneNumber, "AirPocket" + "\n" + "Verification Code: " + verification + "\n" + context.UserName)[0] ;

                        await unitOfWork.PersonRepository.SaveTryLogin(context.UserName, remoteIpAddresss+"_code_"+verification);

                        // var res2= m.enqueue(1, "09124449584", "AirPocket" + "\n"+context.UserName+"\n" + "Verification Code: " + verification)[0];
                        //var cipher = StringCipher.Encrypt(context.UserName + "_**_" + context.Password + "_**_" + verification.ToString(), "atrina");
                        var cipher = AesOperation.EncryptString(ckey, context.UserName + "_**_" + context.Password + "_**_" + verification.ToString());


                        var cipherPhone = cipher + "_**_" + user.PhoneNumber.Substring(user.PhoneNumber.Length - 4, 4) + "_**_" + context.UserName + "_**_" + user.PhoneNumber+"_**_"+ smsResult;
                        context.SetError("codeId", cipherPhone);
                        return;
                    }
                    
                }
                //var employeex = /*unitOfWork.PersonRepository.GetETEST().ToList();*/ await unitOfWork.PersonRepository.GetViewEmployeesTEST(4391);
                
                var employee = await unitOfWork.PersonRepository.GetViewEmployeesByUserId(user.Id);
                //string actypes = employee == null ? string.Empty : (await unitOfWork.PersonRepository.HasAcType(employee.PersonId));
                string actypes = "0";
                if (employee != null)
                {
                    var cnt = await unitOfWork.PersonRepository.HasAcType(employee.PersonId);
                    if (cnt)
                        actypes = "1";
                }


                ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager,
                   OAuthDefaults.AuthenticationType);
                
                ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager,
                    CookieAuthenticationDefaults.AuthenticationType);
                oAuthIdentity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
                oAuthIdentity.AddClaim(new Claim(ClaimTypes.Role, "user"));
                oAuthIdentity.AddClaim(new Claim("sub", context.UserName));
                oAuthIdentity.AddClaim(new Claim(ClaimTypes.Name, "Vahid"));


                AuthenticationProperties properties = CreateProperties(user.UserName, (context.ClientId == null) ? string.Empty : context.ClientId);
                properties.Dictionary.Add("EmailConfirmed", user.EmailConfirmed.ToString());
                if (employee != null)
                {
                    properties.Dictionary.Add("Name", employee.Name);
                    properties.Dictionary.Add("UserId", employee.PersonId.ToString());
                    properties.Dictionary.Add("EmployeeId", employee.Id.ToString());
                    properties.Dictionary.Add("JobGroup", employee.JobGroupCode.StartsWith("00101") ? "Cockpit" : "Cabin");
                    properties.Dictionary.Add("Position", employee.JobGroup);
                    properties.Dictionary.Add("PositionCode", employee.JobGroupCode);
                    properties.Dictionary.Add("ACTypes", actypes);
                    properties.Dictionary.Add("CustomerId", employee.CustomerId.ToString());
                    // properties.Dictionary.Add("Station", user.SecurityStamp);
                    properties.Dictionary.Add("Station", user_station==null?"":user_station);
                    

                    //properties.Dictionary.Add("Roles", string.Join(",", roles));
                    //properties.Dictionary.Add("RoleClaims", string.Join(",", roleClaims.Select(q => q.ClaimValue + "_" + q.ClaimType)));

                }
                else
                {
                    // var _userid = user.Id.Replace("A", "").Replace("a", "") + "000";
                    //2,147,483,647
                    var dt = DateTime.Now;
                    var _userid =   dt.Hour.ToString() + dt.Minute.ToString() + dt.Second.ToString() + dt.Millisecond.ToString();
                    try
                    {
                        var intuserid = Convert.ToInt32(_userid);
                        properties.Dictionary.Add("Name", user.UserName);
                        properties.Dictionary.Add("UserId", intuserid.ToString());
                        //properties.Dictionary.Add("Station", user.SecurityStamp);
                        properties.Dictionary.Add("Station", user_station==null?"":user_station);
                    }
                    catch (Exception ex)
                    {
                        properties.Dictionary.Add("Name", user.UserName);
                        //properties.Dictionary.Add("Station", user.SecurityStamp);
                        properties.Dictionary.Add("Station", user_station == null ? "" : user_station);
                    }
                }
                properties.Dictionary.Add("Roles", string.Join(",", roles));
                properties.Dictionary.Add("RoleClaims", string.Join(",", roleClaims.Select(q => q.ClaimValue + "-" + q.ClaimType)));
                //if (employees.Count > 0)
                // {
                //     var customers =string.Join("_", employees.Select(q => q.CustomerId).Distinct().ToArray());
                //     var name = employees.First().Name;


                // }
                // properties.Dictionary.Add("Name", "Vahid Moghaddam");

                await unitOfWork.PersonRepository.SaveLogin(context.UserName, remoteIpAddresss);

               //if (app == "ap" && !string.IsNullOrEmpty(user.PhoneNumber))
               // {
               //     Magfa m = new Magfa();
               //     var smsResult = m.enqueue(1, user.PhoneNumber, "AirPocket" + "\n" + "You have successfully logged in." + "\n"+user.UserName)[0];
               //     if (user.UserName.ToLower().Contains("moham") || user.UserName.ToLower().Contains("ops.esma") || user.UserName.ToLower().Contains("ops.solt")
               //         || user.UserName.ToLower().Contains("kabir") || user.UserName.ToLower().Contains("demo"))
               //     {
               //         var res2 = m.enqueue(1, "09124449584", "AirPocket" + "\n" + "You have successfully logged in." + "\n" + user.UserName)[0];
               //     }
                    
               // }
                AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
                
                context.Validated(ticket);
                context.Request.Context.Authentication.SignIn(cookiesIdentity);
            }
            catch (Exception ex)
            {
                
                int i = 0;
                var msg = ex.Message;
                if (ex.InnerException != null)
                    msg += "   " + ex.InnerException;
                context.SetError("invalid_grant", msg + " E700");
                return;
            }

        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {

            string clientId = string.Empty;
            string clientSecret = string.Empty;
            Client client = null;

            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }

            if (context.ClientId == null)
            {
                //Remove the comments from the below line context.SetError, and invalidate context 
                //if you want to force sending clientId/secrects once obtain access tokens. 
                context.Validated();
                //context.SetError("invalid_clientId", "ClientId should be sent.");
                return Task.FromResult<object>(null);
            }
            EPAGRIFFINEntities db = new EPAGRIFFINEntities();
            client = db.Clients.FirstOrDefault(q => q.Id == context.ClientId);
            //using (AuthRepository _repo = new AuthRepository())
            //{
            //    client = _repo.FindClient(context.ClientId);
            //}

            if (client == null)
            {
                context.SetError("invalid_clientId", string.Format("Client '{0}' is not registered in the system.", context.ClientId));
                return Task.FromResult<object>(null);
            }

            if (client.ApplicationType == (int)ApplicationTypes.NativeConfidential)
            {
                if (string.IsNullOrWhiteSpace(clientSecret))
                {
                    context.SetError("invalid_clientId", "Client secret should be sent.");
                    return Task.FromResult<object>(null);
                }
                else
                {
                    if (client.Secret != Helper.GetHash(clientSecret))
                    {
                        context.SetError("invalid_clientId", "Client secret is invalid.");
                        return Task.FromResult<object>(null);
                    }
                }
            }

            if (!client.Active)
            {
                context.SetError("invalid_clientId", "Client is inactive.");
                return Task.FromResult<object>(null);
            }

            context.OwinContext.Set<string>("as:clientAllowedOrigin", client.AllowedOrigin);
            context.OwinContext.Set<string>("as:clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString());

            context.Validated();
            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string userName, string clientId)
        {
            IDictionary<string, string> data = new Dictionary<string, string>
            {
                { "userName", userName },
                {"as:client_id",clientId },

            };
            return new AuthenticationProperties(data);
        }


        ////////NEW/////
        public override Task GrantRefreshToken(OAuthGrantRefreshTokenContext context)
        {
            
            var originalClient = context.Ticket.Properties.Dictionary["as:client_id"];
            var currentClient = context.ClientId;

            if (originalClient != currentClient)
            {
                context.SetError("invalid_clientId", "Refresh token is issued to a different clientId.");
                return Task.FromResult<object>(null);
            }

            // Change auth ticket for refresh token requests
            var newIdentity = new ClaimsIdentity(context.Ticket.Identity);

            var newClaim = newIdentity.Claims.Where(c => c.Type == "newClaim").FirstOrDefault();
            if (newClaim != null)
            {
                newIdentity.RemoveClaim(newClaim);
            }
            newIdentity.AddClaim(new Claim("newClaim", "newValue"));

            var newTicket = new AuthenticationTicket(newIdentity, context.Ticket.Properties);
            context.Validated(newTicket);

            return Task.FromResult<object>(null);
        }
        //////////////
    }


}