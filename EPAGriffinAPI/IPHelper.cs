using EPAGriffinAPI.DAL;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.Caching;
using System.Web;

namespace EPAGriffinAPI
{
    public class IPHelper
    {

        static List<Models.ViewIPAccess> ipsList = null;

        public static List<Models.ViewIPAccess> GetIPAccesses2()
        {
            //if (ipsList == null)
            //{
            //    UnitOfWork unitOfWork = new UnitOfWork();
            //    ipsList = unitOfWork.PersonRepository.GetIPAccess();
                
            //}
            return ipsList;
        }

        public static void SetIPAccesses2()
        {
            UnitOfWork unitOfWork = new UnitOfWork();
            ipsList = unitOfWork.PersonRepository.GetIPAccess();

        }
        public static void ClearCache()
        {
            ipsList = null;

        }

        private static TEntity GetFromCache<TEntity>(string key, Func<TEntity> valueFactory) where TEntity : class
        {
            ObjectCache cache = MemoryCache.Default;
            // the lazy class provides lazy initializtion which will eavaluate the valueFactory expression only if the item does not exist in cache
            var newValue = new Lazy<TEntity>(valueFactory);
            CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(30), Priority=CacheItemPriority.NotRemovable };
            //The line below returns existing item or adds the new value if it doesn't exist
            var value = cache.AddOrGetExisting(key, newValue, policy) as Lazy<TEntity>;
            return (value ?? newValue).Value; // Lazy<T> handles the locking itself
        }
        public static void RemoveIPCache()
        {
            var cacheKey = "ipaccess";
            ObjectCache cache = MemoryCache.Default;
            cache.Remove(cacheKey);
        }

        public static object GetCache()
        {
            // var cacheKey = "ipaccess";
            // ObjectCache cache = MemoryCache.Default;
            // return cache.Get(cacheKey);
            return GetIPAccesses2();
        }

        public static bool IsAllowed(string ip,string username)
        {
            if (ConfigurationManager.AppSettings["ipaccess"] == "0")
                return true;
           
            //return true;
            var cacheKey = "ipaccess";
            username = username.ToLower();
            if (username != "trans.varesh")
                return true;
                //var access = GetFromCache<List<Models.ViewIPAccess>>(cacheKey, () => {
                //    // load movie from DB
                //    UnitOfWork unitOfWork = new UnitOfWork();
                //    return unitOfWork.PersonRepository.GetIPAccess();
                //});
            UnitOfWork unitOfWork = new UnitOfWork();
            //    ipsList = unitOfWork.PersonRepository.GetIPAccess();
            var access = unitOfWork.PersonRepository.GetIPAccess();
            var accall = access.Where(q => q.IP == "*" && q.UserName.ToLower() == "*").FirstOrDefault();
            if (accall != null)
                return true;
            var acc1 = access.Where(q =>q.IP=="*" && username.StartsWith(q.UserName.ToLower().Replace("*", ""))).FirstOrDefault();
            if (acc1 != null)
                return true;
            var acc2= access.Where(q => q.UserName.ToLower() == "*" && ip.StartsWith(q.IP.Replace("*", ""))).FirstOrDefault();
            if ( acc2 != null)
                return true;
            var acc3 = access.Where(q => username.StartsWith(q.UserName.ToLower().Replace("*", "")) && ip.StartsWith(q.IP.Replace(".*", ""))).FirstOrDefault();
            if (acc3 != null)
                return true;

            //return true;
            return false;
        }


        public static object IsAllowed2(string ip, string username)
        {
            var cacheKey = "ipaccess";
            UnitOfWork unitOfWork = new UnitOfWork();
            //    ipsList = unitOfWork.PersonRepository.GetIPAccess();
            var access = unitOfWork.PersonRepository.GetIPAccess();
            var accall = access.Where(q => q.IP == "*" && q.UserName == "*").FirstOrDefault();
             
            var acc1 = access.Where(q => q.IP == "*" && username.StartsWith(q.UserName.Replace("*", ""))).FirstOrDefault();
            var acc2 = access.Where(q => q.UserName == "*" && ip.StartsWith(q.IP.Replace("*", ""))).FirstOrDefault();
             
            var acc3 = access.Where(q => username.StartsWith(q.UserName.Replace("*", "")) && ip.StartsWith(q.IP.Replace(".*", ""))).FirstOrDefault();
            
            return new
            {
                access
                ,accall
                ,acc1
                ,acc2
                ,acc3
            };
        }

    }
}