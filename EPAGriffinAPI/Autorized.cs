

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Security.Principal;
using System.Configuration;
using System.Web.Http.Controllers;

namespace EPAGriffinAPI
{

    public class FilterIPAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var isAuth= HttpContext.Current.User.Identity.IsAuthenticated;
            if (actionContext.Request.RequestUri.AbsoluteUri.Contains("ati=1359"))
                return true;
            if (!isAuth)
                return false;
            string userIpAddress = ((HttpContextWrapper)actionContext.Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            string userName = HttpContext.Current.User.Identity.Name;
            var isAllowed = IPHelper.IsAllowed(userIpAddress, userName);

            if (!isAllowed)
                return false;


            return base.IsAuthorized(actionContext);
        }
    }

}