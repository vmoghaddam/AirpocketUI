using DevExpress.DataAccess.Json;
using DevExpress.XtraPrinting.Caching;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
//using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Report
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {




            try
            {
                System.Net.ServicePointManager.ServerCertificateValidationCallback =
    ((senderx, certificate, chain, sslPolicyErrors) => true);
                string customer = WebConfigurationManager.AppSettings["customer"];
                string apiUrl = WebConfigurationManager.AppSettings["api_url"];
                string apiUrlNet = WebConfigurationManager.AppSettings["api_url_net"];
                string apiUrlv2 = WebConfigurationManager.AppSettings["api_urlv2"];
                string apiUrlExt = WebConfigurationManager.AppSettings["api_url_ext"];
                string apiUrlExtTemp = WebConfigurationManager.AppSettings["api_url_ext_temp"];
                string apiUrlTrn = WebConfigurationManager.AppSettings["api_url_trn"];
                string apiReportFlight = WebConfigurationManager.AppSettings["api_reportflight"];
                string apiCao = WebConfigurationManager.AppSettings["api_cao"];
                string apiapsbUrl = WebConfigurationManager.AppSettings["apiapsb_url"];


                string api_certificates = "https://ava.apitrn.aerotango.app/";
                // string apiCao = "https://ava.apicaox.airpocket.app/";

                string type = Request.QueryString["type"];
                if (string.IsNullOrEmpty(type))
                    type = "1";
                JsonDataSource dataSource = null;
                switch (type)
                {
                    case "opc":
                        string _x_nid = Request.QueryString["nid"];
                        string _x_pic = Request.QueryString["pid"];
                        // string airline = Request.QueryString["airline"];
                        // string aptdt = Request.QueryString["dt"];
                        // string aptuser = Request.QueryString["user"];
                        // string aptphone = Request.QueryString["phone"];
                        var rptopc = new rptOPC(_x_pic);
                        dataSource = new JsonDataSource();

                        dataSource.JsonSource = new UriJsonSource(new Uri("http://127.0.0.1/zprofile/api/profile/opc/nid/" + _x_nid));
                        dataSource.Fill();
                        rptopc.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptopc);
                        break;
                    case "1000":
                        int _log_crew_id =Convert.ToInt32( Request.QueryString["cid"]);
                        string _log_date = Request.QueryString["date"];
                        ASPxWebDocumentViewer1.OpenReport(new rptLogA(_log_crew_id));
                        break;
                    case "100":
                    // string coid = Request.QueryString["cid"];
                    // var reportAtt = new rptAtt(coid);
                    // ASPxWebDocumentViewer1.OpenReport(reportAtt);
                    // break;
                    case "att":
                        string coid2 = Request.QueryString["cid"];
                        //flypersia
                        //var reportAtt2 = new RptCourseProfile(coid2);
                        //ava
                        var reportAtt2 = new rptCourseProfileAVA1(coid2);
                        //atlas
                        // var reportAtt2 = new RptCourseProfileAtlas(coid2);
                        ASPxWebDocumentViewer1.OpenReport(reportAtt2);
                        break;
                    //api/courses/passed/history
                    case "11":
                        string pid = Request.QueryString["pid"];
                        // string airline = Request.QueryString["airline"];
                        // string aptdt = Request.QueryString["dt"];
                        // string aptuser = Request.QueryString["user"];
                        // string aptphone = Request.QueryString["phone"];
                        var rptcer = new rptCertificates();
                        dataSource = new JsonDataSource();

                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrlTrn + "api/trainingcard/" + pid));
                        dataSource.Fill();
                        rptcer.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptcer);
                        break;
                    case "test":
                        ASPxWebDocumentViewer1.OpenReport(new rptFPCFlyPersia());
                        break;
                    case "12":
                        string pid2 = Request.QueryString["pid"];
                        // string airline = Request.QueryString["airline"];
                        // string aptdt = Request.QueryString["dt"];
                        // string aptuser = Request.QueryString["user"];
                        // string aptphone = Request.QueryString["phone"];
                        var rptcour = new rptCourses();
                        dataSource = new JsonDataSource();

                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrlTrn + "api/courses/passed/history/" + pid2));
                        dataSource.Fill();
                        rptcour.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptcour);
                        break;
                    case "13":
                        string aptirdaily = Request.QueryString["apt"];
                        string airlineirdaily = Request.QueryString["airline"];
                        string aptdtfromirdaily = Request.QueryString["dtfrom"];


                        var rptaptirdaily = new rptAptDailyCaspian();
                        dataSource = new JsonDataSource();

                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrlExt + "api/flights/apt/range/type2/1?apt=" + aptirdaily + "&airline=" + airlineirdaily + "&dtfrom=" + aptdtfromirdaily));
                        dataSource.Fill();
                        rptaptirdaily.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptaptirdaily);
                        break;
                    case "14":
                        string yearcp = Request.QueryString["year"];
                        string monthcp = Request.QueryString["month"];
                        string region = Request.QueryString["region"];
                        var rptcp = new rptCityPair(yearcp, monthcp, region);
                        dataSource = new JsonDataSource();
                        //var cpurl = apiUrlv2 + "odata/citypair/report?year=" + yearcp + "&month=" + monthcp + "&dom=" + (region == "DOM" ? 1 : 0);
                        var cpurl = /*"https://apireportflight.apvaresh.com/api/citypair/report?year="*/
                                apiReportFlight + "api/citypair/report?year=" + yearcp + "&month=" + monthcp + "&dom=" + (region == "DOM" ? 1 : 0);
                        dataSource.JsonSource = new UriJsonSource(new Uri(cpurl));
                        dataSource.Fill();
                        rptcp.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptcp);
                        break;
                    case "15":
                        string rosterDate = Request.QueryString["date"];
                        string rosterRev = Request.QueryString["rev"];

                        var rptroster = new rptRoster(rosterDate, rosterRev);
                        dataSource = new JsonDataSource();
                        var rosterurl = /*"https://fleet.flypersia.aero/expapi/"*//*"https://api.apchabahar.ir/"*//*"http://127.0.0.1/zapi/"*/apiUrl + "api/roster/report/date/?df=" + rosterDate + "&revision=" + rosterRev;
                        dataSource.JsonSource = new UriJsonSource(new Uri(rosterurl));
                        dataSource.Fill();
                        rptroster.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptroster);
                        break;
                    case "16":
                        string rosterDate1 = Request.QueryString["date"];
                        string rosterRev1 = Request.QueryString["rev"];

                        var rptrosterSec = new rptRosterSecurity();
                        dataSource = new JsonDataSource();
                        var rosterurlsec = /*"http://127.0.0.1/expapi/"*/apiUrl + "api/roster/report/date/?df=" + rosterDate1 + "&revision=" + rosterRev1;
                        dataSource.JsonSource = new UriJsonSource(new Uri(rosterurlsec));
                        dataSource.Fill();
                        rptrosterSec.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptrosterSec);
                        break;
                    case "17":
                        string asrFlightId = Request.QueryString["fid"];


                        var rptasr = new rptASR();
                        dataSource = new JsonDataSource();
                        var rptasrurl = apiUrlExt + "/api/asr/flight/view/" + asrFlightId;
                        dataSource.JsonSource = new UriJsonSource(new Uri(rptasrurl));
                        dataSource.Fill();
                        rptasr.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptasr);
                        break;
                    case "18E":
                        List<_person> cer_ids = new List<_person>();
                        using (WebClient client = new WebClient())
                        {
                            // اگر نیاز به تنظیم encoding باشد:
                            client.Headers[HttpRequestHeader.ContentType] = "application/json";

                            string json = client.DownloadString("http://localhost:4005/api/certificate/flykish/all");

                            cer_ids = JsonConvert.DeserializeObject<List<_person>>(json);
                             
                        }

                        foreach(var x in cer_ids)
                        {
                            string cerId_e = x.Id.ToString();
                            var rptfpc_e = new rptFPCAVA(); //new rptFPCAir1(); //new rptFPC();
                            dataSource = new JsonDataSource();
                            //var rptfpcurl_e = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            var rptfpcurl_e = /*"https://ava.apitrn.airpocket.app/"*/"http://localhost:4005" + "/api/certificate/" + cerId_e;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
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
                                string filePath = @"C:\Users\vahid\Desktop\ava\FlyKishCertificates\"+(x.Name.Replace(" ","_")+"__"+x.Title)+".pdf"; // مسیر دلخواه
                                using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                                {
                                    ms.CopyTo(file);
                                }
                            }
                        }
                       
                        break;
                    case "18":
                        string cerId = Request.QueryString["id"];


                        if (customer == "flypersia")
                        {
                            var rptfpc =  new rptFPCFlyPersia(); //new rptFPCAir1(); //new rptFPC();
                            dataSource = new JsonDataSource();
                            var rptfpcurl = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl));
                            dataSource.Fill();

                            rptfpc.DataSource = dataSource;
                            ASPxWebDocumentViewer1.OpenReport(rptfpc);
                        }
                        if (customer == "ava")
                        {
                            var rptfpc = new rptFPCAVA(); //new rptFPCAir1(); //new rptFPC();
                            dataSource = new JsonDataSource();
                            var rptfpcurl = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl));
                            dataSource.Fill();

                            rptfpc.DataSource = dataSource;
                            ASPxWebDocumentViewer1.OpenReport(rptfpc);
                        }
                        if (customer == "chabahar")
                        {
                            var rptfpc = new rptFPCCHB(); //new rptFPCAir1(); //new rptFPC();
                            dataSource = new JsonDataSource();
                            var rptfpcurl = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl));
                            dataSource.Fill();

                            rptfpc.DataSource = dataSource;
                            ASPxWebDocumentViewer1.OpenReport(rptfpc);
                        }
                        if (customer == "mehr")
                        {
                            var rptfpc = new rptFPCMehr(); //new rptFPCAir1(); //new rptFPC();
                            dataSource = new JsonDataSource();
                            var rptfpcurl = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl));
                            dataSource.Fill();

                            rptfpc.DataSource = dataSource;
                            ASPxWebDocumentViewer1.OpenReport(rptfpc);
                        }
                        else
                        {
                            var rptfpc = new rptFPCVaresh(); //new rptFPCAir1(); //new rptFPC();
                            dataSource = new JsonDataSource();
                            var rptfpcurl = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                            dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl));
                            dataSource.Fill();

                            rptfpc.DataSource = dataSource;
                            ASPxWebDocumentViewer1.OpenReport(rptfpc);
                        }

                      
                        break;
                    case "19":
                        string vrFlightId = Request.QueryString["fid"];


                        var rptvr = new rptVR();
                        dataSource = new JsonDataSource();
                        var rptvrurl = "https://fly.apiapsb.myaero.tech/" + "/api/vr/view//" + vrFlightId;
                        dataSource.JsonSource = new UriJsonSource(new Uri(rptvrurl));
                        dataSource.Fill();
                        rptvr.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptvr);
                        break;
                    case "vrk":
                        string vrkFlightId = Request.QueryString["fid"];


                        var rptvrk = new rptVRKarun();
                        dataSource = new JsonDataSource();
                        var rptvrurlk = apiapsbUrl + "/api/vr/view//" + vrkFlightId;
                        dataSource.JsonSource = new UriJsonSource(new Uri(rptvrurlk));
                        dataSource.Fill();
                        rptvrk.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptvrk);
                        break;

                    case "mor":
                        string mor_id = Request.QueryString["fid"];


                        var rptmor = new rptMOR();
                        dataSource = new JsonDataSource();
                        var rptmorurl = "https://apiapsb.apvaresh.com/api/qa/sf/mor/" + mor_id;
                        dataSource.JsonSource = new UriJsonSource(new Uri(rptmorurl));
                        dataSource.Fill();
                        rptmor.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptmor);
                        break;
                    case "csr":
                        string csr_id = Request.QueryString["fid"];


                        var rptcsr = new rptCSR();
                        dataSource = new JsonDataSource();
                        var rptcsrurl = "https://apiapsb.apvaresh.com/api/qa/sf/csr/" + csr_id;
                        dataSource.JsonSource = new UriJsonSource(new Uri(rptcsrurl));
                        dataSource.Fill();
                        rptcsr.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptcsr);
                        break;


                    //pasco
                    //case "18":
                    //    string cerId = Request.QueryString["id"];


                    //    var rptfpc = new rptFPCPasco();
                    //    dataSource = new JsonDataSource();
                    //    var rptfpcurl = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                    //    dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl));
                    //    dataSource.Fill();

                    //    rptfpc.DataSource = dataSource;

                    //   // var cachedReportSource = new CachedReportSource(rptfpc, new MemoryDocumentStorage());
                    //   // ASPxWebDocumentViewer1.DocumentSource = cachedReportSource;
                    //   // cachedReportSource.CreateDocumentAsync();

                    //    ASPxWebDocumentViewer1.OpenReport(rptfpc);
                    //    break;
                    case "8":
                        string apt = Request.QueryString["apt"];
                        string airline = Request.QueryString["airline"];
                        string aptdt = Request.QueryString["dt"];
                        string aptuser = Request.QueryString["user"];
                        string aptphone = Request.QueryString["phone"];
                        var rptapt = new rptApt();
                        dataSource = new JsonDataSource();

                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrlExt + "api/flights/apt?apt=" + apt + "&airline=" + airline + "&dt=" + aptdt + "&user=" + aptuser + "&phone=" + aptphone));
                        dataSource.Fill();
                        rptapt.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptapt);
                        break;
                    case "9":
                        string apti = Request.QueryString["apt"];
                        string airlinei = Request.QueryString["airline"];
                        string aptdti = Request.QueryString["dt"];
                        string aptuseri = Request.QueryString["user"];
                        string aptphonei = Request.QueryString["phone"];
                        var rptapti = new rptAptInt();
                        dataSource = new JsonDataSource();

                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrlExt + "api/flights/apt?apt=" + apti + "&airline=" + airlinei + "&dt=" + aptdti + "&user=" + aptuseri + "&phone=" + aptphonei));
                        dataSource.Fill();
                        rptapti.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptapti);
                        break;
                    case "10":
                        string aptir = Request.QueryString["apt"];
                        string airlineir = Request.QueryString["airline"];
                        string aptdtfromir = Request.QueryString["dtfrom"];
                        string aptdttoir = Request.QueryString["dtto"];

                        var rptaptir = new RptAptRange();
                        dataSource = new JsonDataSource();

                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrlExt + "api/flights/apt/range/1?apt=" + aptir + "&airline=" + airlineir + "&dtfrom=" + aptdtfromir + "&dtto=" + aptdttoir));
                        dataSource.Fill();
                        rptaptir.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptaptir);
                        break;
                    case "1":
                        try
                        {
                            using (StreamWriter _testData = new StreamWriter(HttpContext.Current.Server.MapPath("~/_error1.txt"), true))
                            {
                                _testData.WriteLine("A"); // Write the file.
                            }


                            string year = Request.QueryString["year"];
                            string month = Request.QueryString["month"];
                            var rptFlight = new RptFormA();
                            dataSource = new JsonDataSource();
                            using (StreamWriter _testData = new StreamWriter(HttpContext.Current.Server.MapPath("~/_error2.txt"), true))
                            {
                                _testData.WriteLine("B"); // Write the file.
                            }
                            dataSource.JsonSource = new UriJsonSource(new Uri(apiCao + "api/cao/report/forma/" + year + "/" + month));
                            dataSource.Fill();
                            using (StreamWriter _testData = new StreamWriter(HttpContext.Current.Server.MapPath("~/_error3.txt"), true))
                            {
                                _testData.WriteLine("C"); // Write the file.
                            }
                            rptFlight.DataSource = dataSource;
                            ASPxWebDocumentViewer1.OpenReport(rptFlight);
                            using (StreamWriter _testData = new StreamWriter(HttpContext.Current.Server.MapPath("~/_error4.txt"), true))
                            {
                                _testData.WriteLine("D"); // Write the file.
                            }
                        }
                        catch (Exception ex)
                        {
                            var msg = ex.Message;
                            if (ex.InnerException != null)
                                msg += "    " + ex.InnerException.Message;
                            using (StreamWriter _testData = new StreamWriter(HttpContext.Current.Server.MapPath("~/_error_msg.txt"), true))
                            {
                                _testData.WriteLine(msg); // Write the file.
                            }
                        }
                        break;
                    case "5":
                        string year1 = Request.QueryString["year"];

                        var rptFormAYear = new RptFormAYear();
                        dataSource = new JsonDataSource();
                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrl + "odata/forma/year/" + year1));
                        dataSource.Fill();
                        rptFormAYear.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptFormAYear);
                        break;
                    case "2":
                        string year2 = Request.QueryString["year"];
                        string month2 = Request.QueryString["month"];
                        var rptmovaled = new RptMovaled();
                        dataSource = new JsonDataSource();
                        //dataSource.JsonSource = new UriJsonSource(new Uri(apiUrl + "odata/forma/month/" + year2 + "/" + month2));
                        dataSource.JsonSource = new UriJsonSource(new Uri(apiCao + "api/cao/report/forma/" + year2 + "/" + month2));
                        dataSource.Fill();
                        rptmovaled.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptmovaled);
                        break;
                    case "6":
                        string year3 = Request.QueryString["year"];

                        var rptmovaledy = new rptMovaledYear();
                        dataSource = new JsonDataSource();
                        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrl + "odata/forma/year/" + year3));
                        dataSource.Fill();
                        rptmovaledy.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptmovaledy);
                        break;
                    case "3":
                        string period = Request.QueryString["p"];
                        string cats = Request.QueryString["cats"];
                        DateTime dt = Convert.ToDateTime(Request.QueryString["dt"]);
                        DateTime df = Convert.ToDateTime(Request.QueryString["df"]);
                        string dtstr = (Request.QueryString["dt"]);
                        string dfstr = (Request.QueryString["df"]);
                        string _ggrange = (Request.QueryString["range"]);

                        var rptDelay = new rptDelay(dt, df);
                        dataSource = new JsonDataSource();
                        _ggrange = "1";
                        var url = apiUrlNet + "odata/delays/periodic/report/" + period + "/" + cats + "?dt=" + dtstr + "&df=" + dfstr + "&range=" + _ggrange;
                        dataSource.JsonSource = new UriJsonSource(new Uri(url));
                        dataSource.Fill();
                        rptDelay.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptDelay);
                        break;
                    case "30":
                        string periodi = Request.QueryString["p"];
                        string catsi = Request.QueryString["cats"];
                        DateTime dti = Convert.ToDateTime(Request.QueryString["dt"]);
                        DateTime dfi = Convert.ToDateTime(Request.QueryString["df"]);
                        string dtstri = (Request.QueryString["dt"]);
                        string dfstri = (Request.QueryString["df"]);
                        string _ggrangei = (Request.QueryString["range"]);

                        var rptDelayi = new rptDelay(dti, dfi);
                        dataSource = new JsonDataSource();
                        var urli = apiUrl + "odata/delays/periodic/report/int/" + periodi + "/" + catsi + "?dt=" + dtstri + "&df=" + dfstri + "&range=" + _ggrangei;
                        dataSource.JsonSource = new UriJsonSource(new Uri(urli));
                        dataSource.Fill();
                        rptDelayi.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptDelayi);
                        break;

                    case "4":
                        string crewid = Request.QueryString["id"];
                        var rpttc = new RptCabinTrainingCard();
                        dataSource = new JsonDataSource();
                        var urltc = apiUrl + "odata/employee/training/card/" + crewid;
                        dataSource.JsonSource = new UriJsonSource(new Uri(urltc));
                        dataSource.Fill();
                        rpttc.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rpttc);
                        break;
                    case "7":
                        var rptfp = new rptRosterFP();
                        dataSource = new JsonDataSource();
                        dataSource.JsonSource = new UriJsonSource(new Uri("http://localhost:58908/odata/roster/report/fp?day=2021-03-13"));
                        dataSource.Fill();
                        rptfp.DataSource = dataSource;
                        ASPxWebDocumentViewer1.OpenReport(rptfp);
                        break;

                    case "grh":
                        string grh_id = Request.QueryString["fid"];

                        var rptgrh = new rptTest(grh_id);
                        ASPxWebDocumentViewer1.OpenReport(rptgrh);
                        break;
                    case "hazard":
                        string hazard_id = Request.QueryString["fid"];

                        var rpthazard = new rptHazard(hazard_id);
                        
                      
                        ASPxWebDocumentViewer1.OpenReport(rpthazard);
                        break;


                    //case "course":
                    //    var base_folder = @"C:\Users\vahid\Desktop\ava\output_certificates\";
                    //    string course_id = Request.QueryString["cid"];
                    //    List<_person> course_cer_ids = new List<_person>();
                    //    using (WebClient client = new WebClient())
                    //    {
                    //        // اگر نیاز به تنظیم encoding باشد:
                    //        client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    //        string json = client.DownloadString(api_certificates+"api/certificate/course/all/" +course_id);

                    //        course_cer_ids = JsonConvert.DeserializeObject<List<_person>>(json);

                    //    }
                    //    string new_path = base_folder+"course_"+course_id;
                    //    string zip_path = base_folder + "course_" + course_id+"_zip";

                    //    if (Directory.Exists(new_path))
                    //        Directory.Delete(new_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                    //    Directory.CreateDirectory(new_path);



                    //    if (Directory.Exists(zip_path))
                    //        Directory.Delete(zip_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                    //    Directory.CreateDirectory(zip_path);
                    //    foreach (var x in course_cer_ids)
                    //    {
                    //        string cerId_e = x.Id.ToString();
                    //        var rptfpc_e = new rptFPCAVA(); //new rptFPCAir1(); //new rptFPC();
                    //        dataSource = new JsonDataSource();
                    //        //var rptfpcurl_e = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                    //        var rptfpcurl_e = /*"https://ava.apitrn.airpocket.app/"*/api_certificates + "/api/certificate/" + cerId_e;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                    //        dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl_e));
                    //        dataSource.Fill();
                    //        var format = "pdf";
                    //        rptfpc_e.DataSource = dataSource;
                    //        string contentType = string.Format("application/{0}", format);
                    //        using (MemoryStream ms = new MemoryStream())
                    //        {
                    //            switch (format)
                    //            {
                    //                case "pdf":
                    //                    contentType = "application/pdf";
                    //                    rptfpc_e.ExportToPdf(ms);
                    //                    break;
                    //                    // ...
                    //            }
                    //            ms.Position = 0;

                    //            // ذخیره در فایل
                    //            string filePath =  new_path + @"\" + (x.Title+"_"+x.Name.Replace(" ", "_") ) +"_"+course_id+ ".pdf"; // مسیر دلخواه
                    //            using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                    //            {
                    //                ms.CopyTo(file);
                    //            }
                    //        }
                    //    }

                        
                    //    string sourceDir = new_path;
                    //    string zipPath = zip_path+@"\"+"course_"+course_id+".zip";

                    //    // اگر فایل مقصد وجود دارد، حذفش کن تا خطا نگیری (اختیاری)
                    //    if (File.Exists(zipPath)) File.Delete(zipPath);

                    //    // includeBaseDirectory=false یعنی محتوای فولدر، نه خود فولدر، در ریشه‌ی زیپ قرار می‌گیرند
                    //    ZipFile.CreateFromDirectory(sourceDir, zipPath, CompressionLevel.Optimal, includeBaseDirectory: false);

                    //    //Response.Clear();
                    //    //Response.Buffer = false; // برای فایل‌های بزرگ مفید است
                    //    //Response.ContentType = "application/zip";

                    //    //// برای سازگاری با نام فارسی/یونیکد
                    //    //Response.AddHeader("Content-Disposition",
                    //    //    $"attachment; filename=\"{zipPath}\"; filename*=UTF-8''{Uri.EscapeDataString(zipPath)}");

                    //    //var fi = new FileInfo(zipPath);
                    //    //Response.AddHeader("Content-Length", fi.Length.ToString());

                    //    //// ارسال کارا از روی دیسک (بدون خواندن کامل در حافظه)
                    //    //Response.TransmitFile(zipPath);

                    //    //// End باعث ThreadAbortException می‌شود؛ بهتر است:
                    //    //Response.Flush();
                    //    //HttpContext.Current.ApplicationInstance.CompleteRequest();

                    //    break;

                    case "courses":
                        var base_folder = @"C:\Users\vahid\Desktop\ava\output_certificates\";
                        var cids= Request.QueryString["cid"].Split('_');
                        foreach(var course_id in cids)
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

                                        // ذخیره در فایل
                                        string filePath = new_path + @"\" + (x.Title + "_" + x.Name.Replace(" ", "_")) + "_" + course_id + ".pdf"; // مسیر دلخواه
                                        using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                                        {
                                            ms.CopyTo(file);
                                        }
                                    }
                                }


                                string sourceDir = new_path;
                                string zipPath = zip_path + @"\" + "course_" + course_id + ".zip";

                                // اگر فایل مقصد وجود دارد، حذفش کن تا خطا نگیری (اختیاری)
                                if (File.Exists(zipPath)) File.Delete(zipPath);

                                // includeBaseDirectory=false یعنی محتوای فولدر، نه خود فولدر، در ریشه‌ی زیپ قرار می‌گیرند
                                ZipFile.CreateFromDirectory(sourceDir, zipPath, CompressionLevel.Optimal, includeBaseDirectory: false);
                                SendZipFile(zipPath, "report.zip");
                                //Response.Clear();
                                //Response.Buffer = false; // برای فایل‌های بزرگ مفید است
                                //Response.ContentType = "application/zip";

                                //// برای سازگاری با نام فارسی/یونیکد
                                //Response.AddHeader("Content-Disposition",
                                //    $"attachment; filename=\"{zipPath}\"; filename*=UTF-8''{Uri.EscapeDataString(zipPath)}");

                                //var fi = new FileInfo(zipPath);
                                //Response.AddHeader("Content-Length", fi.Length.ToString());

                                //// ارسال کارا از روی دیسک (بدون خواندن کامل در حافظه)
                                //Response.TransmitFile(zipPath);

                                //// End باعث ThreadAbortException می‌شود؛ بهتر است:
                                //Response.Flush();
                                //HttpContext.Current.ApplicationInstance.CompleteRequest();
                            }
                            catch (Exception ex)
                            {

                            }
                           
                        }





                        break;


                    //case "people":
                    //    var pbase_folder = @"C:\Users\vahid\Desktop\ava\output_certificates\";
                    //    string people_ids = Request.QueryString["pid"];
                    //    List<_person> people_cer_ids = new List<_person>();
                    //    using (WebClient client = new WebClient())
                    //    {
                    //        // اگر نیاز به تنظیم encoding باشد:
                    //        client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    //        string json = client.DownloadString(api_certificates + "api/certificate/people/all/" + people_ids);

                    //        course_cer_ids = JsonConvert.DeserializeObject<List<_person>>(json);

                    //    }
                    //    var _a1 = DateTime.Now.ToString("yyyy-MMM-dd");

                    //    string pnew_path = pbase_folder + "certificates_" + _a1;
                    //    string pzip_path = pbase_folder + "certificates_" + _a1 + "_zip";

                    //    if (Directory.Exists(pnew_path))
                    //        Directory.Delete(pnew_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                    //    Directory.CreateDirectory(pnew_path);



                    //    if (Directory.Exists(pzip_path))
                    //        Directory.Delete(pzip_path, recursive: true); // حتی اگر داخلش فایل/فولدر باشد

                    //    Directory.CreateDirectory(pzip_path);
                    //    foreach (var x in course_cer_ids)
                    //    {
                    //        string cerId_e = x.Id.ToString();
                    //        var rptfpc_e = new rptFPCAVA(); //new rptFPCAir1(); //new rptFPC();
                    //        dataSource = new JsonDataSource();
                    //        //var rptfpcurl_e = apiUrlExtTemp + "/api/certificate/" + cerId;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                    //        var rptfpcurl_e = /*"https://ava.apitrn.airpocket.app/"*/api_certificates + "/api/certificate/" + cerId_e;//apiUrlExtTemp + " / api/asr/flight/view/" + asrFlightId;
                    //        dataSource.JsonSource = new UriJsonSource(new Uri(rptfpcurl_e));
                    //        dataSource.Fill();
                    //        var format = "pdf";
                    //        rptfpc_e.DataSource = dataSource;
                    //        string contentType = string.Format("application/{0}", format);
                    //        using (MemoryStream ms = new MemoryStream())
                    //        {
                    //            switch (format)
                    //            {
                    //                case "pdf":
                    //                    contentType = "application/pdf";
                    //                    rptfpc_e.ExportToPdf(ms);
                    //                    break;
                    //                    // ...
                    //            }
                    //            ms.Position = 0;

                    //            // ذخیره در فایل
                    //            string filePath = pnew_path + @"\" + (x.Name.Replace(" ", "_") + "__" + x.Title) +"_"+x.Id+  ".pdf"; // مسیر دلخواه
                    //            using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                    //            {
                    //                ms.CopyTo(file);
                    //            }
                    //        }
                    //    }


                    //    string psourceDir = pnew_path;
                    //    string pzipPath = pzip_path + @"\" + "certificates_" + _a1 + ".zip";

                    //    // اگر فایل مقصد وجود دارد، حذفش کن تا خطا نگیری (اختیاری)
                    //    if (File.Exists(pzipPath)) File.Delete(pzipPath);

                    //    // includeBaseDirectory=false یعنی محتوای فولدر، نه خود فولدر، در ریشه‌ی زیپ قرار می‌گیرند
                    //    ZipFile.CreateFromDirectory(psourceDir, pzipPath, CompressionLevel.Optimal, includeBaseDirectory: false);

                    //    //Response.Clear();
                    //    //Response.Buffer = false; // برای فایل‌های بزرگ مفید است
                    //    //Response.ContentType = "application/zip";

                    //    //// برای سازگاری با نام فارسی/یونیکد
                    //    //Response.AddHeader("Content-Disposition",
                    //    //    $"attachment; filename=\"{zipPath}\"; filename*=UTF-8''{Uri.EscapeDataString(zipPath)}");

                    //    //var fi = new FileInfo(zipPath);
                    //    //Response.AddHeader("Content-Length", fi.Length.ToString());

                    //    //// ارسال کارا از روی دیسک (بدون خواندن کامل در حافظه)
                    //    //Response.TransmitFile(zipPath);

                    //    //// End باعث ThreadAbortException می‌شود؛ بهتر است:
                    //    //Response.Flush();
                    //    //HttpContext.Current.ApplicationInstance.CompleteRequest();

                    //    break;


                    default: break;
                }

                ////////////////////////////////////////////////////////////

                //string df = Request.QueryString["df"];
                //string dt = Request.QueryString["dt"];

                //string type = Request.QueryString["type"];
                //if (string.IsNullOrEmpty(type))
                //    type = "1";


                //string airlineId = Request.QueryString["airline"];
                //if (string.IsNullOrEmpty(airlineId))
                //    airlineId = "-1";
                //string flightStatusId = Request.QueryString["status"];
                //if (string.IsNullOrEmpty(flightStatusId))
                //    flightStatusId = "-1";
                //string from = Request.QueryString["from"];
                //if (string.IsNullOrEmpty(from))
                //    from = "-1";
                //string to = Request.QueryString["to"];
                //if (string.IsNullOrEmpty(to))
                //    to = "-1";
                //string employeeId = Request.QueryString["id"];

                //JsonDataSource dataSource = null;

                //switch (type)
                //{

                //    case "1":
                //        var rptFlight = new RptFlight(df,dt);
                //        dataSource = new JsonDataSource();
                //        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrl + "odata/crew/flights/app2/?id=" + employeeId + "&df=" + df + "&dt=" + dt + "&status=" + flightStatusId + "&airline=" + airlineId + "&report=" + type + "&from=" + from + "&to=" + to));
                //        dataSource.Fill();
                //        rptFlight.DataSource = dataSource;
                //        ASPxWebDocumentViewer1.OpenReport(rptFlight);
                //        break;
                //    case "easafcl16":
                //        var rptEASAFCL16 = new RptFlight();
                //        dataSource = new JsonDataSource();
                //        dataSource.JsonSource = new UriJsonSource(new Uri(apiUrl + "odata/crew/flights/app2/?id=" + employeeId + "&df=" + df + "&dt=" + dt + "&status=" + flightStatusId + "&airline=" + airlineId + "&report=" + type+"&from="+from+"&to="+to));
                //        dataSource.Fill();
                //        rptEASAFCL16.DataSource = dataSource;
                //        ASPxWebDocumentViewer1.OpenReport(rptEASAFCL16);
                //        break;
                //    default:
                //        break;

                //}
            }
            catch (Exception ex)
            {
                var exmsg = ex.Message;
                if (ex.InnerException != null)
                    exmsg += "   " + ex.InnerException.Message;

                //using (StreamWriter _testData = new StreamWriter(HttpContext.Current.Server.MapPath("~/_error.txt"), true))
                //{
                //    _testData.WriteLine(exmsg); // Write the file.
                //}
                throw new Exception(exmsg);
            }

        }


        private void SendZipFile(string physicalPath, string downloadName)
        {
            var fi = new System.IO.FileInfo(physicalPath);
            if (!fi.Exists)
            {
                Response.StatusCode = 404;
                Response.End(); // یا بهتر: CompleteRequest بعد از نوشتن پیام خطا
                return;
            }

            Response.Clear();
            Response.Buffer = false; // برای فایل‌های بزرگ
            Response.ContentType = "application/zip";

            // ساپورت نام فایل UTF-8
            var encoded = Uri.EscapeDataString(downloadName);
            Response.AddHeader("Content-Disposition",
                $"attachment; filename=\"{encoded}\"; filename*=UTF-8''{encoded}");

            Response.AddHeader("Content-Length", fi.Length.ToString());

            // سریع و کم‌مصرف: می‌سپاره به IIS
            Response.TransmitFile(fi.FullName);

            Response.Flush();
            HttpContext.Current.ApplicationInstance.CompleteRequest(); // بهتر از Response.End
        }
    }

    public class _person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Remark { get; set; }
    }
}