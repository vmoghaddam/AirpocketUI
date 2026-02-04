using mpNuget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace EPAGriffinAPI
{
    public class MelliPayamac
    {
        public string send(string mobile, string name, string message)
        {
            RestClient client = new RestClient("9354957316", "Rhbsms99@");
            var result = client.Send(mobile, "90009105", message, false).Value;
            return result;

        }
        public string get_delivery(string refid)
        {
            RestClient client = new RestClient("9354957316", "Rhbsms99@");
            var rest_result = client.GetDelivery(Convert.ToInt64(refid)).Value;
            var str = "نامشخص";
            switch (Convert.ToInt32(rest_result))
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

            return str;


        }
    };



}