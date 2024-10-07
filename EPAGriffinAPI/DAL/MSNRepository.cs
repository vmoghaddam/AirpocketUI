using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;
using EPAGriffinAPI.ViewModels;
using System.Threading;

namespace EPAGriffinAPI.DAL
{
    public class MSNRepository : GenericRepository<Models.Ac_MSN>
    {
        public MSNRepository(EPAGRIFFINEntities context)
       : base(context)
        {
        }

        public IQueryable<ViewMSN> GetViewMSNs()
        {
            return this.GetQuery<ViewMSN>();
        }
        public async Task<ViewModels.Ac_MSNDto> GetDto(int id)
        {
            var msndto = new ViewModels.Ac_MSNDto();
            var dbmsn = await context.Ac_MSN.FirstOrDefaultAsync(q => q.ID == id);
            ViewModels.Ac_MSNDto.FillDto(dbmsn, msndto);
            return msndto;
        }

        internal virtual CustomActionResult Validate(Ac_MSNDto dto)
        {
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        internal virtual CustomActionResult CanDelete(Ac_MSN entity)
        {
            return new CustomActionResult(HttpStatusCode.OK, "");
        }
    }
}