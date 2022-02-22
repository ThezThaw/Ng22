using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ng22.Backend;
using Ng22.Backend.Resource;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessRightController : BaseController
    {
        private readonly IAccessRightResource arResource;
        private readonly IAccessRightDbService arDbService;
        public AccessRightController(IAccessRightResource arResource, IAccessRightDbService arDbService)
        {
            this.arResource = arResource;
            this.arDbService = arDbService;
        }

        [HttpGet("GetAvailablePageByUser/{userId}")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetAvailablePageByUser(string userId)
        {
            return Ok(await arResource.GetAvailablePageByUser(userId));
        }

        [HttpGet("SearchPage")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> SearchPage(string filter)
        {
            var lst = await arDbService.GetPage(x => (string.IsNullOrEmpty(filter) ? true : (x.PageCode.Contains(filter) || x.MenuName.Contains(filter))) && !x.ExcludeAccessRight);
            return Ok(await lst.ToListAsync());
        }

        [HttpPost("PageSetup")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> PageSetup(UserPageRelationDm dm)
        {
            await arDbService.PageSetup(dm);
            return Ok();
        }

        [HttpPost("AddAccessRight")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddAccessRight(List<UserPageRelationDm> dm)
        {
            return Ok(await arResource.AddAccessRight(dm, GetCurrentUserId()));
        }

        [HttpPost("RemoveAccessRight/{useruid}")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> RemoveAccessRight(Guid useruid)
        {
            return Ok(await arResource.RemoveAccessRight(useruid));
        }

        [HttpGet("GetAccessRightList")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetAccessRightList(Guid? useruid)
        {
            return Ok(await arResource.GetAccessRightList(useruid));
        }
    }
}
