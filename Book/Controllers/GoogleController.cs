using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Book.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleController : ControllerBase
    {

        [HttpPost("validateGoogleToken")]
        public IActionResult ValidateGoogleToken([FromBody] TokenRequestModel tokenRequest)
        {
            try
            {
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { "485947985520-2929tagfo657ogj3ghljgq3e51rle2em.apps.googleusercontent.com" } // Replace with your actual Google Client ID
                };

                // var payload = GoogleJsonWebSignature.ValidateAsync(tokenRequest.Token, new GoogleJsonWebSignature.ValidationSettings()).Result;

                var payload = GoogleJsonWebSignature.ValidateAsync(tokenRequest.Token, validationSettings).Result;

                

                var userId = payload.Subject;
                var userEmail = payload.Email;

                

                return Ok(new { UserId = userId, Email = userEmail, Message = "Token is valid" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Token validation failed: {ex.Message}");
            }
        }
    }
    public class TokenRequestModel
    {
        public string Token { get; set; }
    }
}
