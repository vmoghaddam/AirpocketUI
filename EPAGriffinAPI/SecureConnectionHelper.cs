using System;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace EPAGriffinAPI
{


    public static class SecureConnectionHelper
    {
        public static string GetDecryptedConnectionString()
        {
            string encrypted = ConfigurationManager.AppSettings["core_v1_payload"];
            string key = "jsadfi734JHHhkjb869234hjskdjf@87*734@#%";

            if (string.IsNullOrEmpty(encrypted) || string.IsNullOrEmpty(key))
                throw new Exception("Missing encrypted string or key.");

            var allBytes = Convert.FromBase64String(encrypted);
            var iv = allBytes.Take(16).ToArray();
            var cipherText = allBytes.Skip(16).ToArray();

            using (var aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key.PadRight(32).Substring(0, 32));
                aes.IV = iv;
                using (var decryptor = aes.CreateDecryptor())
                {
                    var decrypted = decryptor.TransformFinalBlock(cipherText, 0, cipherText.Length);
                    return Encoding.UTF8.GetString(decrypted);
                }
            }
        }
    }

}