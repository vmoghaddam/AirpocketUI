using mpNuget;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Threading;
using System.Web;

namespace EPAGriffinAPI
{
    public class Email
    {
        string dispatchEmail = ConfigurationManager.AppSettings["email_dispatch"];
        string dispatchTitle = ConfigurationManager.AppSettings["email_dispatch_title"];
        string dispatchEmailPassword = "123456@aA";// "Ss12#$56&*90" ;//ConfigurationManager.AppSettings["email_dispatch_password"];
        string dispatchEmailHost = ConfigurationManager.AppSettings["email_dispatch_host"];
        string dispatchEmailPort = ConfigurationManager.AppSettings["email_dispatch_port"];
        string caoMSGEmail = ConfigurationManager.AppSettings["email_cao_message"];
        string IsMVTEnabled = ConfigurationManager.AppSettings["mvt_enabled"];
        public bool SendEmailMVT(string body, string subject)
        {
            if (IsMVTEnabled == "0")
                return true;

            (new Thread(() =>
            {
                try
                {
                    var fromAddress = new MailAddress(dispatchEmail, dispatchTitle);
                    var toAddress = new MailAddress(caoMSGEmail, "CAO MSG");
                    string fromPassword = dispatchEmailPassword;



                    var smtp = new SmtpClient
                    {
                        //EnableSsl=true,
                        Host = dispatchEmailHost,
                        Port = Convert.ToInt32(dispatchEmailPort),
                        // EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(fromAddress.Address, fromPassword),

                    };
                    smtp.Timeout = 5000;
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = false,

                    })
                    {
                        //smtp.SendCompleted += (s, e) => {
                        //    smtp.Dispose();

                        //};
                        smtp.Send(message);
                    }

                    //////////////////////////////////////
                    //var smtp2 = new SmtpClient
                    //{
                    //    Host = dispatchEmailHost,
                    //    Port = Convert.ToInt32(dispatchEmailPort),
                    //    // EnableSsl = true,
                    //    DeliveryMethod = SmtpDeliveryMethod.Network,
                    //    UseDefaultCredentials = false,
                    //    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                    //};
                    //smtp2.Timeout = 5000;
                    //using (var message2 = new MailMessage(fromAddress, new MailAddress("v.moghaddam59@gmail.com", "CAO MSG"))
                    //{
                    //    Subject = subject,
                    //    Body = body,
                    //    IsBodyHtml = false,
                    //})
                    //{
                    //    //smtp.SendCompleted += (s, e) => {
                    //    //    smtp.Dispose();

                    //    //};
                    //    smtp2.Send(message2);
                    //}

                    /////////////////////////////////////////
                }
                catch (Exception ex)
                {

                }




            })).Start();


