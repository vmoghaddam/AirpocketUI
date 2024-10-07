//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net.Http;
//using System.Web.Http;
//using Microsoft.Owin.Security.OAuth;
//using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.Owin.Security.OAuth;
using System.Web.Http.ExceptionHandling;
using System.Diagnostics;

namespace EPAGriffinAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
           config.Services.Add(typeof(IExceptionLogger), new TraceExceptionLogger());
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.SetTimeZoneInfo(TimeZoneInfo.Utc);
            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Formatters.Insert(0, new JsonDotNetFormatter());
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            ODataModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<EPAGriffinAPI.Models.Option>("Options");

            
            config.Select().Expand().Filter().OrderBy().MaxTop(null).Count();
            config.MapODataServiceRoute(
                routeName: "ODataRoute",
               routePrefix: "OData",
                model: builder.GetEdmModel());
             

        }
    }

    public class JsonDotNetFormatter : MediaTypeFormatter
    {
        public JsonDotNetFormatter()
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/json"));
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
        }

        public override bool CanReadType(Type type)
        {
            return true;
        }

        public override bool CanWriteType(Type type)
        {
            return true;
        }

        public override async Task<object> ReadFromStreamAsync(Type type, Stream readStream, HttpContent content, IFormatterLogger formatterLogger)
        {
            using (var reader = new StreamReader(readStream))
            {
                return JsonConvert.DeserializeObject(await reader.ReadToEndAsync(), type);
            }
        }

        public override async Task WriteToStreamAsync(Type type, object value, Stream writeStream, HttpContent content, TransportContext transportContext)
        {
            if (value == null) return;
            using (var writer = new StreamWriter(writeStream))
            {
                await writer.WriteAsync(JsonConvert.SerializeObject(value, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
            }
        }
    }

    public class TraceExceptionLogger : ExceptionLogger
    {
        public override void Log(ExceptionLoggerContext context)
        {
            var xxx=context.Request;
            Trace.TraceError(context.ExceptionContext.Exception.ToString());
        }
    }
}
