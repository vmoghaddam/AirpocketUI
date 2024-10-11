using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace EPAGriffinAPI
{
    public class CustomActionResult<T> : IHttpActionResult
    {

        System.Net.HttpStatusCode statusCode;

        T data;

        public System.Net.HttpStatusCode Code { get { return statusCode; } }

        public CustomActionResult(System.Net.HttpStatusCode statusCode, T data)
        {

            this.statusCode = statusCode;

            this.data = data;

        }
        public HttpResponseMessage CreateResponse(System.Net.HttpStatusCode statusCode, T data)
        {

            HttpRequestMessage request = new HttpRequestMessage();
            request.Properties.Add(System.Web.Http.Hosting.HttpPropertyKeys.HttpConfigurationKey, new HttpConfiguration());

            HttpResponseMessage response = request.CreateResponse(statusCode, data);

            return response;

        }
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(CreateResponse(this.statusCode, this.data));
        }

    }

    public class CustomActionResult : IHttpActionResult
    {

        private System.Net.HttpStatusCode statusCode;

        public object data;
        public System.Net.HttpStatusCode Code { get { return statusCode; } }
        public CustomActionResult(System.Net.HttpStatusCode statusCode, object data)
        {

            this.statusCode = statusCode;

            this.data = data;

        }
        public HttpResponseMessage CreateResponse(System.Net.HttpStatusCode statusCode, object data)
        {

            HttpRequestMessage request = new HttpRequestMessage();
            request.Properties.Add(System.Web.Http.Hosting.HttpPropertyKeys.HttpConfigurationKey, new HttpConfiguration());

            HttpResponseMessage response = request.CreateResponse(statusCode, data);

            return response;

        }
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(CreateResponse(this.statusCode, data));
        }

    }

    //class CustomResolver : DefaultContractResolver
    //{
    //    protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
    //    {
    //        JsonProperty prop = base.CreateProperty(member, memberSerialization);

    //        if (prop.DeclaringType != typeof(PseudoContext) &&
    //            prop.PropertyType.IsClass &&
    //            prop.PropertyType != typeof(string))
    //        {
    //            prop.ShouldSerialize = obj => false;
    //        }

    //        return prop;
    //    }
    //}
}