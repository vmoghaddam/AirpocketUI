using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using DevExpress.Utils.Serializing;

namespace Report
{
    public class CustomFontConverter : PrintingSystemXmlSerializer.FontConverter
    {
        protected override object CreateObject(string[] values)
        {
            Font font = base.CreateObject(values) as Font;
            if (values.Length > 0)
            {
                FontFamily fontFamily = CustomFontsHelper.GetFamily(values[0]);
                if (fontFamily != null)
                    return new Font(fontFamily, font.Size, font.Style, font.Unit, font.GdiCharSet, font.GdiVerticalFont);
            }
            return font;
        }
    }
}