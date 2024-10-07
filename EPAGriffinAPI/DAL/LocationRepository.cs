using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Net;


namespace EPAGriffinAPI.DAL
{
    public class LocationRepository : GenericRepository<Location>
    {
        public LocationRepository(EPAGRIFFINEntities context)
           : base(context)
        {
        }

        public IQueryable<ViewLocation> GetViewLocations()
        {
            return this.GetQuery<ViewLocation>();
        }
        public IQueryable<Location> GetLocations()
        {
            return this.GetQuery<Location>();
        }


        public virtual Location GetByTitleInParent(int id,int? parentid, string title)
        {
            title = title.ToLower();
            return dbSet.FirstOrDefault(q => q.Id != id && q.Title.ToLower() == title && q.ParentId==parentid);
        }

        public virtual Location GetByFullCode(int id, int cid, string code)
        {
             
            return dbSet.FirstOrDefault(q => q.Id != id && q.CustomerId==cid && q.FullCode==code);
        }

        public virtual bool HasChildren(int id)
        {
            return dbSet.Count(q => q.ParentId == id) > 0;
        }

        public virtual CustomActionResult Validate(ViewModels.Location dto)
        {
            var checkByTitle = GetByTitleInParent(dto.Id, dto.ParentId, dto.Title);
            if (checkByTitle != null)
                return Exceptions.getDuplicateException("Location-01", "Title");
            var checkByCode = GetByFullCode(dto.Id, dto.CustomerId, dto.FullCode);
            if (checkByCode != null)
                return Exceptions.getDuplicateException("Location-02", "FullCode");

            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual CustomActionResult CanDelete(Models.Location entity)
        {
            
            if (HasChildren(entity.Id))
                return Exceptions.getCanNotDeleteException("Location-03");
            var empcnt = this.context.EmployeeLocations.Where(q => q.LocationId == entity.Id).Count();
            if (empcnt>0)
                return Exceptions.getCanNotDeleteException("Location-04");
            return new CustomActionResult(HttpStatusCode.OK, "");
        }

        public virtual void UpdateChildren(Location entity,   string fullcode)
        {
            var children = dbSet.Where(q => q.ParentId == entity.Id).ToList();
            foreach (var x in children)
            {
                
                x.FullCode = fullcode + x.Code;
                UpdateChildren(x,   x.FullCode);
            }

        }
    }
}