﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ApiMSG.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ppa_vareshEntities : DbContext
    {
        public ppa_vareshEntities()
            : base("name=ppa_vareshEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<MVT> MVTs { get; set; }
        public virtual DbSet<MVTAPI> MVTAPIs { get; set; }
        public virtual DbSet<ViewLegTime> ViewLegTimes { get; set; }
        public virtual DbSet<ViewFlightDelayCode> ViewFlightDelayCodes { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<SMSHistory> SMSHistories { get; set; }
        public virtual DbSet<ViewCrewPickupSM> ViewCrewPickupSMS { get; set; }
        public virtual DbSet<ViewSMSHistory> ViewSMSHistories { get; set; }
        public virtual DbSet<ViewNotification> ViewNotifications { get; set; }
    }
}