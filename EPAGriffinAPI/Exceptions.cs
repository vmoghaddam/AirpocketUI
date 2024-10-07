using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Http.ModelBinding;

namespace EPAGriffinAPI
{
    public class Exceptions
    {
        internal static Exception HandleDbUpdateException(DbUpdateException dbu)
        {
            var builder = new StringBuilder("A DbUpdateException was caught while saving changes. ");

            try
            {
                foreach (var result in dbu.Entries)
                {
                    builder.AppendFormat("Type: {0} was part of the problem. ", result.Entity.GetType().Name);
                }
            }
            catch (Exception e)
            {
                builder.Append("Error parsing DbUpdateException: " + e.ToString());
            }

            string message = builder.ToString();
            return new Exception(message, dbu);
        }


        internal static CustomActionResult getModelValidationException(ModelStateDictionary modelState)
        {
            return new CustomActionResult(HttpStatusCode.NotAcceptable, "ERR-VALIDATION-00: validation failed.value required");
        }
        internal static CustomActionResult getNullException(ModelStateDictionary modelState)
        {
            return new CustomActionResult(HttpStatusCode.NotAcceptable, "ERR-VALIDATION-01: validation failed.object is null");
        }

        internal static CustomActionResult getNotFoundException()
        {
            return new CustomActionResult(HttpStatusCode.NotAcceptable, "ERR-VALIDATION-02:object not found");
        }

        internal static CustomActionResult getDuplicateException(string code,string property)
        {
            return new CustomActionResult(HttpStatusCode.NotAcceptable, "ERR-"+code+":Duplicate "+property+" found.");
        }

        internal static CustomActionResult getCanNotDeleteException(string code)
        {
            return new CustomActionResult(HttpStatusCode.NotAcceptable, "ERR-" + code + ":Item cannot be deleted.");
        }
    }
}