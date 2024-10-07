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
using System.Net.Http;
using Newtonsoft.Json;
using DevExtreme.AspNet.Data;

 

namespace EPAGriffinAPI.Controllers
{
     
    public class PivotController : ApiController
    {
        private EPAGRIFFINEntities _context;
        public PivotController()
        {
            _context = new EPAGRIFFINEntities();
        }

        [Route("odata/pivot/fuel/total")]
        public /*IEnumerable<RptFuelLeg>*/HttpResponseMessage GetFuelTotal(DataSourceLoadOptions loadOptions)
        {
            //var options = Request.GetQueryNameValuePairs()
            //    .ToDictionary(x => x.Key, x => JsonConvert.DeserializeObject(x.Value)); //parsed options

            ////see the QueryHelper class for the implementation
            //var query = _context.RptFuelLegs.AsEnumerable()
            //    .FilterByOptions(options)   //filtering
            //    .SortByOptions(options)     //sorting
            //    .PageByOptions(options);    //paging
            //return query;
            loadOptions.PrimaryKey = new[] { "ID" };

            var orders = _context.RptFuelLegs;//from o in _context.RptFuelLegs
                                              //select new
                                              //{
                                              //    o.ID,
                                              //    o.PYear,
                                              //    o.PMonth,
                                              //    o.PMonthName,
                                              //    o.PDate,
                                              //    o.PDayName,
                                              //    o.Used,
                                              //    o.AircraftType,
                                              //    o.TypeId,

            //};
            var x1 = DataSourceLoader.Load(orders, loadOptions);
            
            return Request.CreateResponse(x1);
        }
        public RptFuelLeg Get(int id)
        {
            return _context.RptFuelLegs.Find(id);
        }
        public int Post(RptFuelLeg cat)
        {
            _context.RptFuelLegs.Add(cat);
            return _context.SaveChanges();
        }
        public int Put(RptFuelLeg cat)
        {
            RptFuelLeg categ = _context.RptFuelLegs.Find(cat.ID);
            //categ.CategoryName = cat.CategoryName;
            return _context.SaveChanges();
        }
        public int Delete(int id)
        {
            RptFuelLeg cat = _context.RptFuelLegs.Find(id);
            _context.RptFuelLegs.Remove(cat);
            return _context.SaveChanges();
        }
    }
}
