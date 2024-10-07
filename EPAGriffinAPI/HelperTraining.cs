using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace EPAGriffinAPI
{
    //public class HelperTraining
    //{
    //    public class IdeaRecord
    //    {
    //        public string FirstName { get; set; }
    //        public string LastName { get; set; }
    //        public string PID { get; set; }
    //        public string NID { get; set; }

    //        public string CourseTitle { get; set; }

    //        public string CourseCode { get; set; }

    //        public DateTime? Issue { get; set; }

    //        public DateTime? Expire { get; set; }

    //        public DateTime? Start { get; set; }
    //        public DateTime? End { get; set; }

    //        public string row0 { get; set; }
    //        public string row1 { get; set; }
    //        public string row2 { get; set; }
    //        public string row3 { get; set; }
    //        public string row4 { get; set; }
    //        public string row5 { get; set; }
    //        public string row8 { get; set; }
    //        public string row9 { get; set; }

    //        public string row13 { get; set; }
    //        public string row14 { get; set; }


    //    }

    //    public class IdeaRecord2
    //    {
          
    //        public string row0 { get; set; }
    //        public string row1 { get; set; }
    //        public string row2 { get; set; }
    //        public string row3 { get; set; }
    //        public string row4 { get; set; }
    //        public string row5 { get; set; }
    //        public string row6 { get; set; }
    //        public string row7 { get; set; }

    //        public string row8 { get; set; }
    //        public string row9 { get; set; }
    //        public string row10 { get; set; }
    //        public string row11 { get; set; }
    //        public string row12 { get; set; }
    //        public string row13 { get; set; }
    //        public string row14 { get; set; }


    //    }
    //    public static List<IdeaRecord> GetIdeaAll()
    //    {
    //        ServicePointManager
    //.ServerCertificateValidationCallback +=
    //(sender, cert, chain, sslPolicyErrors) => true;
    //        IdeaServiceRef.TrainingWSSoapClient client = new IdeaServiceRef.TrainingWSSoapClient();
            
    //        var obj = client.GetPersonnelDataByDate("passcourse", "20150101", "20220616", "");
    //       // var obj2 = client.GetPersonnelDataByDate("passcourse", "20180101", "20210616", "");
    //       // var obj3 = client.GetPersonnelDataByDate("", "20180101", "20200616", "");
    //        //        var empList = ds.Tables[0].AsEnumerable()
    //        //.Select(dataRow => new Employee
    //        //{
    //        //    Name = dataRow.Field<string>("Name")
    //        //}).ToList();
    //        var records = new List<IdeaRecord>();
    //        var list = obj.Tables[0].Rows[0];
    //        for (int i = 0; i < list.Table.Rows.Count - 1; i++)
    //        {
    //            var row = list.Table.Rows[i];
    //            var dt = row[13];
    //            var ir = new IdeaRecord()
    //            {
    //                PID = row[0].ToString(),


    //                NID = row[1].ToString(),
    //                FirstName = row[2].ToString(),
    //                LastName = row[3].ToString(),
    //                CourseTitle = row[5].ToString(),
    //                CourseCode = row[4].ToString(),
    //                Issue = DBNull.Value.Equals(row[13]) ? null : (Nullable<DateTime>)Convert.ToDateTime(row[13]),
    //                Expire = DBNull.Value.Equals(row[14]) ? null : (Nullable<DateTime>)Convert.ToDateTime(row[14]),

    //                Start = DBNull.Value.Equals(row[8]) ? null : (Nullable<DateTime>)Convert.ToDateTime(row[8]),
    //                End = DBNull.Value.Equals(row[9]) ? null : (Nullable<DateTime>)Convert.ToDateTime(row[9]),
                    

    //            };
    //            records.Add(ir);
    //        }


    //        using (var context = new EPAGRIFFINEntities())
    //        {
    //            context.Configuration.AutoDetectChangesEnabled = false;
    //            context.Configuration.ValidateOnSaveEnabled = false;

    //            var current = context.Ideas.ToList();
    //            context.Ideas.RemoveRange(current);
    //            context.SaveChanges();

    //            foreach (var row in records)
    //            {
    //                var dbrec = new Idea()
    //                {
    //                    DateStart = row.Start,
    //                    DateEnd = row.End,
    //                    BeginDate = row.Start.ToString(),
    //                    EndDate = row.End.ToString(),
    //                    NID = row.NID,
    //                    PID = row.PID,
    //                    CourseCode = row.CourseCode,
    //                    CourseTitle = row.CourseTitle,
    //                    FirstName = row.FirstName,
    //                    LastName = row.LastName,
    //                    DateIssue=row.Issue,
    //                    DateExpire=row.Expire,
    //                    Id=Guid.NewGuid(),

    //                };
    //                if (dbrec.CourseCode == "Re/Annual-Re/Cabin")
    //                    dbrec.DateIssue = dbrec.DateStart;
    //                context.Ideas.Add(dbrec);
    //            }

    //            context.SaveChanges();

    //        }


    //        return records;
    //    }

    //    public static object GetIdeaAll2()
    //    {
    //        ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
    //        IdeaServiceRef.TrainingWSSoapClient client = new IdeaServiceRef.TrainingWSSoapClient();
    //        try
    //        {
    //            var obj = client.GetPersonnelDataByDate("passcourse", "20210401", "20210501", "");
    //            var records = new List<IdeaRecord2>();
    //            var list = obj.Tables[0].Rows[0];
    //            for (int i = 0; i < list.Table.Rows.Count - 1; i++)
    //            {
    //                var row = list.Table.Rows[i];
    //                var dt = row[13];
    //                var ir = new IdeaRecord2()
    //                {
    //                    row0 = DBNull.Value.Equals(row[0]) ? "null" : row[0].ToString(),
    //                    row1 = DBNull.Value.Equals(row[1]) ? "null" : row[1].ToString(),
    //                    row2 = DBNull.Value.Equals(row[2]) ? "null" : row[2].ToString(),
    //                    row3 = DBNull.Value.Equals(row[3]) ? "null" : row[3].ToString(),
    //                    row4 = DBNull.Value.Equals(row[4]) ? "null" : row[4].ToString(),
    //                    row5 = DBNull.Value.Equals(row[5]) ? "null" : row[5].ToString(),
    //                    row6 = DBNull.Value.Equals(row[6]) ? "null" : row[6].ToString(),
    //                    row7 = DBNull.Value.Equals(row[7]) ? "null" : row[7].ToString(),
    //                    row8 = DBNull.Value.Equals(row[8]) ? "null" : row[8].ToString(),
    //                    row9 = DBNull.Value.Equals(row[9]) ? "null" : row[9].ToString(),
    //                    row10 = DBNull.Value.Equals(row[10]) ? "null" : row[10].ToString(),
    //                    row11 = DBNull.Value.Equals(row[11]) ? "null" : row[11].ToString(),
    //                    row12 = DBNull.Value.Equals(row[12]) ? "null" : row[12].ToString(),

    //                    row13 = DBNull.Value.Equals(row[13]) ? "null" : row[13].ToString(),
    //                    row14 = DBNull.Value.Equals(row[14]) ? "null" : row[14].ToString(),
    //                };
    //                records.Add(ir);
    //            }

    //            return records;
    //        }
    //        catch(Exception ex)
    //        {
    //            return ex.Message + "   Inner:   " + (ex.InnerException != null ? ex.InnerException.Message:"-");
    //        }
            
           


    //        //using (var context = new EPAGRIFFINEntities())
    //        //{
    //        //    context.Configuration.AutoDetectChangesEnabled = false;
    //        //    context.Configuration.ValidateOnSaveEnabled = false;

    //        //    var current = context.Ideas.ToList();
    //        //    context.Ideas.RemoveRange(current);
    //        //    context.SaveChanges();

    //        //    foreach (var row in records)
    //        //    {
    //        //        var dbrec = new Idea()
    //        //        {
    //        //            DateStart = row.Start,
    //        //            DateEnd = row.End,
    //        //            BeginDate = row.Start.ToString(),
    //        //            EndDate = row.End.ToString(),
    //        //            NID = row.NID,
    //        //            PID = row.PID,
    //        //            CourseCode = row.CourseCode,
    //        //            CourseTitle = row.CourseTitle,
    //        //            FirstName = row.FirstName,
    //        //            LastName = row.LastName,
    //        //            DateIssue = row.Issue,
    //        //            DateExpire = row.Expire,
    //        //            Id = Guid.NewGuid(),

    //        //        };
    //        //        context.Ideas.Add(dbrec);
    //        //    }

    //        //    context.SaveChanges();

    //        //}


    //       // return records;
    //    }

    //    public static object GetIdeaAll3()
    //    {
    //        ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
    //        IdeaServiceRef.TrainingWSSoapClient client = new IdeaServiceRef.TrainingWSSoapClient();
    //        try
    //        {
                
    //            var obj = client.GetPersonnelDataByDate("passcourse", "20210401", "20210501", "");
    //            var records = new List<IdeaRecord2>();
    //            var list = obj.Tables[0].Rows[0];
                

    //            return list.Table.Rows;
    //        }
    //        catch (Exception ex)
    //        {
    //            return ex.Message + "   Inner:   " + (ex.InnerException != null ? ex.InnerException.Message : "-");
    //        }




           
    //    }

    //    //public static object GetIdeaAll4()
    //    //{
    //    //    ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
    //    //    IdeaServiceRef.TrainingWSSoapClient client = new IdeaServiceRef.TrainingWSSoapClient();
    //    //    try
    //    //    {

    //    //        //var obj = client.GetPersonnelDataByDate("passcourse", "20210401", "20210501", "");
    //    //        var obj = client.GetTrainingDurationSum("passcourse","","2020");
    //    //        var records = new List<IdeaRecord2>();
    //    //        var list = obj.Tables[0].Rows[0];


    //    //        return list.Table.Rows;
    //    //    }
    //    //    catch (Exception ex)
    //    //    {
    //    //        return ex.Message + "   Inner:   " + (ex.InnerException != null ? ex.InnerException.Message : "-");
    //    //    }





    //    //}



    //    public static object GetIdeaLast()
    //    {
    //        var records = GetIdeaAll();
    //        var query = from x in records
    //                    where x.CourseTitle.ToLower().Contains("sept")
    //                    group x by new { x.PID, x.FirstName, x.LastName, x.CourseTitle } into grp
    //                    select new
    //                    {
    //                        grp.Key.PID,
    //                        grp.Key.FirstName,
    //                        grp.Key.LastName,
    //                        grp.Key.CourseTitle,
    //                        grp.OrderByDescending(q => q.Issue).FirstOrDefault().Issue
    //                    };

    //        return query.ToList();
    //    }

    //    public static object GetIdeaLast2()
    //    {
    //        var records = GetIdeaAll2();
    //        return records;
    //    }


    //}
}