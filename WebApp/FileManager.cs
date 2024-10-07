using Ionic.Zip;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;


namespace WebApp
{
    public class FileManager
    {
        internal static string createBookArchived(int id)
        {
            var clientfiles = HttpContext.Current.Server.MapPath("~/upload/clientsfiles/");
            var archive = HttpContext.Current.Server.MapPath("~/archived/library-archived-" + id + ".zip");
            new Thread(() =>
            {

                string apiUrl = ConfigurationManager.AppSettings["api"] + "odata/library/books/file/" + id;

                File.Delete(archive);
                object input = new
                {

                };
                string inputJson = (new JavaScriptSerializer()).Serialize(input);
                //string inputJson = (new JavaScriptSerializer()).Serialize(input);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;

                string json = client.UploadString(apiUrl, inputJson);
                var book = (new JavaScriptSerializer()).Deserialize<BookDto>(json);
                if (book.Files.Count > 0)
                    using (ZipFile zip = new ZipFile())
                    {
                        zip.AlternateEncodingUsage = ZipOption.AsNecessary;
                        // zip.AddDirectoryByName("Files");
                        foreach (var f in book.Files)
                        {





                            var fn = clientfiles + f;
                            zip.AddFile(fn, book.Title.Replace(" ", "-").Replace("<", "-").Replace(">", "-").Replace(":", "-").Replace("/", "-").Replace("|", "-").Replace("*", "-").Replace("?", "-"));
                        }




                        zip.Save(archive);

                    }


            }).Start();
            return string.Empty;
        }
        internal static List<string> getBookFiles(int id)
        {
            string apiUrl = ConfigurationManager.AppSettings["api"] + "odata/library/books/file/" + id;
            object input = new
            {

            };
            string inputJson = (new JavaScriptSerializer()).Serialize(input);
            //string inputJson = (new JavaScriptSerializer()).Serialize(input);
            WebClient client = new WebClient();
            client.Headers["Content-type"] = "application/json";
            client.Encoding = Encoding.UTF8;

            string json = client.UploadString(apiUrl, inputJson);
            var book = (new JavaScriptSerializer()).Deserialize<BookDto>(json);
            var result = new List<string>();
            foreach (var f in book.Files)
            {





                var fn = HttpContext.Current.Server.MapPath("~/upload/clientsfiles/" + f);
                //zip.AddFile(fn, book.Title.Replace(" ", "-").Replace("<", "-").Replace(">", "-").Replace(":", "-").Replace("/", "-").Replace("|", "-").Replace("*", "-").Replace("?", "-"));
                result.Add(fn);
            }
            return result;

        }

        internal static List<string> getBookFilesSingle(int id)
        {
            string apiUrl = ConfigurationManager.AppSettings["api"] + "odata/library/books/file/single/" + id;
            object input = new
            {

            };
            string inputJson = (new JavaScriptSerializer()).Serialize(input);
            //string inputJson = (new JavaScriptSerializer()).Serialize(input);
            WebClient client = new WebClient();
            client.Headers["Content-type"] = "application/json";
            client.Encoding = Encoding.UTF8;

            string json = client.UploadString(apiUrl, inputJson);
            var book = (new JavaScriptSerializer()).Deserialize<BookDto>(json);
            var result = new List<string>();
            foreach (var f in book.Files)
            {

                var fn = HttpContext.Current.Server.MapPath("~/upload/clientsfiles/" + f);
                //zip.AddFile(fn, book.Title.Replace(" ", "-").Replace("<", "-").Replace(">", "-").Replace(":", "-").Replace("/", "-").Replace("|", "-").Replace("*", "-").Replace("?", "-"));
                result.Add(fn);
            }
            return result;

        }
        internal static string getBookArchivedFiles(int id)
        {
            string apiUrl = ConfigurationManager.AppSettings["api"] + "odata/library/books/file/" + id;



            var archive = HttpContext.Current.Server.MapPath("~/archived/library-archived-" + id + ".zip");
            if (!File.Exists(archive))
            {
                object input = new
                {

                };
                string inputJson = (new JavaScriptSerializer()).Serialize(input);
                //string inputJson = (new JavaScriptSerializer()).Serialize(input);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;

                string json = client.UploadString(apiUrl, inputJson);
                var book = (new JavaScriptSerializer()).Deserialize<BookDto>(json);

                using (ZipFile zip = new ZipFile())
                {
                    zip.AlternateEncodingUsage = ZipOption.AsNecessary;
                    // zip.AddDirectoryByName("Files");
                    foreach (var f in book.Files)
                    {





                        var fn = HttpContext.Current.Server.MapPath("~/upload/clientsfiles/" + f);
                        zip.AddFile(fn, book.Title.Replace(" ", "-").Replace("<", "-").Replace(">", "-").Replace(":", "-").Replace("/", "-").Replace("|", "-").Replace("*", "-").Replace("?", "-"));
                    }




                    zip.Save(archive);

                }

            }



            return archive;
        }
    }

    public class BookDto
    {

        public string Title { get; set; }

        List<string> files = new List<string>();
        public List<string> Files
        {
            get
            {
                if (files == null)
                    files = new List<string>();
                return files;
            }
            set { files = value; }
        }
    }
}