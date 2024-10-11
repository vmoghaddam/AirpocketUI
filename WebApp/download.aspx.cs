using Ionic.Zip;
using System;
using System.IO;
using System.Web;

namespace WebApp
{
    public partial class download : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                var files = Directory.GetFiles(Server.MapPath("~/upload/clientsfiles/"));
                // Tell the browser we're sending a ZIP file!
                var downloadFileName = string.Format("YourDownload-{0}.zip", DateTime.Now.ToString("yyyy-MM-dd-HH_mm_ss"));


                // Zip the contents of the selected files
                using (var zip = new ZipFile())
                {
                    zip.AlternateEncodingUsage = ZipOption.AsNecessary;
                    // Add the password protection, if specified
                    //if (!string.IsNullOrEmpty(txtZIPPassword.Text))
                    //{
                    //    zip.Password = txtZIPPassword.Text;

                    //    // 'This encryption is weak! Please see http://cheeso.members.winisp.net/DotNetZipHelp/html/24077057-63cb-ac7e-6be5-697fe9ce37d6.htm for more details
                    //    zip.Encryption = EncryptionAlgorithm.WinZipAes128;
                    //}

                    // Construct the contents of the README.txt file that will be included in this ZIP
                    var readMeMessage = string.Format("Your ZIP file {0} contains the following files:{1}{1}", downloadFileName, Environment.NewLine);

                    // Add the checked files to the ZIP
                    //foreach (ListItem li in cblFiles.Items)
                    //    if (li.Selected)
                    //    {
                    //        // Record the file that was included in readMeMessage
                    //        readMeMessage += string.Concat("\t* ", li.Text, Environment.NewLine);

                    //        // Now add the file to the ZIP (use a value of "" as the second parameter to put the files in the "root" folder)
                    //        zip.AddFile(li.Value, "Your Files");
                    //    }
                    foreach (var f in files)
                        zip.AddFile(f, "Your Files");
                    // Add the README.txt file to the ZIP
                    //zip.AddEntry("README.txt", readMeMessage, Encoding.ASCII);


                    // Send the contents of the ZIP back to the output stream
                    Response.Clear();
                    Response.BufferOutput = false;
                    string zipName = String.Format("Zip_{0}.zip", DateTime.Now.ToString("yyyy-MMM-dd-HHmmss"));
                    Response.ContentType = "application/zip";
                    Response.AddHeader("content-disposition", "attachment; filename=" + zipName);
                    // HttpContext.Current.Response.TransmitFile(zipName);
                    HttpContext.Current.Response.Flush();


                    zip.Save(Response.OutputStream);
                    Response.End();
                }
            }
        }
    }
}