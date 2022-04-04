using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ng22.Backend;
using Ng22.Backend.Resource;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppUserController : BaseController
    {
        private readonly IAppUserResource appUserResource;
        private readonly IUserDbService userDbService;
        public AppUserController(IAppUserResource appUserResource, IUserDbService userDbService)
        {
            this.appUserResource = appUserResource;
            this.userDbService = userDbService;
        }

        [HttpGet("GetLoggedInUser")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetLoggedInUser()
        {
            return Ok(new AppUserVm
            {
                userId = User.FindFirst(ClaimTypes.Name)?.Value,
                nickName = "admin"
            });
        }

        [HttpGet("GetUser/{userId}")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetUser(string userId)
        {
            return Ok(new AppUserVm
            {
                userId = User.FindFirst(ClaimTypes.Name)?.Value,
                nickName = "admin"
            });
        }

        [HttpGet("GetUserList")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetUserList(string filter, bool excludeAr, bool onlySubscriber)
        {
            return Ok(await appUserResource.GetUserList(filter, excludeAr, onlySubscriber));
        }

        [HttpPost("AddUser")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddUser([FromBody] AppUserVm vm)
        {
            return Ok(await appUserResource.AddUser(vm));
        }

        [HttpPost("UpdateUser")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> UpdateUser([FromBody] AppUserVm vm)
        {
            return Ok(await appUserResource.UpdateUser(vm));
        }
    }
}
