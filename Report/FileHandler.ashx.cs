using DevExpress.DataAccess.Json;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Configuration;

namespace Report
{
    /// <summary>
    /// Summary description for FileHandler
    /// </summary>
    public class FileHandler : IHttpHandler
    {
        // string api_certificates = "https://ava.apitrn.aerotango.app/";
        string api_certificates = WebConfigurationManager.AppSettings["api_url_trn"];
        string certificate_output_folder = WebConfigurationManager.AppSettings["certificate_output_folder"];
        public void ProcessRequest(HttpContext context)
        {
            //string param = context.Request.QueryString["t"];
            //if (param == "clientfiles")
            //{
            //    if (context.Request.Files.Count > 0)
            //    {
            //        List<string> fileNames = new List<string>();
            //        HttpFileCollection files = context.Request.Files;
            //        for (int i = 0; i < files.Count; i++)
            //        {
            //            HttpPostedFile file = files[i];
            //            var ext = System.IO.Path.GetExtension(file.FileName);
            //            var date = DateTime.Now;

            //            int rndint = RandomNumber(1, 100000);
            //            var key = date.Year.ToString() + date.Month.ToString() + date.Day.ToString() + date.Hour.ToString() + date.Minute.ToString() + date.Second.ToString() +
            //                date.Millisecond.ToString() + "_" + i.ToString() + "_" + rndint.ToString() + ext;
            //            var fname = context.Server.MapPath("~/upload/clientsfiles/" + key);
            //            file.SaveAs(fname);
            //            fileNames.Add(key);
            //        }


            //        //var records = Objs.xls_bill.getJSON("bill.xlsx");
            //        context.Response.ContentType = "text/plain";
            //        context.Response.Write(string.Join("@", fileNames));
            //    }
            //}




            JsonDataSource dataSource = null;
            string param = context.Request.QueryString["type"];
            if (param == "courses")
            {
                var base_folder = certificate_output_folder;
                var cids = context.Request.QueryString["cid"].Split('_');
                foreach (var course_id in cids)
                {
                    try
                    {
                        // string course_id = Request.QueryString["cid"];
                        List<_person> course_cer_ids = new List<_person>();
                        using (WebClient client = new WebClient())
                        {
                            // اگر نیاز به تنظیم encoding باشد:
                            client.Headers[HttpRequestHeader.ContentType] = "application/json";

                            string json = client.DownloadString(api_certificates + "api/certificate/course/all/" + course_id);

                            course_cer_ids = JsonConvert.DeserializeObject<List<_person>>(json);

                        }
                        string new_path = base_folder + "course_" + course_id + "_" + course_cer_ids.First().Remark;
                        string zip_path = base_folder + "course_" + course_id + "_zip";

                        if (Directory.Exists(new_path))
                            Directory.Delete(new_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                        Directory.CreateDirectory(new_path);



                        if (Directory.Exists(zip_path))
                            Directory.Delete(zip_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                        Directory.CreateDirectory(zip_path);
                        var course_title = "";
                        foreach (var x in course_cer_ids)
                        {
                            string cerId_e = x.Id.ToString();
                            var rptfpc_e = new rptFPCAVA(); //new rptFPCAir1(); //new rptFPC();
                            dataSource = new JsonDataSource();
                            //var rptfpcurl_e = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            var rptfpcurl_e = /*"https://ava.apitrn.airpocket.app/"*/api_certificates + "/api/certificate/" + cerId_e;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl_e));
                            dataSource.Fill();
                            var format = "pdf";
                            rptfpc_e.DataSource = dataSource;
                            string contentType = string.Format("application/{0}", format);
                            using (MemoryStream ms = new MemoryStream())
                            {
                                switch (format)
                                {
                                    case "pdf":
                                        contentType = "application/pdf";
                                        rptfpc_e.ExportToPdf(ms);
                                        break;
                                        // ...
                                }
                                ms.Position = 0;
                                course_title = x.Title.ToLower();
                                // ذخیره در فایل
                                string filePath = new_path + @"\" + (x.Title + "_" + x.Name.Replace(" ", "_")) + "_" + course_id + ".pdf"; // مسیر دلخواه
                                using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                                {
                                    ms.CopyTo(file);
                                }
                            }
                        }


                        string sourceDir = new_path;
                        string zipPath = zip_path + @"\" + "course_" + course_id + "_" + course_title + ".zip";

                        // اگر فایل مقصد وجود دارد، حذفش کن تا خطا نگیری (اختیاری)
                        if (File.Exists(zipPath)) File.Delete(zipPath);

                        // includeBaseDirectory=false یعنی محتوای فولدر، نه خود فولدر، در ریشه‌ی زیپ قرار می‌گیرند
                        ZipFile.CreateFromDirectory(sourceDir, zipPath, CompressionLevel.Optimal, includeBaseDirectory: false);


                        var physical = zipPath;
                        var fi = new FileInfo(physical);


                        context.Response.Clear();
                        context.Response.BufferOutput = false;
                        context.Response.ContentType = "application/zip";

                        var encoded = Uri.EscapeDataString("course_" + course_id + "_" + course_title + ".zip");
                        context.Response.AddHeader("Content-Disposition",
                            $"attachment; filename=\"{encoded}\"; filename*=UTF-8''{encoded}");
                        context.Response.AddHeader("Content-Length", fi.Length.ToString());
                        context.Response.TrySkipIisCustomErrors = true;

                        // ارسال فایل با IIS
                        context.Response.TransmitFile(fi.FullName);

                        // قطع چرخه
                        context.ApplicationInstance.CompleteRequest();
                    }
                    catch (Exception ex)
                    {

                    }

                }



            }
            if (param == "people")
            {
                var pbase_folder = certificate_output_folder; //@"C:\Users\vahid\Desktop\ava\output_certificates\";
                string people_ids = context.Request.QueryString["pid"];
                List<_person> people_cer_ids = new List<_person>();
                using (WebClient client = new WebClient())
                {
                    // اگر نیاز به تنظیم encoding باشد:
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string json = client.DownloadString(api_certificates + "api/certificate/people/all/" + people_ids);

                    people_cer_ids = JsonConvert.DeserializeObject<List<_person>>(json);

                }
                var _a1 = DateTime.Now.ToString("yyyy-MMM-dd-HHmm");

                string pnew_path = pbase_folder + "people_certificates_" + _a1;
                string pzip_path = pbase_folder + "people_certificates_" + _a1 + "_zip";

                if (Directory.Exists(pnew_path))
                    Directory.Delete(pnew_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                Directory.CreateDirectory(pnew_path);



                if (Directory.Exists(pzip_path))
                    Directory.Delete(pzip_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                Directory.CreateDirectory(pzip_path);
                foreach (var x in people_cer_ids)
                {
                    string cerId_e = x.Id.ToString();
                    var rptfpc_e = new rptFPCAVA(); //new rptFPCAir1(); //new rptFPC();
                    dataSource = new JsonDataSource();
                    //var rptfpcurl_e = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                    var rptfpcurl_e = /*"https://ava.apitrn.airpocket.app/"*/api_certificates + "/api/certificate/" + cerId_e;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                    dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl_e));
                    dataSource.Fill();
                    var format = "pdf";
                    rptfpc_e.DataSource = dataSource;
                    string contentType = string.Format("application/{0}", format);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        switch (format)
                        {
                            case "pdf":
                                contentType = "application/pdf";
                                rptfpc_e.ExportToPdf(ms);
                                break;
                                // ...
                        }
                        ms.Position = 0;

                        // ذخیره در فایل
                        string filePath = pnew_path + @"\" + (x.Name.Replace(" ", "_") + "_" + x.Title) + "_" + x.Id + ".pdf"; // مسیر دلخواه
                        using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                        {
                            ms.CopyTo(file);
                        }
                    }
                }


                string psourceDir = pnew_path;
                string pzipPath = pzip_path + @"\" + "people_certificates_" + _a1 + ".zip";

                // اگر فایل مقصد وجود دارد، حذفش کن تا خطا نگیری (اختیاری)
                if (File.Exists(pzipPath)) File.Delete(pzipPath);

                // includeBaseDirectory=false یعنی محتوای فولدر، نه خود فولدر، در ریشه‌ی زیپ قرار می‌گیرند
                ZipFile.CreateFromDirectory(psourceDir, pzipPath, CompressionLevel.Optimal, includeBaseDirectory: false);



                var physical = pzipPath;
                var fi = new FileInfo(physical);


                context.Response.Clear();
                context.Response.BufferOutput = false;
                context.Response.ContentType = "application/zip";

                var encoded = Uri.EscapeDataString("people_certificates_" + _a1 + ".zip");
                context.Response.AddHeader("Content-Disposition",
                    $"attachment; filename=\"{encoded}\"; filename*=UTF-8''{encoded}");
                context.Response.AddHeader("Content-Length", fi.Length.ToString());
                context.Response.TrySkipIisCustomErrors = true;

                // ارسال فایل با IIS
                context.Response.TransmitFile(fi.FullName);

                // قطع چرخه
                context.ApplicationInstance.CompleteRequest();

                //////////////////////
                ///////////////////////

            }

            if (param == "att")
            {
                var pbase_folder = certificate_output_folder;
                string cid = context.Request.QueryString["cid"];
                string pid = context.Request.QueryString["pid"];
                var cids = cid.Split('_');
                var format = "pdf";
                string contentType = string.Format("application/{0}", format);

                var _a1 = DateTime.Now.ToString("yyyy-MMM-dd-HHmm");

                string pnew_path = pbase_folder + "people_atts_"+pid+"_" + _a1;
                string pzip_path = pbase_folder + "people_atts_" + pid + "_" + _a1 + "_zip";

                if (Directory.Exists(pnew_path))
                    Directory.Delete(pnew_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                Directory.CreateDirectory(pnew_path);



                if (Directory.Exists(pzip_path))
                    Directory.Delete(pzip_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                Directory.CreateDirectory(pzip_path);


                foreach (var _cid in cids)
                {
                    try
                    {
                        var reportAtt2 = new rptCourseProfileAVA1(_cid);

                        using (MemoryStream ms = new MemoryStream())
                        {
                            switch (format)
                            {
                                case "pdf":
                                    contentType = "application/pdf";
                                    reportAtt2.ExportToPdf(ms);
                                    break;
                                    // ...
                            }
                            ms.Position = 0;

                            // ذخیره در فایل
                            string filePath = pnew_path + @"\" + _cid + ".pdf"; // مسیر دلخواه
                            using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                            {
                                ms.CopyTo(file);
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }




                }

                string psourceDir = pnew_path;
                string pzipPath = pzip_path + @"\" + "people_atts_" + _a1 + ".zip";

                // اگر فایل مقصد وجود دارد، حذفش کن تا خطا نگیری (اختیاری)
                if (File.Exists(pzipPath)) File.Delete(pzipPath);

                // includeBaseDirectory=false یعنی محتوای فولدر، نه خود فولدر، در ریشه‌ی زیپ قرار می‌گیرند
                ZipFile.CreateFromDirectory(psourceDir, pzipPath, CompressionLevel.Optimal, includeBaseDirectory: false);



                var physical = pzipPath;
                var fi = new FileInfo(physical);


                context.Response.Clear();
                context.Response.BufferOutput = false;
                context.Response.ContentType = "application/zip";

                var encoded = Uri.EscapeDataString("people_atts_" + _a1 + ".zip");
                context.Response.AddHeader("Content-Disposition",
                    $"attachment; filename=\"{encoded}\"; filename*=UTF-8''{encoded}");
                context.Response.AddHeader("Content-Length", fi.Length.ToString());
                context.Response.TrySkipIisCustomErrors = true;

                // ارسال فایل با IIS
                context.Response.TransmitFile(fi.FullName);

                // قطع چرخه
                context.ApplicationInstance.CompleteRequest();

                //////////////////////





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