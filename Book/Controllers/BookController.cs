using Book.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

//using System.Web.Http;

namespace Book.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    [Authorize(Roles ="admin")]
    public class BookController : ControllerBase
    {
        private readonly bookContext context;
        private readonly ILogger<BookController> logger;
        public BookController(bookContext context, ILogger<BookController> logger)
        {
            this.context = context;
            this.logger = logger;
        }

       
        [HttpGet("Get All Books")]
        public IActionResult GetBooks()
        {
            var books = context.Books.ToList();
            if (books.Any())
            {
               
                return Ok(books);
            }
            else
            {
                return NotFound();
            }
        }


        [HttpGet("GetBookById/{id}")]
        public IActionResult GetBook(int id)
        {
            var book = context.Books.Find(id);
            if (book == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(book);
            }
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] book book)
        {
            try
            {
                context.Add(book);
                context.SaveChanges();
                return Ok(book);
            }catch(Exception ex)
            {
                return BadRequest(ex);
            }

        }

        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            try
            {
                var book = context.Books.Find(id);
                if (book == null)
                {
                    return NotFound();
                }
                else
                {
                    context.Books.Remove(book);
                    context.SaveChanges();
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateBook/{id}")]
        public IActionResult UpdateBook([FromBody] book book, int id)
        {
            try
            {
                var Updatedbook = context.Books.Find(id);
                if (UpdateBook == null)
                {
                    return NotFound();
                }
                else
                {
                    Updatedbook.Author = book.Author;
                    Updatedbook.PublishDate = book.PublishDate;
                    Updatedbook.Title = book.Title;
                    Updatedbook.Genre = book.Genre;
                    Updatedbook.Isbn = book.Isbn;

                    context.SaveChanges();
                    return Ok(Updatedbook);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
