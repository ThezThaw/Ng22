using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Ng22.Helper;
using Ng22.Model;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("token")]
        public async Task<IActionResult> Token([FromBody]LoginRequestVm loginRequestVm)
        {
            try
            {                

                if (loginRequestVm.userId == "admin")
                {
                    var claims = new List<Claim>()
                    {
                        new Claim(JwtRegisteredClaimNames.UniqueName, loginRequestVm.userId),
                        new Claim(ClaimTypes.Name, "admin"),
                        new Claim(ClaimTypes.Role, "admin")
                    };
                    var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ng22-1234567890123456789"));
                    var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var expire = DateTime.Now.AddMinutes(Config.TokenExpireMinute);
                    var token = new JwtSecurityToken(
                                        claims: claims, 
                                        expires: expire, 
                                        signingCredentials: credential);
                    return Ok(new LoginResultVm() 
                    { 
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        userInfo = new UserInfoVm()
                        { 
                            userId = loginRequestVm.userId,
                            nickName = loginRequestVm.userId
                        }
                    });
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("get-user")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            return Ok(new UserInfoVm
            {
                userId = User.FindFirst(ClaimTypes.Name)?.Value,                
                nickName = "admin"
            });
        }
    }
}
