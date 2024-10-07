using DevExpress.Utils.Serializing;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace Report
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
           // PrintingSystemXmlSerializer.UnregisterConverter(typeof(Font));
          //  PrintingSystemXmlSerializer.RegisterConverter(new CustomFontConverter());
            DevExpress.XtraReports.Web.ASPxWebDocumentViewer.StaticInitialize();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}