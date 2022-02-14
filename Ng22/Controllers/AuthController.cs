using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Ng22.Backend;
using Ng22.Backend.Resource;
using Ng22.Helper;
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
        private readonly IMissionResource missionResource;
        private readonly IAppUserResource appUserResource;
        public AuthController(IMissionResource missionResource, IAppUserResource appUserResource)
        {
            this.missionResource = missionResource;
            this.appUserResource = appUserResource;
        }

        [HttpPost("token-l1")]
        public async Task<IActionResult> GetL1Token([FromBody]LoginRequestVm loginRequestVm)
        {
            try
            {
                var VerifiedUser = await appUserResource.GetVerifyUser(loginRequestVm.userId, loginRequestVm.password);
                if (VerifiedUser != null)
                {
                    var claims = new List<Claim>()
                    {
                        new Claim(JwtRegisteredClaimNames.UniqueName, loginRequestVm.userId),
                        new Claim(ClaimTypes.Name, "admin"),
                        new Claim(ClaimTypes.Role, "admin")
                    };
                    var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ng22-1234567890123456789"));
                    var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var expire = DateTime.Now.AddMinutes(Config.L1TokenExpireMinute);
                    var token = new JwtSecurityToken(
                                        issuer: "Ng22",
                                        audience: "L1",
                                        claims: claims, 
                                        expires: expire, 
                                        signingCredentials: credential);


                    return Ok(new LoginResultVm()
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        appUser = VerifiedUser,
                        missions = await missionResource.GetMissionByUserId(loginRequestVm.userId)
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

        [HttpPost("token-l2")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetL2Token([FromBody] LoginRequestVm loginRequestVm)
        {
            try
            {

                if (loginRequestVm.password == "123")
                {
                    var claims = new List<Claim>()
                    {
                        new Claim(JwtRegisteredClaimNames.UniqueName, loginRequestVm.userId),
                        new Claim(ClaimTypes.Name, "admin-l2"),
                        new Claim(ClaimTypes.Role, "admin-l2")
                    };
                    var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ng22-1234567890123456789"));
                    var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var expire = DateTime.Now.AddMinutes(Config.L2TokenExpireMinute);
                    var token = new JwtSecurityToken(
                                        issuer: "Ng22",
                                        audience: "L2",
                                        claims: claims,
                                        expires: expire,
                                        signingCredentials: credential);
                    return Ok(new LoginResultL2Vm()
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        missionDetails = await missionResource.GetMissionDetails(loginRequestVm.missionUid)
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
    }
}
