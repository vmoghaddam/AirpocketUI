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
using System.Text;
using System.Configuration;
using System.IO;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class WeatherController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        private string apikey = "27e59a814e573389d5f88359e6ef9c89";
        string darkskyUrl = "https://api.darksky.net/";
        [Route("odata/weather/current/{lt}/{lg}")]
        public async Task<IHttpActionResult> GetWeatherCurrent(double lt,double lg)
        {
            var url = darkskyUrl + "forecast/" + apikey + "/" + lt + "," + lg + "?&exclude=hourly&units=ca";
            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.  
            request.Credentials = CredentialCache.DefaultCredentials;
            // Get the response.  
            WebResponse response =await request.GetResponseAsync();
            // Display the status.  
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams and the response.  
            reader.Close();
            response.Close();
            dynamic myObject = JsonConvert.DeserializeObject<dynamic>(responseFromServer);
            return Ok(myObject);
        }

        [Route("odata/weather/flight/{id}/{status}")]
        public async Task<IHttpActionResult> GetFlightWeather(int id,int status)
        {
            var result = await unitOfWork.FlightRepository.GetFlightWeather(id, status);
            return Ok(result.data);
        }

        [Route("odata/weather/flight/all/{id}")]
         
        // [Authorize]
        public async Task<IHttpActionResult> GetFlightWeathers(int id)
        {

            var result = await unitOfWork.FlightRepository.GetFlightWeathers(id);
            return Ok(result.data);

        }

        [Route("odata/weather/{lt}/{lg}/{time}")]
        public async Task<IHttpActionResult> GetWeatherByTime(decimal lt, decimal lg, string time)
        {
            DateTime dt = EPAGriffinAPI.Helper.BuildDateTimeFromYAFormat(time);
            var unix = (long)((dt).Subtract(new DateTime(1970, 1, 1))).TotalSeconds;


            var url = darkskyUrl + "forecast/" + apikey + "/" + lt + "," + lg + "," + unix + "?&exclude=hourly&units=ca";
            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.  
            request.Credentials = CredentialCache.DefaultCredentials;
            // Get the response.  
            WebResponse response =await request.GetResponseAsync();
            // Display the status.  
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams and the response.  
            reader.Close();
            response.Close();
            // dynamic myObject = JsonConvert.DeserializeObject<dynamic>(responseFromServer);
            // return responseFromServer;//Ok(myObject);
            dynamic myObject = JsonConvert.DeserializeObject<dynamic>(responseFromServer);
            return myObject;
        }

        [Route("odata/weather/current/hourly/{lt}/{lg}")]
        public async Task<IHttpActionResult> GetWeatherCurrentHourly(double lt, double lg)
        {
            var url = darkskyUrl + "forecast/" + apikey + "/" + lt + "," + lg + "?&units=ca";
            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.  
            request.Credentials = CredentialCache.DefaultCredentials;
            // Get the response.  
            WebResponse response = await request.GetResponseAsync();
            // Display the status.  
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams and the response.  
            reader.Close();
            response.Close();
            dynamic myObject = JsonConvert.DeserializeObject<dynamic>(responseFromServer);
            return Ok(myObject);
        }



        public  object  GetWeatherByTimeInternal(decimal lt, decimal lg,long time)
        {
            var url = darkskyUrl + "forecast/" + apikey + "/" + lt + "," + lg +","+time+ "?&units=ca";
            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.  
            request.Credentials = CredentialCache.DefaultCredentials;
            // Get the response.  
            WebResponse response =   request.GetResponse();
            // Display the status.  
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams and the response.  
            reader.Close();
            response.Close();
            // dynamic myObject = JsonConvert.DeserializeObject<dynamic>(responseFromServer);
            // return responseFromServer;//Ok(myObject);
            dynamic myObject = JsonConvert.DeserializeObject<dynamic>(responseFromServer);
            return myObject;
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
