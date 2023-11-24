using Book.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Book.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   // [Authorize(Roles ="Admin")]
    //[Authorize]
    public class UserController : ControllerBase
    {
        private readonly bookContext context;
        private readonly IConfiguration configuration;
        public UserController(bookContext context,IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }
        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = context.Admins.ToList();
                if (users.Any())
                {
                    return Ok(users);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetUserById/{id}")]
        public IActionResult GetUser(int id)
        {
            try
            {
                var user = context.Admins.Find(id);
                if (user == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(user);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddUser")]
        public IActionResult AddUser([FromBody] Admin admin)
        {
            try
            {
                context.Add(admin);
                context.SaveChanges();
                return Ok(admin);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPost("Verify")]
        public IActionResult Verify([FromBody] Credential data)
        {
            try
            {
                var user = context.Admins.FirstOrDefault(e => e.Email == data.Email);
                if (user == null)
                {
                    return Ok("invalid Email");
                }
                else
                {
                    if (user.Password == data.Password)
                    {
                        var JWTtoken = Authenticate(data.Email);
                        return Ok(new { id = user.Id ,token=JWTtoken});
                    }
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }
        [HttpPut("UpdateData/{id}")]
        public IActionResult UpdateUser([FromBody] Admin admin,int id)
        {
            var user = context.Admins.Find(id);
            if(user == null)
            {
                return NotFound();
            }
            else
            {
                user.Password = admin.Password;
                user.Email = admin.Email;
                user.Gender = admin.Gender;
                user.Mobile = admin.Mobile;
                user.Name = admin.Name;
                user.Isadmin = admin.Isadmin;

                context.SaveChanges();
                return Ok(user);
            }
        }

        [HttpGet("EmailEXists/{email}")]
        public IActionResult EmailExists(string email)
        {
            try
            {
                var user = context.Admins.FirstOrDefault(e => e.Email == email);
                if (user == null)
                {
                    return Ok(new { result = false, id = 0 });
                }
                else
                {
                   
                    return Ok(new { result = true, id = user.Id });
                }
            }catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("DeleteUser/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = context.Admins.Find(id);
            if(user == null )
            { return NotFound(); }
            context.Remove(user);
            context.SaveChanges();
            return Ok();
        }

        private object Authenticate (string email)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configuration["JWT:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, email),
                    new Claim(ClaimTypes.Role, "Admin")
                }),
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)

            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

    }
    public class Credential
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
