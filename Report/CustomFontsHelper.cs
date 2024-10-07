using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Text;
using System.Linq;
using System.Web;

namespace Report
{
    public static class CustomFontsHelper
    {

        static PrivateFontCollection fontCollection;
        public static FontCollection FontCollection
        {
            get
            {
                if (fontCollection == null)
                {
                    fontCollection = new PrivateFontCollection();
                    //fontCollection.AddFontFile(HttpContext.Current.Server.MapPath("~/Fonts/B-NAZANIN.ttf"));
                    //fontCollection.AddFontFile(HttpContext.Current.Server.MapPath("~/Fonts/andlso.ttf"));
                    // fontCollection.AddFontFile(@"C:\Users\Vahid\source\repos\PPA\Report\fonts\andlso.ttf");
                    //fontCollection.AddFontFile("C:\\Inetpub\\vhosts\\so-shop.ir\\report.apoc.ir\\fonts\\clientsfiles\\andlso.ttf");
                   // fontCollection.AddFontFile("E:\\reportOPC\\font\\andlso.ttf");
                    //andlso
                }
                return fontCollection;
            }
        }

        public static FontFamily GetFamily(string familyName)
            
        {
            var aaa = FontCollection.Families.ToList();
            return FontCollection.Families.FirstOrDefault(ff => ff.Name == familyName);
        }
    }
}