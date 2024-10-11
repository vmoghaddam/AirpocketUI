////using System;
////using System.Collections.Generic;
////using System.Linq;
////using System.Net;
////using System.Net.Http;
////using System.Web.Http;
//using System.Data.Entity;
//using System.Data.Entity.Infrastructure;
//using System.Linq;
//using System.Net;
//using System.Threading.Tasks;
//using System.Web.Http;
//using Microsoft.AspNet.OData;
//using EPAGriffinAPI.Models;
//using System.Web.Http.Description;
//using System.Collections.Generic;
//using System;
//using System.Data.Entity.Validation;
//using System.Web.Http.Cors;
//using System.Web.Http.ModelBinding;
//using EPAGriffinAPI.DAL;
//using System.Text;
//using System.Configuration;
//using Newtonsoft.Json;
//using System.Web;
//using Syncfusion.JavaScript.Models;
//using Syncfusion.EJ.Export;
//using System.Collections;
//using System.Reflection;
//using Syncfusion.EJ;
//using Syncfusion.XlsIO;
//using WebSampleBrowser.Gantt.Model;


//using System.Web.Script.Serialization;

//namespace EPAGriffinAPI.Controllers
//{
//    [EnableCors(origins: "*", headers: "*", methods: "*")]
//    public class GanttController : ApiController
//    {
//        //[System.Web.Http.ActionName("ExcelExport")]
//        [Route("odata/ExcelExport/")]
//        [AcceptVerbs("POST,GET")]
//        public IHttpActionResult ExcelExport()
//        {
//            string ganttModel = HttpContext.Current.Request.Params["GanttModel"];
//            GanttProperties ganttProperty = ConvertGanttObject(ganttModel);
//            ExcelExport exp = new ExcelExport();
//            TaskDetailsCollection task = new TaskDetailsCollection();
//            IEnumerable<TaskDetails> data = task.GetDataSource();
//            exp.Export(ganttProperty, data, "ExcelExport.xlsx", ExcelVersion.Excel2010, new GanttExportSettings() { Theme = ExportTheme.FlatAzure });
//            return Ok(true);
//        }

//        [System.Web.Http.ActionName("PdfExport")]
//        [AcceptVerbs("POST")]
//        public void GanttPdfExport()
//        {
//            string ganttModel = HttpContext.Current.Request.Params["GanttModel"];
//            string locale = HttpContext.Current.Request.Params["locale"];
//            GanttProperties ganttProperty = ConvertGanttObject(ganttModel);
//            PdfExport exp = new PdfExport();
//            TaskDetailsCollection task = new TaskDetailsCollection();
//            IEnumerable<TaskDetails> data = task.GetDataSource();
//            GanttPdfExportSettings settings = new GanttPdfExportSettings();
//            settings.EnableFooter = true;
//            settings.IsFitToWidth = true;
//            settings.ProjectName = "Project Tracker";
//            settings.Locale = locale;
//            exp.Export(ganttProperty, data, settings, "Gantt");
//        }

//        private GanttProperties ConvertGanttObject(string ganttProperty)
//        {
//            JavaScriptSerializer serializer = new JavaScriptSerializer();
//            IEnumerable div = (IEnumerable)serializer.Deserialize(ganttProperty, typeof(IEnumerable));
//            GanttProperties ganttProp = new GanttProperties();
//            foreach (KeyValuePair<string, object> dataSource in div)
//            {
//                var property = ganttProp.GetType().GetProperty(dataSource.Key, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
//                if (property != null)
//                {
//                    Type type = property.PropertyType;
//                    string serialize = serializer.Serialize(dataSource.Value);
//                    object value = serializer.Deserialize(serialize, type);
//                    property.SetValue(ganttProp, value, null);
//                }
//            }
//            return ganttProp;
//        }
//    }
//}
