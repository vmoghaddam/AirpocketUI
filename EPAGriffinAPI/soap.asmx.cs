using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace EPAGriffinAPI
{
    /// <summary>
    /// Summary description for soap
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
   // [System.Web.Script.Services.ScriptService]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
  // [System.Web.Script.Services.ScriptService]
    public class soap : System.Web.Services.WebService
    {

        [WebMethod]
        public void HelloWorld()
        {
            HttpContext.Current.Response.Write("{property: value}");
        }
        [WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public /*List<ViewCrew>*/string  GetCrews(string job)
        {
            using (var _context = new EPAGRIFFINEntities()) {
                var crews = _context.ViewCrews.Where(q=>q.JobGroup==job).Take(20).ToList();
                var result = Newtonsoft.Json.JsonConvert.SerializeObject(crews);
                return result;
            }
        }

        [WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public  List<ViewCrew>  GetCrews2(string job)
        {
            using (var _context = new EPAGRIFFINEntities())
            {
                var crews = _context.ViewCrews.Where(q => q.JobGroup == job).Take(20).ToList();
               
                return crews;
            }
        }


    }
}
