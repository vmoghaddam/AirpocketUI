﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Report
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ppa_cspnEntities : DbContext
    {
        public ppa_cspnEntities()
            : base("name=ppa_cspnEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Person> People { get; set; }
        public virtual DbSet<ViewCourseSession> ViewCourseSessions { get; set; }
        public virtual DbSet<ViewCourseSessionPresence> ViewCourseSessionPresences { get; set; }
        public virtual DbSet<ViewCourseNew> ViewCourseNews { get; set; }
        public virtual DbSet<ViewSyllabu> ViewSyllabus { get; set; }
        public virtual DbSet<ViewCoursePeople> ViewCoursePeoples { get; set; }
        public virtual DbSet<ViewLogBook18> ViewLogBook18 { get; set; }
    }
}
