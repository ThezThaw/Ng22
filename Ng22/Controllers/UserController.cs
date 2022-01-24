using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ng22.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("get-user")]
        [Authorize(AuthenticationSchemes = "L1")]
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
