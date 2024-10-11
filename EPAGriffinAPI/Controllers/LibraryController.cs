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

namespace EPAGriffinAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LibraryController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [Route("odata/library/books/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBook> GetBooksByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.BookRepository.GetViewBooks().Where(q => (q.CustomerId == null || q.CustomerId == cid) && q.TypeId != 86);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        [Route("odata/library/books/folder/{cid}/{fullcode}/{sub}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBook> GetBooksByFolder(int cid, string fullcode, int sub)
        {
            try
            {
                if (sub == 1)
                    return unitOfWork.BookRepository.GetViewBooks().Where(q => q.CustomerId == cid && q.TypeId != 86 && q.FullCode.StartsWith(fullcode));
                else

                    return unitOfWork.BookRepository.GetViewBooks().Where(q => q.CustomerId == cid && q.TypeId != 86 && q.FullCode == fullcode);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/library/documents/folder/{cid}/{fullcode}/{sub}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBook> GetDocumentsByFolder(int cid, string fullcode, int sub)
        {
            try
            {
                if (sub == 1)
                    return unitOfWork.BookRepository.GetViewBooks().Where(q => q.CustomerId == cid && q.TypeId == 86 && q.FullCode.StartsWith(fullcode));
                else

                    return unitOfWork.BookRepository.GetViewBooks().Where(q => q.CustomerId == cid && q.TypeId == 86 && q.FullCode == fullcode);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/library/exposed/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBook> GetExposedLibraryByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.BookRepository.GetViewBooks().Where(q => (q.CustomerId == null || q.CustomerId == cid) && q.IsExposed == 1).OrderByDescending(q => q.DateExposure);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/library/documents/{cid}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBook> GetDocumentsByCustomerId(int cid)
        {
            try
            {
                return unitOfWork.BookRepository.GetViewBooks().Where(q => (q.CustomerId == null || q.CustomerId == cid) && q.TypeId == 86);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/library/books/applicable/employees/{id}")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<ViewBookApplicableEmployeeAb> GetBooksApplicableEmployees(int id)
        {
            try
            {
                return unitOfWork.BookRepository.GetViewBookApplicableEmployeeAb().Where(q => q.BookId == id);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }
        //GetBookFileIrls
        [AcceptVerbs("POST")]
        [Route("odata/library/books/file/{id}")]

        // [Authorize]
        public IHttpActionResult GetBookFileUrls(int id)
        {
            try
            {
                var files = unitOfWork.BookRepository.GetBookFileUrls(id);
                return Ok(files);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }


        [AcceptVerbs("POST")]
        [Route("odata/library/books/file/single/{id}")]

        // [Authorize]
        public IHttpActionResult GetBookFileUrl(int id)
        {
            try
            {
                var file = unitOfWork.BookRepository.GetBookFileUrl(id);
                return Ok(file);
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null)
                    msg += " INNER "+ex.InnerException.Message;
                // throw new HttpResponseException(Ok( msg));
                return Ok(msg);
            }



        }


        [Route("odata/library/book/expose")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostExposeBook(ViewModels.BookExpose dto)
        {
            var result = await unitOfWork.BookRepository.ExposeBook(dto);
            if (result)
            {
                var saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;


                return Ok(dto);
            }

            else
                return Ok(false);
        }
        [Route("odata/library/sms/test")]
       
        public async Task<IHttpActionResult> GetETestSMS()
        {
            Magfa m = new Magfa();
            var res = m.enqueue(1, "09124449584", "SMS PANEL TEST");
            return Ok(res[0].ToString());
        }

        [Route("odata/library/book/notify/{id}")]
        [AcceptVerbs("GET")]
        public async Task<IHttpActionResult> PostExposeBook(int id)
        {
            ViewModels.BookExpose dto = new ViewModels.BookExpose()
            {
                BookId = id,
                AppNotification = true,
                CustomerId = 1,
                Email = true,
                SMS = true,
            };
            var result = await unitOfWork.BookRepository.ExposeBook(dto);
            if (result)
            {
                var saveResult = await unitOfWork.SaveAsync();
                if (saveResult.Code != HttpStatusCode.OK)
                    return saveResult;


                return Ok(id);
            }

            else
                return InternalServerError();
        }

        [Route("odata/library/move")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostMove(dynamic dto)
        {
            var fid = Convert.ToInt32(dto.folderId);
            string _ids = Convert.ToString(dto.ids);
            var ids = _ids.Split('_').Select(q => Convert.ToInt32(q)).ToList();
            var items = unitOfWork.BookRepository.GetQuery().Where(q => ids.Contains(q.Id)).ToList();
            foreach (var item in items)
                item.FolderId = fid;

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;


            return Ok(true);

        }


        [Route("odata/library/keywords")]
        [EnableQuery]
        // [Authorize]
        public IQueryable<string> GetKeywords()
        {
            try
            {
                return unitOfWork.BookRepository.GetKeywords();
                // return db.ViewAirports.AsNoTracking() ;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }



        }

        [Route("odata/library/book/{id}")]
        public async Task<IHttpActionResult> GetBook(int id)
        {
            var course = await unitOfWork.BookRepository.GetBookDtoNew(id);
            return Ok(course);
        }


        [Route("odata/library/book/old/{id}")]
        public async Task<IHttpActionResult> GetBookOld(int id)
        {
            var course = await unitOfWork.BookRepository.GetBookDto(id);
            return Ok(course);
        }

        [Route("odata/library/book/files/{id}")]
        public async Task<IHttpActionResult> GetBookFiles(int id)
        {
            var course = await unitOfWork.BookRepository.GetBookFiles(id);
            return Ok(course);
        }

        [Route("odata/library/book/save")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostBook(ViewModels.Book dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.BookRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Book entity = null;

            if (dto.Id == -1)
            {
                entity = new Book();
                unitOfWork.BookRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.BookRepository.GetByID(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.Book.Fill(entity, dto);


            unitOfWork.BookRepository.FillBookRelatedAircraftTypes(entity, dto);

            unitOfWork.BookRepository.FillBookRelatedEmployees(entity, dto);
            unitOfWork.BookRepository.FillBookRelatedGroupsNew(entity, dto);
            //unitOfWork.BookRepository.FillBookRelatedTypeGroups(entity, dto);
            unitOfWork.BookRepository.FillBookRelatedStudyFields(entity, dto);
            unitOfWork.BookRepository.FillBookAuthors(entity, dto);
            unitOfWork.BookRepository.FillBookKeywords(entity, dto);
            unitOfWork.BookRepository.FillBookFiles(entity, dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            await unitOfWork.BookRepository.UpdateChapters(entity.BookKey, entity.Id);
            saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            //string webUrl = ConfigurationManager.AppSettings["web"] + "downloadhandler.ashx?t=bookarchive&id=" + entity.Id;
            //object input = new
            //{

            //};
            //string inputJson = Newtonsoft.Json.JsonConvert.SerializeObject(input);

            //WebClient client = new WebClient();
            //client.Headers["Content-type"] = "application/json";
            //client.Encoding = Encoding.UTF8;

            //string json = client.UploadString(webUrl, inputJson);


            dto.Id = entity.Id;
            return Ok(dto);
        }



        [Route("odata/library/book/save/old")]

        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> PostBookOLD(ViewModels.Book dto)
        {
            // return Ok(client);
            if (dto == null)
                return Exceptions.getNullException(ModelState);
            if (!ModelState.IsValid)
            {
                // return BadRequest(ModelState);
                return Exceptions.getModelValidationException(ModelState);
            }
            var validate = unitOfWork.BookRepository.Validate(dto);
            if (validate.Code != HttpStatusCode.OK)
                return validate;

            Book entity = null;

            if (dto.Id == -1)
            {
                entity = new Book();
                unitOfWork.BookRepository.Insert(entity);
            }

            else
            {
                entity = await unitOfWork.BookRepository.GetByID(dto.Id);

            }

            if (entity == null)
                return Exceptions.getNotFoundException();

            //ViewModels.Location.Fill(entity, dto);
            ViewModels.Book.Fill(entity, dto);


            unitOfWork.BookRepository.FillBookRelatedAircraftTypes(entity, dto);

            unitOfWork.BookRepository.FillBookRelatedEmployees(entity, dto);
            unitOfWork.BookRepository.FillBookRelatedGroupsNew(entity, dto);
            //unitOfWork.BookRepository.FillBookRelatedTypeGroups(entity, dto);
            unitOfWork.BookRepository.FillBookRelatedStudyFields(entity, dto);
            unitOfWork.BookRepository.FillBookAuthors(entity, dto);
            unitOfWork.BookRepository.FillBookKeywords(entity, dto);
            unitOfWork.BookRepository.FillBookFiles(entity, dto);

            unitOfWork.BookRepository.FillBookCourses(entity, dto);



            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;
            await unitOfWork.BookRepository.UpdateChapters(entity.BookKey, entity.Id);
            saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            //string webUrl = ConfigurationManager.AppSettings["web"] + "downloadhandler.ashx?t=bookarchive&id=" + entity.Id;
            //object input = new
            //{

            //};
            //string inputJson = Newtonsoft.Json.JsonConvert.SerializeObject(input);

            //WebClient client = new WebClient();
            //client.Headers["Content-type"] = "application/json";
            //client.Encoding = Encoding.UTF8;

            //string json = client.UploadString(webUrl, inputJson);


            dto.Id = entity.Id;
            return Ok(dto);
        }

        [Route("odata/library/book/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteLibraryFolder(ViewModels.Location dto)
        {
            var entity = await unitOfWork.BookRepository.GetByID(dto.Id);

            if (entity == null)
            {
                return NotFound();
            }

            unitOfWork.BookRepository.Delete(entity);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }

        [Route("odata/library/book/file/delete")]
        [AcceptVerbs("POST")]
        public async Task<IHttpActionResult> DeleteLibraryBookFile(dynamic dto)
        {
            int id = Convert.ToInt32(dto.id);

            await unitOfWork.BookRepository.DeleteBookFile(id);

            var saveResult = await unitOfWork.SaveAsync();
            if (saveResult.Code != HttpStatusCode.OK)
                return saveResult;

            return Ok(dto);
        }


    }
}
