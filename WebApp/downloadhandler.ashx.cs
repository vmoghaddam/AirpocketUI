using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace WebApp
{
    /// <summary>
    /// Summary description for downloadhandler
    /// </summary>
    public class downloadhandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            var step = "a";
            try
            {
                string param = context.Request.QueryString["t"];
                if (param == "bookarchive")
                {
                    var id = Convert.ToInt32(context.Request.QueryString["id"]);
                    FileManager.createBookArchived(id);
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("Done");
                }
                if (param == "book")
                {
                    //Zip
                    //var id =Convert.ToInt32( context.Request.QueryString["id"]);
                    //var archive = FileManager.getBookArchivedFiles(id);
                    //context.Response.ContentType = "text/plain";
                    //context.Response.Write("Hellow");



                    //context.Response.Clear();
                    //context.Response.ContentType = "application/octet-stream";
                    //context.Response.AddHeader("content-disposition", "attachment;filename=" + Path.GetFileName(archive));
                    //context.Response.WriteFile(archive);

                    //context.Response.End();
                    var id = Convert.ToInt32(context.Request.QueryString["id"]);
                    var files = FileManager.getBookFiles(id);
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("downloading");



                    context.Response.Clear();
                    context.Response.ContentType = "application/octet-stream";
                    foreach (var f in files)
                    {
                        context.Response.AddHeader("content-disposition", "attachment;filename=" + Path.GetFileName(f));
                        context.Response.WriteFile(f);

                    }

                }
                if (param == "bookfile")
                {
                    step = "b";
                    ////////////////////////////////////////
                    var id = Convert.ToInt32(context.Request.QueryString["id"]);
                    step = "c";

                   
                    step = "cc";
                    var files = FileManager.getBookFilesSingle(id);
                    step = "d";
                    // context.Response.ContentType = "text/plain";
                    // context.Response.Write("downloading");



                    context.Response.Clear();
                    step = "e";
                    context.Response.ContentType = "application/octet-stream";
                    foreach (var f in files)
                    {
                        context.Response.AddHeader("content-disposition", "inline;filename=" + Path.GetFileName(f));
                        context.Response.WriteFile(f);

                    }
                    ///////////////////
                    //var stream = new FileStream(f, FileMode.Open, FileAccess.Read);
                    // var content= new StreamContent(stream);
                    // content.Headers.ContentDisposition = new ContentDispositionHeaderValue("inline");
                    // content.Headers.ContentDisposition.FileName = Path.GetFileName(f);
                    // content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");
                    // //var response =context.Request.CreateResponse(HttpStatusCode.OK);
                    // //response.Content = content;
                    // //return response;
                    // context.Response.StatusCode = 200;
                    // context.Response.


                }
            }
            catch (Exception ex)
            {
                context.Response.ContentType = "text/plain";
                context.Response.Write(step + "     " + ex.Message + "   Inner MSG:" + (ex.InnerException != null ? ex.InnerException.Message : "NONE"));
            }

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}