using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.OData;
using EPAGriffinAPI.Models;
using System.Web.Http.Description;
using System.Collections.Generic;
using System;
using System.Data.Entity.Validation;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using EPAGriffinAPI.DAL;
using System.Text;
using System.Configuration;
using Newtonsoft.Json;
using EPAGriffinAPI.ViewModels;

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class TrainingController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();


        //[Route("odata/training/ext/test")]

        //public async Task<IHttpActionResult> GetTrainingTest()
        //{
        //    // var data=HelperTraining.GetTrainingTest();
        //    var data = HelperTraining.GetIdeaLast();

        //    return Ok(data);

        //}

        //[Route("odata/training/idea/all")]

        //public async Task<IHttpActionResult> GetTrainingTestAll()
        //{
        //    // var data=HelperTraining.GetTrainingTest();
        //    var data = HelperTraining.GetIdeaAll();

        //    return Ok(data);

        //}

        //[Route("odata/training/ext/test2")]

        //public async Task<IHttpActionResult> GetTrainingTest2()
        //{
        //    // var data=HelperTraining.GetTrainingTest();
        //    var data = HelperTraining.GetIdeaLast2();

        //    return Ok(data);

        //}

        //[Route("odata/training/ext/test3")]

        //public async Task<IHttpActionResult> GetTrainingTest3()
        //{
        //    // var data=HelperTraining.GetTrainingTest();
        //    var data = HelperTraining.GetIdeaAll3();

        //    return Ok(data);

        //}

        ////[Route("odata/training/ext/test4")]

        ////public async Task<IHttpActionResult> GetTrainingTest4()
        ////{
        ////    // var data=HelperTraining.GetTrainingTest();
        ////    var data = HelperTraining.GetIdeaAll4();

        ////    return Ok(data);

        ////}

        //[Route("odata/training/ext/idea/update")]
        //[AcceptVerbs("GET")]
        //public async Task<IHttpActionResult> PostUpdateFromIdea()
        //{
        //    var result = await unitOfWork.PersonRepository.UpdateByIdea();
            
        //    return result;
             
        //}




        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                //db.Dispose();
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }




    }
}