            return true;
        }
    }
    public class Magfa
    {
        //varesh
        //string username = "varesh_85972"; //ConfigurationManager.AppSettings["magfa_user"];/* "taban";*/ //ConfigurationManager.AppSettings["magfa_user"]; //"caspianline"; //"flypersia_48000";
        //string password = "oJTyaWoLnQycrfdX"; //ConfigurationManager.AppSettings["magfa_pass"];/*"ZIECXHgRSJT1QLMy";*/ //ConfigurationManager.AppSettings["magfa_pass"]; // "ZQMihTmdLqCbnbrW"; //"YYDWMU5BAJQQHCuG";
        // string domain = "magfa";// "tabanair"; /*"tabanair";*/
        //string senderNumber = "300085972";// ConfigurationManager.AppSettings["magfa_no"]; /*"30006327";*/ // ConfigurationManager.AppSettings["magfa_no"]; // "3000748907"; //"300048000";
        ///////////////////////////////
        //////////////////////////////////
        string username = ConfigurationManager.AppSettings["magfa_user"];/* "taban";*/ //ConfigurationManager.AppSettings["magfa_user"]; //"caspianline"; //"flypersia_48000";
        string password = ConfigurationManager.AppSettings["magfa_pass"];/*"ZIECXHgRSJT1QLMy";*/ //ConfigurationManager.AppSettings["magfa_pass"]; // "ZQMihTmdLqCbnbrW"; //"YYDWMU5BAJQQHCuG";
        string domain = "magfa"; //"varesh"; //"magfa";// "varesh";// "tabanair"; /*"tabanair";*/
        string senderNumber = ConfigurationManager.AppSettings["magfa_no"];


        string ma_senderNumber = "30004659";
        string ma_username = "h_naft";
        string ma_pass = "10002000";
        string ma_domin = "h_naft";
        string ma_path = "https://mehrafraz.com/fullrest/";





        //string username = "atlas_82173"; //ConfigurationManager.AppSettings["magfa_user"];/* "taban";*/ //ConfigurationManager.AppSettings["magfa_user"]; //"caspianline"; //"flypersia_48000";
        //string password = "Ot9V0CWKbH1HUQGK"; //ConfigurationManager.AppSettings["magfa_pass"];/*"ZIECXHgRSJT1QLMy";*/ //ConfigurationManager.AppSettings["magfa_pass"]; // "ZQMihTmdLqCbnbrW"; //"YYDWMU5BAJQQHCuG";
        //string domain = "atlasairplus.com";// "tabanair"; /*"tabanair";*/
        //string senderNumber = "300082173";// ConfigurationManager.AppSettings["magfa_no"]; /*"30006327";*/ // ConfigurationManager.AppSettings["magfa_no"]; // "3000748907"; //"300048000";



        public List<string> getStatus(List<Int64> refIds)
        {
            List<string> result = new List<string>();
            if (1 == 2)
            {
                com.magfa.sms.SoapSmsQueuableImplementationService sq = new com.magfa.sms.SoapSmsQueuableImplementationService();
                sq.Credentials = new System.Net.NetworkCredential(username, password);
                sq.PreAuthenticate = true;

                //List<string> result = new List<string>();
                //foreach (var x in refIds)
                //{
                //    var str = "Unknown";
                //    var response = sq.getMessageStatus(x);
                //    switch (response)
                //    {
                //        case 1:
                //            str = "Sending";
                //            break;
                //        case 2:
                //            str = "Delivered";
                //            break;
                //        case 3:
                //            str = "Not Delivered";
                //            break;


                //        default:
                //            break;
                //    }
                //    result.Add(str);
                //}



                var response = sq.getRealMessageStatuses(refIds.ToArray());
              
                foreach (var x in response)
                {
                    var str = "Unknown";
                    switch (x)
                    {
                        case 1:
                            str = "Delivered";
                            break;
                        case 2:
                            str = "Not Delivered To Phone";
                            break;
                        case 8:
                            str = "Delivered To ICT";
                            break;
                        case 16:
                            str = "Not Delivered To ICT";
                            break;
                        case 0:
                            str = "Sending Queue";
                            break;
                        default:
                            break;
                    }
                    result.Add(str);
                }
            }
            else if (1 == 3)
            {
                var model = new Delivery1to1Model();
                model.UserName = ma_username;
                model.Password = ma_pass;
                model.DomainName = ma_domin;
                model.Password = ma_pass;
                model.Ids = refIds.ToArray();//new long[] { 2479272853, 2360223508, 2360223510 };

                var json = JsonConvert.SerializeObject(model);
                var data = new StringContent(json, Encoding.UTF8, "application/json");


                var url = ma_path + "api/Delivery1to1";
                using (var client = new HttpClient())
                {
                    var response = client.PostAsync(url, data).Result;
                    if (response.IsSuccessStatusCode)
                    {
                        string responseContent = response.Content.ReadAsStringAsync().Result;
                        var d_result = JsonConvert.DeserializeObject<ResponseDelivery>(responseContent);
                        foreach(var x in d_result.DeliveryStatus)
                        {
                            result.Add(x.Message);
                        }
                    }

                }

            }
            else if (1 == 1)
            {
                RestClient client = new RestClient("9354957316", "Rhbsms99@");
                foreach (var _ref_id in refIds)
                {
                    var rest_result = client.GetDelivery(_ref_id).Value;
                    var str = "نامشخص";
                    switch (Convert.ToInt32( rest_result))
                    {
                        case 1:
                            str = "رسیده به گوشی";
                            break;
                        case 2:
                            str = "نرسیده به گوشی";
                            break;
                        case 3:
                            str = "خطای مخابراتی";
                            break;
                        case 5:
                            str = "خطای نامشخص";
                            break;
                        case 8:
                            str = "رسیده به مخابرات";
                            break;
                        case 16:
                            str = "نرسیده به مخابرات";
                            break;
                        case 200:
                            str = "ارسال شده";
                            break;
                        case 100:
                            str = "نامشخص";
                            break;
                        case 400:
                            str = "در لیست ارسال";
                            break;
                        default:
                            break;
                    }
                    result.Add(str);
                }
                
               
                
            }




                return result;
            
        }
        public string getStatus(Int64 refid)
        {
            if (1 == 2)
            {
                com.magfa.sms.SoapSmsQueuableImplementationService sq = new com.magfa.sms.SoapSmsQueuableImplementationService();
                sq.Credentials = new System.Net.NetworkCredential(username, password);
                sq.PreAuthenticate = true;

                var response = sq.getMessageStatus(refid);


                var str = "Unknown";
                switch (response)
                {
                    case 1:
                        str = "Delivered";
                        break;
                    case 2:
                        str = "Not Delivered To Phone";
                        break;
                    case 8:
                        str = "Delivered To ICT";
                        break;
                    case 16:
                        str = "Not Delivered To ICT";
                        break;
                    case 0:
                        str = "Sending Queue";
                        break;
                    default:
                        break;
                }




                return str;
            }
            else
            {
               var res= getStatus(new List<long> { refid });
                return res[0];
            }
            
        }


        public string test_mehr(int count, String recipientNumber, String text)
        {

            try
            {
                //magfa
                if (1 == 2)
                {
                     

                }
                //mehrafzza
                else if (1 == 1)
                {
                    ResponseCodes mehr_result = null;



                    var model = new SendModel();
                    model.UserName = ma_username;
                    model.Password = ma_pass;
                    model.DomainName = ma_domin;
                    model.Smsbody = text;
                    model.Mobiles = new string[] { recipientNumber };
                    model.SenderNumber = ma_senderNumber;
                    model.Id = new Random().Next(999999).ToString();
                    var json = JsonConvert.SerializeObject(model);
                    var data = new StringContent(json, Encoding.UTF8, "application/json");


                    var url = ma_path + "/api/Send";
                    using (var client = new HttpClient())
                    {
                        var response = client.PostAsync(url, data).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            string responseContent = response.Content.ReadAsStringAsync().Result;
                            mehr_result = JsonConvert.DeserializeObject<ResponseCodes>(responseContent);
                            var res_id = Convert.ToInt64(mehr_result.ReturnCodes.First());
                            return res_id.ToString() ;
                        }
                        else
                        {
                            return "STATUS CODE "+response.StatusCode.ToString();
                        }

                    }
                }
                
                else return "-2";

            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null)
                    msg +="   "+ ex.InnerException.Message;
                if (ex.InnerException.InnerException != null)
                    msg += "   " + ex.InnerException.InnerException;
                return msg;
            }

        }


        public long[] enqueue(int count, String recipientNumber, String text)
        {

            try
            {
                //magfa
                if (1 == 1)
                {
                    System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                    com.magfa.sms.SoapSmsQueuableImplementationService sq = new com.magfa.sms.SoapSmsQueuableImplementationService();
                    //if (useProxy)
                    //{
                    //    WebProxy proxy;
                    //    proxy = new WebProxy(proxyAddress);
                    //    proxy.Credentials = new NetworkCredential(proxyUsername, proxyPassword);
                    //    sq.Proxy = proxy;
                    //}
                    sq.Credentials = new System.Net.NetworkCredential(username, password);
                    sq.PreAuthenticate = true;
                    long[] results;

                    string[] messages;
                    string[] mobiles;
                    string[] origs;

                    int[] encodings;
                    string[] UDH;
                    int[] mclass;
                    int[] priorities;
                    long[] checkingIds;

                    messages = new string[count];
                    mobiles = new string[count];
                    origs = new string[count];

                    encodings = new int[count];
                    UDH = new string[count];
                    mclass = new int[count];
                    priorities = new int[count];
                    checkingIds = new long[count];

                    /*
                    encodings = null;
                    UDH = null;
                    mclass = null;
                    priorities = null;
                    checkingIds = null;
                    */
                    for (int i = 0; i < count; i++)
                    {
                        messages[i] = text;
                        mobiles[i] = recipientNumber;
                        origs[i] = senderNumber;

                        encodings[i] = -1;
                        UDH[i] = "";
                        mclass[i] = -1;
                        priorities[i] = -1;
                        checkingIds[i] = 200 + i;
                    }
                    var xxx = sq.Url;
                    return sq.enqueue(domain, messages, mobiles, origs, encodings, UDH, mclass, priorities, checkingIds);


                    ////////////////////////////////
                    /////kakoli
                    //// Credentials


                    //// Service (Add a Web Reference)
                    //com.magfa.sms.SoapSmsQueuableImplementationService service = new com.magfa.sms.SoapSmsQueuableImplementationService();

                    //// Basic Auth
                    //NetworkCredential netCredential = new NetworkCredential(username, password);
                    //Uri uri = new Uri(service.Url);
                    //ICredentials credentials = netCredential.GetCredential(uri, "Basic");

                    //service.Credentials = credentials;
                    //service.AllowAutoRedirect = true;

                    //// Call
                    //long[] resp = service.enqueue(domain,
                    //    new string[] { "تست ارسال پيامک. Sample Text for test.", "Hi!" },
                    //    new string[] { "09124449584", "09306678047" },
                    //    new string[] { senderNumber },
                    //    new int[] { 0 },
                    //    new string[] { "" },
                    //    new int[] { 0 },
                    //    new int[] { 0 },
                    //    new long[] { 198981, 123032 }
                    //);
                    //foreach (long r in resp)
                    //{
                    //    Console.WriteLine("send: " + r);
                    //}
                    //return resp;
                    //////////////////////////////////////////
                    ///


                }
                //mehrafzza
                else if (1 == 3)
                {
                    ResponseCodes mehr_result = null;
                    


                    var model = new SendModel();
                    model.UserName = ma_username;
                    model.Password = ma_pass;
                    model.DomainName = ma_domin;
                    model.Smsbody = text;
                    model.Mobiles = new string[] { recipientNumber };
                    model.SenderNumber = ma_senderNumber;
                    model.Id = new Random().Next(999999).ToString();
                    var json = JsonConvert.SerializeObject(model);
                    var data = new StringContent(json, Encoding.UTF8, "application/json");


                    var url = ma_path + "/api/Send";
                    using (var client = new HttpClient())
                    {
                        var response = client.PostAsync(url, data).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            string responseContent = response.Content.ReadAsStringAsync().Result;
                            mehr_result = JsonConvert.DeserializeObject<ResponseCodes>(responseContent);
                            var res_id = Convert.ToInt64(mehr_result.ReturnCodes.First());
                            return new long[] { res_id };
                        }
                        else
                        {
                            return new long[] { -1 };
                        }

                    }
                }
                //ava
                else if (1 ==2){
                    //MelliRef.SendSoapClient soapClient = new MelliRef.SendSoapClient();
                    // var _melli_res=soapClient.SendSimpleSMS2("9354957316", "Rhbsms99@", "09124449584", "90009105", "test sms", false);
                    RestClient client = new RestClient("9354957316", "Rhbsms99@");
                   var rest_result= client.Send(recipientNumber, "90009105", text, false).Value;
                    return new long[] { Convert.ToInt64(rest_result) };
                }
                else return new long[] { -2 };

            }
            catch (Exception ex)
            {
                return new long[] { -1 };
            }

        }



        public string enqueue2(int count, String recipientNumber, String text)
        {
            try
            {
                System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                com.magfa.sms.SoapSmsQueuableImplementationService sq = new com.magfa.sms.SoapSmsQueuableImplementationService();
                //if (useProxy)
                //{
                //    WebProxy proxy;
                //    proxy = new WebProxy(proxyAddress);
                //    proxy.Credentials = new NetworkCredential(proxyUsername, proxyPassword);
                //    sq.Proxy = proxy;
                //}
                sq.Credentials = new System.Net.NetworkCredential(username, password);
                sq.PreAuthenticate = true;
                long[] results;

                string[] messages;
                string[] mobiles;
                string[] origs;

                int[] encodings;
                string[] UDH;
                int[] mclass;
                int[] priorities;
                long[] checkingIds;

                messages = new string[count];
                mobiles = new string[count];
                origs = new string[count];

                encodings = new int[count];
                UDH = new string[count];
                mclass = new int[count];
                priorities = new int[count];
                checkingIds = new long[count];

                /*
                encodings = null;
                UDH = null;
                mclass = null;
                priorities = null;
                checkingIds = null;
                */
                for (int i = 0; i < count; i++)
                {
                    messages[i] = text;
                    mobiles[i] = recipientNumber;
                    origs[i] = senderNumber;

                    encodings[i] = -1;
                    UDH[i] = "";
                    mclass[i] = -1;
                    priorities[i] = -1;
                    checkingIds[i] = 200 + i;
                }
                var xxx = sq.Url;
                var _res = sq.enqueue(domain, messages, mobiles, origs, encodings, UDH, mclass, priorities, checkingIds);

                return _res[0].ToString();
                ////////////////////////////////
                /////kakoli
                //// Credentials


                //// Service (Add a Web Reference)
                //com.magfa.sms.SoapSmsQueuableImplementationService service = new com.magfa.sms.SoapSmsQueuableImplementationService();

                //// Basic Auth
                //NetworkCredential netCredential = new NetworkCredential(username, password);
                //Uri uri = new Uri(service.Url);
                //ICredentials credentials = netCredential.GetCredential(uri, "Basic");

                //service.Credentials = credentials;
                //service.AllowAutoRedirect = true;

                //// Call
                //long[] resp = service.enqueue(domain,
                //    new string[] { "تست ارسال پيامک. Sample Text for test.", "Hi!" },
                //    new string[] { "09124449584", "09306678047" },
                //    new string[] { senderNumber },
                //    new int[] { 0 },
                //    new string[] { "" },
                //    new int[] { 0 },
                //    new int[] { 0 },
                //    new long[] { 198981, 123032 }
                //);
                //foreach (long r in resp)
                //{
                //    Console.WriteLine("send: " + r);
                //}
                //return resp;
                //////////////////////////////////////////
            }
            catch (Exception ex)
            {
                // return new long[] { -1 };
                var msg = ex.Message;
                if (ex.InnerException != null)
                    msg += "   " + ex.InnerException.Message;
                return msg;
            }

        }



    }


    public class Payamak
    {
        public void send(string mobile, string text)
        {
            string[] mobiles = new string[] { mobile };
            string[] texts = new string[] { text };
            long[] rec = null;
            byte[] status = null;
            payamak.Actions p = new payamak.Actions();
            var xxx = p.SendMultipleSMS("9125591790", "@khavaN559", mobiles, "10001223136323", texts, false, "", ref rec, ref status);
            var xxx2 = p.SendMultipleSMS("9125591790", "@khavaN559", mobiles, "5000127003476", texts, false, "", ref rec, ref status);
            var xxx3 = p.SendMultipleSMS("9125591790", "@khavaN559", mobiles, "30001223136323", texts, false, "", ref rec, ref status);
            var xxx4 = p.SendMultipleSMS("9125591790", "@khavaN559", mobiles, "100070", texts, false, "", ref rec, ref status);
            //5000127003476
            //30001223136323
            //100070
        }

    }


    public class SendModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Smsbody { get; set; }
        public string[] Mobiles { get; set; }
        public string Id { get; set; }
        public string DomainName { get; set; }
        public string SenderNumber { get; set; }
    }

    public class ResponseModelBase
    {
        public ResponseModelBase()
        {
            Status = 0;
        }
        /// <summary>
        /// متن خطایی که رخ داده
        /// </summary>
        public string Messege { get; set; }
        /// <summary>
        /// کد خطا در صورتی که عدد بالای صفر باشد یعنی خطایی رخ داده
        /// </summary>
        public int Status { get; set; }
    }

    public class ResponseCodes : ResponseModelBase
    {
        public string[] ReturnCodes { get; set; }
    }
    public class ResponseDelivery : ResponseModelBase
    {
        public ResponseDelivery()
        {
            // ReceiveModel = new List<ResponseReceiveModel>();
        }


        public DeliveryStatus[] DeliveryStatus { get; set; }

    }
    public class DeliveryStatus
    {

        public DeliveryStatus()
        {

        }


        /// <summary>
        /// شناسه خطا
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// متن خطا
        /// </summary>
        public string Message { get; set; }
    }

    public class Delivery1to1Model
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string DomainName { get; set; }
        public long[] Ids { get; set; }
    }
}