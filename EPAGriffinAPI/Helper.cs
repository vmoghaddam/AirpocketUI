using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Web;

namespace EPAGriffinAPI
{
    public class Helper
    {
        //public static T DeepClone<T>(T obj)
        //{
        //    using (var ms = new MemoryStream())
        //    {
        //        var formatter = new BinaryFormatter();
        //        formatter.Serialize(ms, obj);
        //        ms.Position = 0;

        //        return (T)formatter.Deserialize(ms);
        //    }
        //}
        public static T DeepClone<T>(T source)
        {
            var serialized = JsonConvert.SerializeObject(source);
            return JsonConvert.DeserializeObject<T>(serialized);
        }
        public static string GetHash(string input)
        {
            HashAlgorithm hashAlgorithm = new SHA256CryptoServiceProvider();

            byte[] byteValue = System.Text.Encoding.UTF8.GetBytes(input);

            byte[] byteHash = hashAlgorithm.ComputeHash(byteValue);

            return Convert.ToBase64String(byteHash);
        }

        public static DateTime BuildDateTimeFromYAFormat(string dateString)
        {
            Regex r = new Regex(@"^\d{4}\d{2}\d{2}T\d{2}\d{2}\d{2}Z$");
            if (!r.IsMatch(dateString))
            {
                throw new FormatException(
                    string.Format("{0} is not the correct format. Should be yyyyMMddThhmmssZ", dateString));
            }

            DateTime dt = DateTime.ParseExact(dateString, "yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal);

            return dt;
        }
        public static DateTime BuildDateTimeFromYAFormatUTC(string dateString)
        {
            Regex r = new Regex(@"^\d{4}\d{2}\d{2}T\d{2}\d{2}\d{2}Z$");
            if (!r.IsMatch(dateString))
            {
                throw new FormatException(
                    string.Format("{0} is not the correct format. Should be yyyyMMddThhmmssZ", dateString));
            }

            DateTime dt = DateTime.ParseExact(dateString, "yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);
             

            return dt;
        }

        public static int GetTimeOffset(DateTime dt)
        {

            try
            {
                return Convert.ToInt32(Math.Round( TimeZoneInfo.Local.GetUtcOffset(dt).TotalMinutes));
            }
            catch(Exception ex)
            {
                return 210;
            }
           
            //return 210;
            //if (dt >= new DateTime(2019, 1, 1) && dt < new DateTime(2019, 3, 22))
            //    return 210;
            //else if (dt >= new DateTime(2019, 3, 22) && dt < new DateTime(2019, 9, 22))
            //    return 270;
            //else if (dt >= new DateTime(2019, 9, 22) && dt < new DateTime(2020, 1, 1))
            //    return 210;


            //else if (dt >= new DateTime(2020, 1, 1) && dt < new DateTime(2020, 3, 21))
            //    return 210;
            //else if (dt >= new DateTime(2020, 3, 21) && dt < new DateTime(2020, 9, 21))
            //    return 270;
            //else if (dt >= new DateTime(2020, 9, 21) && dt < new DateTime(2021, 1, 1))
            //    return 210;
            //else
            //    return 270;


        }


    }
}