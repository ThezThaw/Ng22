using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ng22.Resource;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MissionController : ControllerBase
    {
        private readonly IMissionResource missionResource;
        public MissionController(IMissionResource missionResource)
        {
            this.missionResource = missionResource;
        }

        [HttpGet("get-mission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetMission()
        {
            return Ok(await missionResource.GetMission(string.Empty));
        }

        [HttpGet("l2/get-mission-details")]
        [Authorize(AuthenticationSchemes = "L2")]
        public async Task<IActionResult> GetMissionDetails()
        {
            return Ok(await missionResource.GetMissionDetails(Guid.Empty));
        }
    }
}
