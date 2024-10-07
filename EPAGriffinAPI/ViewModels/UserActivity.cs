using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAGriffinAPI.ViewModels
{
    public class UserActivityX
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public int UserId { get; set; }
        public string Key { get; set; }
        public string Url { get; set; }
        public int? ModuleId { get; set; }
        public bool IsMain { get; set; }
        public int? CustomerId { get; set; }
        public string Remark { get; set; }
        public static void Fill(Models.UserActivity entity, ViewModels.UserActivityX useractivity)
        {
            entity.Id = useractivity.Id;
            entity.Date = DateTime.Now;
            entity.UserId = useractivity.UserId;
            entity.Key = useractivity.Key;
            entity.Url = useractivity.Url;
            entity.ModuleId = useractivity.ModuleId;
            entity.IsMain = useractivity.IsMain;
            entity.CustomerId = useractivity.CustomerId;
            entity.Remark = useractivity.Remark;
        }
        public static void FillDto(Models.UserActivity entity, ViewModels.UserActivityX useractivity)
        {
            useractivity.Id = entity.Id;
            useractivity.Date = entity.Date;
            useractivity.UserId = entity.UserId;
            useractivity.Key = entity.Key;
            useractivity.Url = entity.Url;
            useractivity.ModuleId = entity.ModuleId;
            useractivity.IsMain = entity.IsMain;
            useractivity.CustomerId = entity.CustomerId;
            useractivity.Remark = entity.Remark;
        }
    }


    public class UserActivityMenuHitX
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ModuleId { get; set; }
        public string Key { get; set; }
        public int? CustomerId { get; set; }
        public int Hit { get; set; }
        public DateTime DateLastHit { get; set; }
        public static void Fill(Models.UserActivityMenuHit entity, ViewModels.UserActivityMenuHitX useractivitymenuhit)
        {
            entity.Id = useractivitymenuhit.Id;
            entity.UserId = useractivitymenuhit.UserId;
            entity.ModuleId = useractivitymenuhit.ModuleId;
            entity.Key = useractivitymenuhit.Key;
            entity.CustomerId = useractivitymenuhit.CustomerId;
            entity.Hit = useractivitymenuhit.Hit;
            entity.DateLastHit = useractivitymenuhit.DateLastHit;
        }
        public static void FillDto(Models.UserActivityMenuHit entity, ViewModels.UserActivityMenuHitX useractivitymenuhit)
        {
            useractivitymenuhit.Id = entity.Id;
            useractivitymenuhit.UserId = entity.UserId;
            useractivitymenuhit.ModuleId = entity.ModuleId;
            useractivitymenuhit.Key = entity.Key;
            useractivitymenuhit.CustomerId = entity.CustomerId;
            useractivitymenuhit.Hit = entity.Hit;
            useractivitymenuhit.DateLastHit = entity.DateLastHit;
        }
        public static void FillByUserActivityDto(Models.UserActivityMenuHit entity, ViewModels.UserActivityX useractivity)
        {
            
            entity.UserId = useractivity.UserId;
            entity.ModuleId =(int) useractivity.ModuleId;
            entity.Key = useractivity.Key;
            entity.CustomerId = useractivity.CustomerId;
            entity.Hit = 1;
            entity.DateLastHit = DateTime.Now;
        }
    }



}