using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace EPAGriffinAPI.Models
{
    public partial class EPAGRIFFINEntities
    {
        public async Task<CustomActionResult> SaveAsync()
        {
            try
            {
                
                await this.SaveChangesAsync();
                return new CustomActionResult(HttpStatusCode.OK, "");
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {

                    foreach (var ve in eve.ValidationErrors)
                    {
                        var xxx =
                             ve.PropertyName + " " + ve.ErrorMessage;
                    }
                }
                return new CustomActionResult(HttpStatusCode.InternalServerError, "DbEntityValidationException");
            }
            catch (DbUpdateException dbu)
            {
                var exception = Exceptions.HandleDbUpdateException(dbu);
                return new CustomActionResult(HttpStatusCode.InternalServerError, exception.Message);
            }
            catch (Exception ex)
            {
                return new CustomActionResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public    CustomActionResult  SaveActionResult ()
        {
            try
            {

                 this.SaveChangesAsync();
                return new CustomActionResult(HttpStatusCode.OK, "");
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {

                    foreach (var ve in eve.ValidationErrors)
                    {
                        var xxx =
                             ve.PropertyName + " " + ve.ErrorMessage;
                    }
                }
                return new CustomActionResult(HttpStatusCode.InternalServerError, "DbEntityValidationException");
            }
            catch (DbUpdateException dbu)
            {
                var exception = Exceptions.HandleDbUpdateException(dbu);
                return new CustomActionResult(HttpStatusCode.InternalServerError, exception.Message);
            }
            catch (Exception ex)
            {
                return new CustomActionResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }



    }
}