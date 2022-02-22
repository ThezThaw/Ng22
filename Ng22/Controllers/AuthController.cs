using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Ng22.Backend;
using Ng22.Backend.Resource;
using Ng22.Helper;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IMissionResource missionResource;
        private readonly IAppUserResource appUserResource;
        private readonly ITwoFAResource twoFAResource;
        private readonly ITwoFADbService twoFADbService;
        public AuthController(IMissionResource missionResource, IAppUserResource appUserResource, ITwoFAResource twoFAResource, ITwoFADbService twoFADbService)
        {
            this.missionResource = missionResource;
            this.appUserResource = appUserResource;
            this.twoFAResource = twoFAResource;
            this.twoFADbService = twoFADbService;
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
                        new Claim(ClaimTypes.Name, string.IsNullOrEmpty(VerifiedUser.nickName) ? VerifiedUser.userId : VerifiedUser.nickName)
                    };
                    var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ng22-1234567890123456789"));
                    var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    //var expire = DateTime.UtcNow.NowByTimezone(Config.Timezone).AddMinutes(Config.L1TokenExpireMinute);
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
                var twoFA = await twoFAResource.Get2FA(loginRequestVm.password);
                var Valid2FA = twoFA.FirstOrDefault();
                if (Valid2FA != null && Valid2FA.Expire >= DateTime.UtcNow.NowByTimezone(Config.Timezone))
                {
                    Valid2FA.LastUsedBy = GetCurrentUserId();
                    await twoFADbService.AddUpdate2FA(Valid2FA);

                    var claims = new List<Claim>()
                    {
                        new Claim(JwtRegisteredClaimNames.UniqueName, loginRequestVm.userId),
                        new Claim(ClaimTypes.Name, GetCurrentUserId())
                    };
                    var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ng22-1234567890123456789"));
                    var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var diff = Valid2FA.Expire - DateTime.UtcNow.NowByTimezone(Config.Timezone);
                    var expire = DateTime.Now.AddTicks(diff.Ticks);
                    var token = new JwtSecurityToken(
                                        issuer: "Ng22",
                                        audience: "L2",
                                        claims: claims,
                                        expires: expire,
                                        signingCredentials: credential);

                    var r = new StatusResult<LoginResultL2Vm>() 
                    { 
                        status = true,
                        data = new LoginResultL2Vm()
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            missionDetails = await missionResource.GetMissionDetails(loginRequestVm.missionUid)
                        }
                    };
                    return Ok(r);
                }
                else
                {
                    return Ok(new StatusResult<LoginResultL2Vm>()
                    { 
                        status = false,
                        message = new List<string>() { "ACCESS DENIED !" }
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
