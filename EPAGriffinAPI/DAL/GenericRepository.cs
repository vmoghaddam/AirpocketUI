using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;
 
using System.Data.Entity.Infrastructure;

namespace EPAGriffinAPI.DAL
{
    public class GenericRepository<TEntity> where TEntity : class
    {
        internal EPAGRIFFINEntities context;
        internal DbSet<TEntity> dbSet;

        public GenericRepository(EPAGRIFFINEntities context)
        {
            this.context = context;
            this.context.Database.CommandTimeout = 240;
            this.dbSet = context.Set<TEntity>();
            
        }

        public virtual IEnumerable<TEntity> GetWithRawSql(string query, params object[] parameters)
        {
            return dbSet.SqlQuery(query, parameters).ToList();
        }

        public virtual IQueryable<TEntity> GetQuery()
        {
            IQueryable<TEntity> query = dbSet;
            return query;
        }

        public virtual IQueryable<T> GetQuery<T>() where T : class
        {
            IQueryable<T> query = context.Set<T>().AsNoTracking();
            return query;
        }

        public virtual IEnumerable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            else
            {
                return query.ToList();
            }
        }

        public virtual async Task<TEntity> GetByID(object id)
        {
            return  await dbSet.FindAsync(id);
        }

        public virtual void Insert(TEntity entity)
        {
            dbSet.Add(entity);
        }
        
        public virtual void Delete(object id)
        {
            TEntity entityToDelete = dbSet.Find(id);
            Delete(entityToDelete);
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            if (context.Entry(entityToDelete).State == EntityState.Detached)
            {
                dbSet.Attach(entityToDelete);
            }
            dbSet.Remove(entityToDelete);
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
        }
    }
}