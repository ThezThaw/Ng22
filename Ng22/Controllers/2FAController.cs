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
    public class TwoFAController : BaseController
    {
        private readonly ITwoFAResource twoFAResource;
        public TwoFAController(ITwoFAResource twoFAResource)
        {
            this.twoFAResource = twoFAResource;
        }

        [HttpGet("Get2FAExpiry")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> Get2FAExpiry()
        {
            return Ok(await twoFAResource.Get2FAExpiry());
        }

        [HttpPost("Add2FA")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> Add2FA(TwoFADm dm)
        {
            return Ok(await twoFAResource.Add2FA(dm));
        }

        [HttpGet("Get2FA")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> Get2FA()
        {
            return Ok(await twoFAResource.Get2FA());
        }

        [HttpPost("Remove2FA")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> Remove2FA([FromBody]TwoFADm dm)
        {
            return Ok(await twoFAResource.Remove2FA(dm));
        }

        [HttpPost("AddExpiryConfig")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddExpiryConfig(ExpiryConfigDm dm)
        {
            return Ok(await twoFAResource.AddExpiryConfig(dm));
        }

        [HttpPost("RemoveExpiryConfig/{uid}")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> RemoveExpiryConfig(Guid uid)
        {
            return Ok(await twoFAResource.RemoveExpiryConfig(uid));
        }
    }
}
