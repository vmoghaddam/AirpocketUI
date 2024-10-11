using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

using System.Data.Entity;
using System.Data.Entity.Infrastructure;


using System.Web.Http.Description;

using System.Data.Entity.Validation;

using System.Web.Http.ModelBinding;

using System.Text;
using System.Configuration;
using Newtonsoft.Json;
using System.Web.Http.Cors;
using System.IO;
using System.Xml;
using System.Web;
using System.Text.RegularExpressions;
using Formatting = Newtonsoft.Json.Formatting;
using System.Data;
using System.Data.Common;
using System.Dynamic;
using ApiMSG.Models;
using System.Net.Http.Headers;
using System.Drawing;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using System.Threading;

namespace ApiMSG.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MVTController : ApiController
    {
        [Route("api/mail/mvt/{flightId}/{sender}/{user}/{password}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetIdeaUniqueSync(int flightId, string sender, string user, string password)
        {
            if (user != "vahid")
                return BadRequest("Not Authenticated");
            if (password != "Chico1359")
                return BadRequest("Not Authenticated");

            var helper = new MailHelper();
            var result = helper.CreateMVTMessage(flightId, sender);

            return Ok(result);
        }

        [Route("api/mail/ldm/{flightId}/{sender}/{user}/{password}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetLDMMessage(int flightId, string sender, string user, string password)
        {
            if (user != "vahid")
                return BadRequest("Not Authenticated");
            if (password != "Chico1359")
                return BadRequest("Not Authenticated");

            var helper = new MailHelper();
            var result = helper.CreateLDMMessage(flightId, sender);

            return Ok(result);
        }


        [Route("api/mail/mvt/apt/{flightId}/{sender}/{user}/{password}/{apt}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult SendMVTAPT(int flightId, string sender, string user, string password, string apt)
        {
            if (user != "vahid")
                return BadRequest("Not Authenticated");
            if (password != "Chico1359")
                return BadRequest("Not Authenticated");

            var helper = new MailHelper();
            var result = helper.CreateMVTMessageAPT(apt, flightId, sender);


            return Ok(result);
        }

         


        [Route("api/mvt/send/{user}/{password}/{force}/{day}/{fn}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetSendMVTByFN(string user, string password, string day, string fn, int force)
        {
            if (user != "fp")
                return BadRequest("Not Authenticated");
            if (password != "Z12345aA")
                return BadRequest("Not Authenticated");

            var helper = new MailHelper();
            var result = helper.CreateMVTMessageByFlightNo(day, fn, force);

            return Ok(result);
        }
    }
}
