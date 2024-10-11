using ApiMSG.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Web;

namespace ApiMSG
{
    public class MailHelper
    {
        string dispatchEmail = ConfigurationManager.AppSettings["email_dispatch"];
        string dispatchTitle = ConfigurationManager.AppSettings["email_dispatch_title"];
        string dispatchEmailPassword = "=k<8Gb?6#s*5W";//ConfigurationManager.AppSettings["email_dispatch_password"];
        string dispatchEmailHost = ConfigurationManager.AppSettings["email_dispatch_host"];
        string dispatchEmailPort = ConfigurationManager.AppSettings["email_dispatch_port"];
        string caoMSGEmail = ConfigurationManager.AppSettings["email_cao_message"];
        string caoMSGEmailAlt = ConfigurationManager.AppSettings["email_cao_message_alt"];
        string caoMSGEmailAlt2 = ConfigurationManager.AppSettings["email_cao_message_alt2"];
        string caoMSGEmailAlt3 = ConfigurationManager.AppSettings["email_cao_message_alt3"];
        string IsMVTEnabled = ConfigurationManager.AppSettings["mvt_enabled"];

        public string SendTest(string body, string subject, int port, int ssl)
        {



            try
            {
                var fromAddress = new MailAddress(dispatchEmail, dispatchTitle);
                var toAddress = new MailAddress(caoMSGEmail, "CAO MSG");
                var ccAddress = new MailAddress(caoMSGEmailAlt, "CAO MSG ALT1");
                var ccAddress2 = new MailAddress(caoMSGEmailAlt2, "CAO MSG ALT2");
                var ccAddress3 = new MailAddress(caoMSGEmailAlt3, "CAO MSG ALT3");

                string fromPassword = dispatchEmailPassword;




                var smtp = new SmtpClient
                {
                    //EnableSsl=true,
                    Host = dispatchEmailHost,
                    Port = port, //Convert.ToInt32(dispatchEmailPort),
                    EnableSsl = ssl == 1,
                   // TargetName = "STARTTLS/Mail.flypersia.aero",
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword),

                };
                smtp.Timeout = 60000;

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
                    //smtp.Send(new MailMessage(fromAddress, toAddress)
                    //{
                    //    Subject = subject,
                    //    Body = body,
                    //    IsBodyHtml = false,


                    //});
                    //smtp.Send(new MailMessage(dispatchEmail, caoMSGEmailAlt) {
                    //    Subject = subject,
                    //    Body = body,
                    //    IsBodyHtml = false,
                    //});
                    return "OK";
                }


            }
            catch (Exception ex)
            {
                var _msg = ex.Message;
                if (ex.InnerException != null)
                    _msg += "   INNER:  " + ex.InnerException.Message;
                return _msg;
            }








        }


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
                    var ccAddress = new MailAddress(caoMSGEmailAlt, "CAO MSG ALT1");
                    var ccAddress2 = new MailAddress(caoMSGEmailAlt2, "CAO MSG ALT2");
                    var ccAddress3 = new MailAddress(caoMSGEmailAlt3, "CAO MSG ALT3");

                    string fromPassword = dispatchEmailPassword;




                    var smtp = new SmtpClient
                    {
                        //EnableSsl=true,
                        Host = dispatchEmailHost,
                        Port = Convert.ToInt32(dispatchEmailPort),
                        //EnableSsl = true,
                       // TargetName = "STARTTLS/Mail.flypersia.aero",
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(fromAddress.Address, fromPassword),

                    };
                    smtp.Timeout = 60000;

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
                        message.CC.Add(ccAddress);
                        message.CC.Add(ccAddress2);
                        message.CC.Add(ccAddress3);
                        smtp.Send(message);
                        //smtp.Send(new MailMessage(fromAddress, toAddress)
                        //{
                        //    Subject = subject,
                        //    Body = body,
                        //    IsBodyHtml = false,


                        //});
                        //smtp.Send(new MailMessage(dispatchEmail, caoMSGEmailAlt) {
                        //    Subject = subject,
                        //    Body = body,
                        //    IsBodyHtml = false,
                        //});

                    }


                }
                catch (Exception ex)
                {
                    var _msg = ex.Message;
                    if (ex.InnerException != null)
                        _msg += "   INNER:  " + ex.InnerException.Message;
                    using (var _context = new ApiMSG.Models.ppa_vareshEntities())
                    {
                        var msgAD = new MVTAPI()
                        {
                            Bag = "",
                            DateCreate = DateTime.Now,


                            FlightId = 21974,

                            Message = _msg,


                            Type = "ERR",





                        };
                        _context.MVTAPIs.Add(msgAD);
                        _context.SaveChanges();
                    }
                }




            })).Start();


            return true;
        }


        public bool SendEmailMVTAPT(string apt, string body, string subject)
        {
            if (IsMVTEnabled == "0")
                return true;
            string _toAdd = dispatchEmailHost + "   " + dispatchEmailPort + " " + dispatchEmail + "   " + dispatchEmailPassword;
            (new Thread(() =>
            {
                try
                {
                    var fromAddress = new MailAddress(dispatchEmail, dispatchTitle);
                    // var toAddress = new MailAddress(caoMSGEmail, "CAO MSG");
                    var ccAddress = new MailAddress(caoMSGEmailAlt, "CAO MSG ALT1");
                    var ccAddress2 = new MailAddress(caoMSGEmailAlt2, "CAO MSG ALT2");
                    var ccAddress3 = new MailAddress(caoMSGEmailAlt3, "CAO MSG ALT3");
                    var toAddress = new MailAddress(ConfigurationManager.AppSettings["email_" + apt.ToLower() + "_message"], apt + " MSG");
                    var ccAptAddress = new MailAddress(ConfigurationManager.AppSettings["email_" + apt.ToLower() + "_message_alt"], apt + " MSG");
                    string fromPassword = dispatchEmailPassword;




                    var smtp = new SmtpClient
                    {
                        //EnableSsl=true,
                        Host = dispatchEmailHost,
                        Port = Convert.ToInt32(dispatchEmailPort),
                        //EnableSsl = true,
                        // TargetName = "STARTTLS/Mail.flypersia.aero",
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(fromAddress.Address, fromPassword),

                    };
                    smtp.Timeout = 60000;

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
                        message.CC.Add(ccAptAddress);
                        // message.CC.Add(ccAddress2);
                        message.CC.Add(ccAddress3);
                        smtp.Send(message);
                        //smtp.Send(new MailMessage(fromAddress, toAddress)
                        //{
                        //    Subject = subject,
                        //    Body = body,
                        //    IsBodyHtml = false,


                        //});
                        //smtp.Send(new MailMessage(dispatchEmail, caoMSGEmailAlt) {
                        //    Subject = subject,
                        //    Body = body,
                        //    IsBodyHtml = false,
                        //});

                    }


                }
                catch (Exception ex)
                {
                    var _msg = ex.Message;
                    if (ex.InnerException != null)
                        _msg += "   INNER:  " + ex.InnerException.Message + "  " + _toAdd;
                    using (var _context = new ppa_vareshEntities())
                    {
                        var msgAD = new MVTAPI()
                        {
                            Bag = "",
                            DateCreate = DateTime.Now,


                            FlightId = 21974,

                            Message = _msg,


                            Type = "ERR",





                        };
                        _context.MVTAPIs.Add(msgAD);
                        _context.SaveChanges();
                    }
                }




            })).Start();


            return true;
        }


        public /*async Task<object>*/object CreateLDMMessage(int flightId, string userName, bool force = false)
        {
            new Thread(async () =>
            {
                using (var _context = new ppa_vareshEntities())
                {
                    var flight = _context.ViewLegTimes.FirstOrDefault(f => f.ID == flightId);
                    string caoMSGEmail = ConfigurationManager.AppSettings["email_cao_message"];
                    string fnPrefix = ConfigurationManager.AppSettings["flightno"];
                    if (flight != null) {
                        var msgAD = _context.MVTAPIs.OrderByDescending(q => q.Id).FirstOrDefault(q => q.FlightId == flightId && (q.Type == "LDM"  ));
                        if (msgAD == null)
                        {
                            msgAD = new MVTAPI()
                            {
                                Bag = "T" + (flight.BaggageWeight  +flight.CargoWeight) ,
                                DateCreate = DateTime.Now,
                                DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day,
                                //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                ETA = flight.Landing,
                                FlightId = flight.ID,
                                FlightNo = fnPrefix + flight.FlightNumber,
                                FromIATA = flight.FromAirportIATA,
                                OffBlock = flight.ChocksOut,
                                OnBlock = flight.ChocksIn,
                                //Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0'),
                                Pax =  (flight.PaxAdult ?? 0) + "/" + (flight.PaxChild ?? 0)  + "/" + (flight.PaxInfant ?? 0),
                               
                                Register = "EP-" + flight.Register,
                                TakeOff = flight.Takeoff,
                                ToIATA = flight.ToAirportIATA,
                                Type = "LDM",
                                UserName = userName,
                                SendTo = caoMSGEmail,




                            };


                            var msg = new List<string>();
                            msg.Add("LDM");
                            msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register  );

                            msg.Add("-" + msgAD.FromIATA + "." + msgAD.Pax + "." + msgAD.Bag + "/.PAX/" + ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0) + (flight.PaxInfant ?? 0)));
                            msg.Add("SI");
                            msg.Add(msgAD.FromIATA + " " + flight.AircraftType);
                             
                            msgAD.Message = string.Join("\r\n", msg);

                            _context.MVTAPIs.Add(msgAD);
                            _context.SaveChanges();


                            this.SendEmailMVT(msgAD.Message, "LDM " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));



                        }
                    }
                }
            }).Start();
            return true;
        }

        public /*async Task<object>*/object CreateMVTMessage(int flightId, string userName, bool force = false)
        {
            new Thread(async () =>
            {
                using (var _context = new ppa_vareshEntities())
                {
                    var flight = _context.ViewLegTimes.FirstOrDefault(f => f.ID == flightId);
                    string caoMSGEmail = ConfigurationManager.AppSettings["email_cao_message"];
                    string fnPrefix = ConfigurationManager.AppSettings["flightno"];
                    //new Thread(async () =>
                    //new Thread( () =>
                    //{

                    if (flight != null && (flight.FlightStatusID == 2 || flight.FlightStatusID == 3 || flight.FlightStatusID == 15))
                    {
                        if (flight.FlightStatusID == 2)
                        {
                            var msgAD = _context.MVTAPIs.OrderByDescending(q => q.Id).FirstOrDefault(q => q.FlightId == flightId && (q.Type == "AD" || q.Type == "AD COR"));
                            var delays = _context.ViewFlightDelayCodes.Where(q => q.FlightId == flightId).OrderBy(q => q.Code).Select(q => new { q.Code, q.HH, q.MM }).ToList();
                            string dl = "";
                            if (delays.Count > 0)
                            {
                                var dlcode = new List<string>();
                                var dlvalue = new List<string>();
                                foreach (var x in delays)
                                {
                                    dlcode.Add(x.Code);
                                    dlvalue.Add((x.HH ?? 0).ToString().PadLeft(2, '0') + (x.MM ?? 0).ToString().PadLeft(2, '0'));
                                }
                                dl = "DL" + string.Join("/", dlcode) + "/" + string.Join("/", dlvalue);

                            }
                            if (msgAD == null)
                            {
                                #region AD New
                                msgAD = new MVTAPI()
                                {
                                    Bag = "BAG"+(flight.BaggageCount ?? 0)+"PCS/" + flight.BaggageWeight.ToString() + "KG",
                                    DateCreate = DateTime.Now,
                                    DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day,
                                    //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                    ETA = flight.Landing,
                                    FlightId = flight.ID,
                                    FlightNo = fnPrefix + flight.FlightNumber,
                                    FromIATA = flight.FromAirportIATA,
                                    OffBlock = flight.ChocksOut,
                                    OnBlock = flight.ChocksIn,
                                    //Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0'),
                                    Pax= ((flight.PaxAdult ?? 0)+"/"+ (flight.PaxChild ?? 0))+"/"+ (flight.PaxInfant ?? 0),
                                    Register ="EP-"+flight.Register,
                                    TakeOff = flight.Takeoff,
                                    ToIATA = flight.ToAirportIATA,
                                    Type = "AD",
                                    UserName = userName,
                                    SendTo = caoMSGEmail,




                                };
                                //if (!string.IsNullOrEmpty(dl))
                                {
                                    msgAD.DL = dl;
                                }
                                var msg = new List<string>();
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.FromIATA);
                                msg.Add("AD" + ((DateTime)msgAD.OffBlock).ToString("HHmm") + "/" + ((DateTime)msgAD.TakeOff).ToString("HHmm")
                                    + ".EA" + ((DateTime)msgAD.ETA).ToString("HHmm") +"."+ msgAD.ToIATA);
                                if (!string.IsNullOrEmpty(msgAD.DL))
                                {
                                    msg.Add(msgAD.DL);
                                }
                                msg.Add("PAX" + msgAD.Pax);
                                msg.Add(msgAD.Bag);
                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVT(msgAD.Message, "MVT AD " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                            else
                            if (msgAD != null && (msgAD.OffBlock != flight.ChocksOut || msgAD.TakeOff != flight.Takeoff || msgAD.ETA != flight.Landing || msgAD.DL != dl))
                            {
                                //revision
                                #region AD Cor

                                msgAD.Bag = "BAG " + flight.BaggageWeight.ToString() + "KG";
                                msgAD.DateCreate = DateTime.Now;
                                msgAD.DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day;
                                //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                msgAD.ETA = flight.Landing;
                                msgAD.FlightId = flight.ID;
                                msgAD.FlightNo = fnPrefix + flight.FlightNumber;
                                msgAD.FromIATA = flight.FromAirportIATA;
                                msgAD.OffBlock = flight.ChocksOut;
                                msgAD.OnBlock = flight.ChocksIn;
                                msgAD.Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0');
                                msgAD.Register = flight.Register;
                                msgAD.TakeOff = flight.Takeoff;
                                msgAD.ToIATA = flight.ToAirportIATA;
                                msgAD.Type = "AD COR";
                                msgAD.UserName = userName;
                                msgAD.SendTo = caoMSGEmail;





                                //if (!string.IsNullOrEmpty(dl))
                                {
                                    msgAD.DL = dl;
                                }
                                var msg = new List<string>();
                                msg.Add("COR");
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.FromIATA);
                                msg.Add("AD" + ((DateTime)msgAD.OffBlock).ToString("HHmm") + "/" + ((DateTime)msgAD.TakeOff).ToString("HHmm")
                                    + " EA " + ((DateTime)msgAD.ETA).ToString("HHmm") + msgAD.ToIATA);
                                if (!string.IsNullOrEmpty(msgAD.DL))
                                {
                                    msg.Add(msgAD.DL);
                                }
                                msg.Add("PAX" + msgAD.Pax);
                                msg.Add(msgAD.Bag);
                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                // this.SendEmailMVT(msgAD.Message, "MVT AD COR " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                        }


                        if (flight.FlightStatusID == 3 || flight.FlightStatusID == 15)
                        {
                            var msgAD = _context.MVTAPIs.OrderByDescending(q => q.Id).FirstOrDefault(q => q.FlightId == flightId && (q.Type == "AA" || q.Type == "AA COR"));

                            if (msgAD == null)
                            {
                                #region AA New
                                msgAD = new MVTAPI()
                                {
                                    Bag = "BAG" + (flight.BaggageCount ?? 0) + "PCS/" + flight.BaggageWeight.ToString() + "KG",
                                    DateCreate = DateTime.Now,
                                    DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day,
                                    //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                    ETA = flight.Landing,
                                    FlightId = flight.ID,
                                    FlightNo = fnPrefix + flight.FlightNumber,
                                    FromIATA = flight.FromAirportIATA,
                                    OffBlock = flight.ChocksOut,
                                    OnBlock = flight.ChocksIn,
                                    // Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0'),
                                    Pax = ((flight.PaxAdult ?? 0) + "/" + (flight.PaxChild ?? 0)) + "/" + (flight.PaxInfant ?? 0),
                                    Register = "EP-"+flight.Register,
                                    TakeOff = flight.Takeoff,
                                    ToIATA = flight.ToAirportIATA,
                                    Type = "AA",
                                    UserName = userName,
                                    SendTo = caoMSGEmail,




                                };

                                var msg = new List<string>();
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.ToIATA);
                                msg.Add("AA" + ((DateTime)msgAD.ETA).ToString("HHmm") + "/" + ((DateTime)msgAD.OnBlock).ToString("HHmm"));
                                msg.Add("SI NIL");

                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVT(msgAD.Message, "MVT AA " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                            else
                            if (msgAD != null && (msgAD.OnBlock != flight.ChocksIn || msgAD.ETA != flight.Landing))
                            {
                                //revision
                                #region AD Cor

                                msgAD.Bag = "BAG " + flight.BaggageWeight.ToString() + "KG";
                                msgAD.DateCreate = DateTime.Now;
                                msgAD.DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day;
                                //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                msgAD.ETA = flight.Landing;
                                msgAD.FlightId = flight.ID;
                                msgAD.FlightNo = fnPrefix + flight.FlightNumber;
                                msgAD.FromIATA = flight.FromAirportIATA;
                                msgAD.OffBlock = flight.ChocksOut;
                                msgAD.Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0');
                                msgAD.Register = flight.Register;
                                msgAD.TakeOff = flight.Takeoff;
                                msgAD.ToIATA = flight.ToAirportIATA;
                                msgAD.Type = "AA COR";
                                msgAD.UserName = userName;
                                msgAD.SendTo = caoMSGEmail;
                                msgAD.OnBlock = flight.ChocksIn;






                                var msg = new List<string>();
                                msg.Add("COR");
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.ToIATA);
                                msg.Add("AA" + ((DateTime)msgAD.ETA).ToString("HHmm") + "/" + ((DateTime)msgAD.OnBlock).ToString("HHmm"));
                                msg.Add("SI NIL");

                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                //this.SendEmailMVT(msgAD.Message, "MVT AA COR " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                        }
                    }
                    //}).Start();

                }
            }).Start();
            return true;
        }


        public /*async Task<object>*/object CreateMVTMessageAPT(string apt, int flightId, string userName, bool force = false)
        {
            new Thread(async () =>
            {
                using (var _context = new ppa_vareshEntities())
                {
                    var flight = _context.ViewLegTimes.FirstOrDefault(f => f.ID == flightId);

                    string caoMSGEmail = ConfigurationManager.AppSettings["email_" + apt + "_message"];
                    string fnPrefix = ConfigurationManager.AppSettings["flightno"];
                    //new Thread(async () =>
                    //new Thread( () =>
                    //{

                    if (flight != null && (flight.FlightStatusID == 2 || flight.FlightStatusID == 3 || flight.FlightStatusID == 15) && (flight.FromAirportIATA == apt || flight.ToAirportIATA == apt))
                    {
                        if (flight.FlightStatusID == 2)
                        {
                            var msgAD = _context.MVTAPIs.OrderByDescending(q => q.Id).FirstOrDefault(q => q.FlightId == flightId && (q.Type == "AD" || q.Type == "AD COR"));
                            var delays = _context.ViewFlightDelayCodes.Where(q => q.FlightId == flightId).OrderBy(q => q.Code).Select(q => new { q.Code, q.HH, q.MM }).ToList();
                            string dl = "";
                            if (delays.Count > 0)
                            {
                                var dlcode = new List<string>();
                                var dlvalue = new List<string>();
                                foreach (var x in delays)
                                {
                                    dlcode.Add(x.Code);
                                    dlvalue.Add((x.HH ?? 0).ToString().PadLeft(2, '0') + (x.MM ?? 0).ToString().PadLeft(2, '0'));
                                }
                                dl = "DL" + string.Join("/", dlcode) + "/" + string.Join("/", dlvalue);

                            }
                            if (msgAD == null)
                            {
                                #region AD New
                                msgAD = new MVTAPI()
                                {
                                    Bag = "BAG " + flight.BaggageWeight.ToString() + "KG",
                                    DateCreate = DateTime.Now,
                                    DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day,
                                    //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                    ETA = flight.Landing,
                                    FlightId = flight.ID,
                                    FlightNo = fnPrefix + flight.FlightNumber,
                                    FromIATA = flight.FromAirportIATA,
                                    OffBlock = flight.ChocksOut,
                                    OnBlock = flight.ChocksIn,
                                    Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0'),
                                    Register = flight.Register,
                                    TakeOff = flight.Takeoff,
                                    ToIATA = flight.ToAirportIATA,
                                    Type = "AD",
                                    UserName = userName,
                                    SendTo = caoMSGEmail,




                                };
                                //if (!string.IsNullOrEmpty(dl))
                                {
                                    msgAD.DL = dl;
                                }
                                var msg = new List<string>();
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.FromIATA);
                                msg.Add("AD" + ((DateTime)msgAD.OffBlock).ToString("HHmm") + "/" + ((DateTime)msgAD.TakeOff).ToString("HHmm")
                                    + " EA " + ((DateTime)msgAD.ETA).ToString("HHmm") + msgAD.ToIATA);
                                if (!string.IsNullOrEmpty(msgAD.DL))
                                {
                                    msg.Add(msgAD.DL);
                                }
                                msg.Add("PX" + msgAD.Pax);
                                msg.Add(msgAD.Bag);
                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVTAPT(apt, msgAD.Message, "MVT AD " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                            else
                            if (msgAD != null && (msgAD.OffBlock != flight.ChocksOut || msgAD.TakeOff != flight.Takeoff || msgAD.ETA != flight.Landing || msgAD.DL != dl))
                            {
                                //revision
                                #region AD Cor

                                msgAD.Bag = "BAG " + flight.BaggageWeight.ToString() + "KG";
                                msgAD.DateCreate = DateTime.Now;
                                msgAD.DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day;
                                //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                msgAD.ETA = flight.Landing;
                                msgAD.FlightId = flight.ID;
                                msgAD.FlightNo = fnPrefix + flight.FlightNumber;
                                msgAD.FromIATA = flight.FromAirportIATA;
                                msgAD.OffBlock = flight.ChocksOut;
                                msgAD.OnBlock = flight.ChocksIn;
                                msgAD.Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0');
                                msgAD.Register = flight.Register;
                                msgAD.TakeOff = flight.Takeoff;
                                msgAD.ToIATA = flight.ToAirportIATA;
                                msgAD.Type = "AD COR";
                                msgAD.UserName = userName;
                                msgAD.SendTo = caoMSGEmail;





                                //if (!string.IsNullOrEmpty(dl))
                                {
                                    msgAD.DL = dl;
                                }
                                var msg = new List<string>();
                                msg.Add("COR");
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.FromIATA);
                                msg.Add("AD" + ((DateTime)msgAD.OffBlock).ToString("HHmm") + "/" + ((DateTime)msgAD.TakeOff).ToString("HHmm")
                                    + " EA " + ((DateTime)msgAD.ETA).ToString("HHmm") + msgAD.ToIATA);
                                if (!string.IsNullOrEmpty(msgAD.DL))
                                {
                                    msg.Add(msgAD.DL);
                                }
                                msg.Add("PX" + msgAD.Pax);
                                msg.Add(msgAD.Bag);
                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVTAPT(apt, msgAD.Message, "MVT AD COR " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                        }


                        if (flight.FlightStatusID == 3 || flight.FlightStatusID == 15)
                        {
                            var msgAD = _context.MVTAPIs.OrderByDescending(q => q.Id).FirstOrDefault(q => q.FlightId == flightId && (q.Type == "AA" || q.Type == "AA COR"));

                            if (msgAD == null)
                            {
                                #region AA New
                                msgAD = new MVTAPI()
                                {
                                    Bag = "BAG " + flight.BaggageWeight.ToString() + "KG",
                                    DateCreate = DateTime.Now,
                                    DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day,
                                    //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                    ETA = flight.Landing,
                                    FlightId = flight.ID,
                                    FlightNo = fnPrefix + flight.FlightNumber,
                                    FromIATA = flight.FromAirportIATA,
                                    OffBlock = flight.ChocksOut,
                                    OnBlock = flight.ChocksIn,
                                    Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0'),
                                    Register = flight.Register,
                                    TakeOff = flight.Takeoff,
                                    ToIATA = flight.ToAirportIATA,
                                    Type = "AA",
                                    UserName = userName,
                                    SendTo = caoMSGEmail,




                                };

                                var msg = new List<string>();
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.ToIATA);
                                msg.Add("AA" + ((DateTime)msgAD.ETA).ToString("HHmm") + "/" + ((DateTime)msgAD.OnBlock).ToString("HHmm"));
                                msg.Add("SI NIL");

                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVTAPT(apt, msgAD.Message, "MVT AA " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                            else
                            if (msgAD != null && (msgAD.OnBlock != flight.ChocksIn || msgAD.ETA != flight.Landing))
                            {
                                //revision
                                #region AD Cor

                                msgAD.Bag = "BAG " + flight.BaggageWeight.ToString() + "KG";
                                msgAD.DateCreate = DateTime.Now;
                                msgAD.DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day;
                                //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                msgAD.ETA = flight.Landing;
                                msgAD.FlightId = flight.ID;
                                msgAD.FlightNo = fnPrefix + flight.FlightNumber;
                                msgAD.FromIATA = flight.FromAirportIATA;
                                msgAD.OffBlock = flight.ChocksOut;
                                msgAD.Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0');
                                msgAD.Register = flight.Register;
                                msgAD.TakeOff = flight.Takeoff;
                                msgAD.ToIATA = flight.ToAirportIATA;
                                msgAD.Type = "AA COR";
                                msgAD.UserName = userName;
                                msgAD.SendTo = caoMSGEmail;
                                msgAD.OnBlock = flight.ChocksIn;






                                var msg = new List<string>();
                                msg.Add("COR");
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.ToIATA);
                                msg.Add("AA" + ((DateTime)msgAD.ETA).ToString("HHmm") + "/" + ((DateTime)msgAD.OnBlock).ToString("HHmm"));
                                msg.Add("SI NIL");

                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVTAPT(apt, msgAD.Message, "MVT AA COR " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                        }
                    }
                    //}).Start();

                }
            }).Start();
            return true;
        }





        public /*async Task<object>*/object CreateMVTMessageByFlightNo(string day, string fn, int force = 0)
        {
            new Thread(async () =>
            {
                var userName = "AIRPOCKET";
                var dtprts = day.Split('-');
                var dt = (new DateTime(Convert.ToInt32(dtprts[0]), Convert.ToInt32(dtprts[1]), Convert.ToInt32(dtprts[2]))).Date;
                using (var _context = new ppa_vareshEntities())
                {
                    var flight = _context.ViewLegTimes.FirstOrDefault(f => f.STDDay == dt && f.FlightNumber == fn);
                    if (flight == null)
                        return;
                    var flightId = flight.ID;
                    string caoMSGEmail = ConfigurationManager.AppSettings["email_cao_message"];
                    string fnPrefix = ConfigurationManager.AppSettings["flightno"];
                    //new Thread(async () =>
                    //new Thread( () =>
                    //{

                    if (flight != null && (flight.FlightStatusID == 2 || flight.FlightStatusID == 3 || flight.FlightStatusID == 15))
                    {
                        if (flight.FlightStatusID == 2)
                        {
                            var msgAD = _context.MVTAPIs.OrderByDescending(q => q.Id).FirstOrDefault(q => q.FlightId == flightId && (q.Type == "AD" || q.Type == "AD COR"));
                            if (force == 1)
                                msgAD = null;
                            var delays = _context.ViewFlightDelayCodes.Where(q => q.FlightId == flightId).OrderBy(q => q.Code).Select(q => new { q.Code, q.HH, q.MM }).ToList();
                            string dl = "";
                            if (delays.Count > 0)
                            {
                                var dlcode = new List<string>();
                                var dlvalue = new List<string>();
                                foreach (var x in delays)
                                {
                                    dlcode.Add(x.Code);
                                    dlvalue.Add((x.HH ?? 0).ToString().PadLeft(2, '0') + (x.MM ?? 0).ToString().PadLeft(2, '0'));
                                }
                                dl = "DL" + string.Join("/", dlcode) + "/" + string.Join("/", dlvalue);

                            }
                            if (msgAD == null)
                            {
                                #region AD New
                                msgAD = new MVTAPI()
                                {
                                    Bag = "BAG " + flight.BaggageWeight.ToString() + "KG",
                                    DateCreate = DateTime.Now,
                                    DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day,
                                    //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                    ETA = flight.Landing,
                                    FlightId = flight.ID,
                                    FlightNo = fnPrefix + flight.FlightNumber,
                                    FromIATA = flight.FromAirportIATA,
                                    OffBlock = flight.ChocksOut,
                                    OnBlock = flight.ChocksIn,
                                    Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0'),
                                    Register = flight.Register,
                                    TakeOff = flight.Takeoff,
                                    ToIATA = flight.ToAirportIATA,
                                    Type = "AD",
                                    UserName = userName,
                                    SendTo = caoMSGEmail,




                                };
                                //if (!string.IsNullOrEmpty(dl))
                                {
                                    msgAD.DL = dl;
                                }
                                var msg = new List<string>();
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.FromIATA);
                                msg.Add("AD" + ((DateTime)msgAD.OffBlock).ToString("HHmm") + "/" + ((DateTime)msgAD.TakeOff).ToString("HHmm")
                                    + " EA " + ((DateTime)msgAD.ETA).ToString("HHmm") + msgAD.ToIATA);
                                if (!string.IsNullOrEmpty(msgAD.DL))
                                {
                                    msg.Add(msgAD.DL);
                                }
                                msg.Add("PX" + msgAD.Pax);
                                msg.Add(msgAD.Bag);
                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVT(msgAD.Message, "MVT AD " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                            else
                            if (msgAD != null && (msgAD.OffBlock != flight.ChocksOut || msgAD.TakeOff != flight.Takeoff || msgAD.ETA != flight.Landing || msgAD.DL != dl))
                            {
                                //revision
                                #region AD Cor

                                msgAD.Bag = "BAG " + flight.BaggageWeight.ToString() + "KG";
                                msgAD.DateCreate = DateTime.Now;
                                msgAD.DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day;
                                //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                msgAD.ETA = flight.Landing;
                                msgAD.FlightId = flight.ID;
                                msgAD.FlightNo = fnPrefix + flight.FlightNumber;
                                msgAD.FromIATA = flight.FromAirportIATA;
                                msgAD.OffBlock = flight.ChocksOut;
                                msgAD.OnBlock = flight.ChocksIn;
                                msgAD.Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0');
                                msgAD.Register = flight.Register;
                                msgAD.TakeOff = flight.Takeoff;
                                msgAD.ToIATA = flight.ToAirportIATA;
                                msgAD.Type = "AD COR";
                                msgAD.UserName = userName;
                                msgAD.SendTo = caoMSGEmail;





                                //if (!string.IsNullOrEmpty(dl))
                                {
                                    msgAD.DL = dl;
                                }
                                var msg = new List<string>();
                                msg.Add("COR");
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.FromIATA);
                                msg.Add("AD" + ((DateTime)msgAD.OffBlock).ToString("HHmm") + "/" + ((DateTime)msgAD.TakeOff).ToString("HHmm")
                                    + " EA " + ((DateTime)msgAD.ETA).ToString("HHmm") + msgAD.ToIATA);
                                if (!string.IsNullOrEmpty(msgAD.DL))
                                {
                                    msg.Add(msgAD.DL);
                                }
                                msg.Add("PX" + msgAD.Pax);
                                msg.Add(msgAD.Bag);
                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                // this.SendEmailMVT(msgAD.Message, "MVT AD COR " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                        }


                        if (flight.FlightStatusID == 3 || flight.FlightStatusID == 15)
                        {
                            var msgAD = _context.MVTAPIs.OrderByDescending(q => q.Id).FirstOrDefault(q => q.FlightId == flightId && (q.Type == "AA" || q.Type == "AA COR"));
                            if (force == 1)
                                msgAD = null;
                            if (msgAD == null)
                            {
                                #region AA New
                                msgAD = new MVTAPI()
                                {
                                    Bag = "BAG " + flight.BaggageWeight.ToString() + "KG",
                                    DateCreate = DateTime.Now,
                                    DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day,
                                    //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                    ETA = flight.Landing,
                                    FlightId = flight.ID,
                                    FlightNo = fnPrefix + flight.FlightNumber,
                                    FromIATA = flight.FromAirportIATA,
                                    OffBlock = flight.ChocksOut,
                                    OnBlock = flight.ChocksIn,
                                    Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0'),
                                    Register = flight.Register,
                                    TakeOff = flight.Takeoff,
                                    ToIATA = flight.ToAirportIATA,
                                    Type = "AA",
                                    UserName = userName,
                                    SendTo = caoMSGEmail,




                                };

                                var msg = new List<string>();
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.ToIATA);
                                msg.Add("AA" + ((DateTime)msgAD.ETA).ToString("HHmm") + "/" + ((DateTime)msgAD.OnBlock).ToString("HHmm"));
                                msg.Add("SI NIL");

                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                this.SendEmailMVT(msgAD.Message, "MVT AA " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                            else
                        if (msgAD != null && (msgAD.OnBlock != flight.ChocksIn || msgAD.ETA != flight.Landing))
                            {
                                //revision
                                #region AD Cor

                                msgAD.Bag = "BAG " + flight.BaggageWeight.ToString() + "KG";
                                msgAD.DateCreate = DateTime.Now;
                                msgAD.DayOfMonth = flight.Takeoff == null ? ((DateTime)flight.STD).Day : ((DateTime)flight.Takeoff).Day;
                                //ETA = ((DateTime)flight.Landing).ToString("HHmm"),
                                msgAD.ETA = flight.Landing;
                                msgAD.FlightId = flight.ID;
                                msgAD.FlightNo = fnPrefix + flight.FlightNumber;
                                msgAD.FromIATA = flight.FromAirportIATA;
                                msgAD.OffBlock = flight.ChocksOut;
                                msgAD.Pax = ((flight.PaxAdult ?? 0) + (flight.PaxChild ?? 0)).ToString().PadLeft(3, '0') + "+" + (flight.PaxInfant ?? 0).ToString().PadLeft(2, '0');
                                msgAD.Register = flight.Register;
                                msgAD.TakeOff = flight.Takeoff;
                                msgAD.ToIATA = flight.ToAirportIATA;
                                msgAD.Type = "AA COR";
                                msgAD.UserName = userName;
                                msgAD.SendTo = caoMSGEmail;
                                msgAD.OnBlock = flight.ChocksIn;






                                var msg = new List<string>();
                                msg.Add("COR");
                                msg.Add("MVT");
                                msg.Add(msgAD.FlightNo + "/" + msgAD.DayOfMonth.ToString().PadLeft(2, '0') + "." + msgAD.Register + "." + msgAD.ToIATA);
                                msg.Add("AA" + ((DateTime)msgAD.ETA).ToString("HHmm") + "/" + ((DateTime)msgAD.OnBlock).ToString("HHmm"));
                                msg.Add("SI NIL");

                                msgAD.Message = string.Join("\r\n", msg);

                                _context.MVTAPIs.Add(msgAD);
                                _context.SaveChanges();


                                //this.SendEmailMVT(msgAD.Message, "MVT AA COR " + fnPrefix + " " + flight.FlightNumber + " ON " + ((DateTime)flight.Takeoff).ToString("dd MMM yyyy"));
                                #endregion
                            }
                        }
                    }
                    //}).Start();

                }
            }).Start();
            return true;
        }



    }
}