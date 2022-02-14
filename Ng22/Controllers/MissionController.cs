using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class MissionController : ControllerBase
    {
        private readonly IMissionResource missionResource;
        private readonly IMissionDbService missionDbService;

        public MissionController(IMissionResource missionResource, IMissionDbService missionDbService)
        {
            this.missionResource = missionResource;
            this.missionDbService = missionDbService;
        }

        [HttpGet("GetMissionByUser")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetMissionByUser(string userId)
        {
            return Ok(await missionResource.GetMissionByUserId(userId));
        }

        [HttpGet("SearchMission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> SearchMission(string filter)
        {
            return Ok(await missionResource.SearchMission(filter));
        }

        [HttpPost("LinkMission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> LinkMission(MissionUserRelationDm dm)
        {
            await missionDbService.LinkMission(dm);
            return Ok();
        }

        [HttpGet("l2/GetMissionDetails")]
        [Authorize(AuthenticationSchemes = "L2")]
        public async Task<IActionResult> GetMissionDetails(Guid missionUid)
        {
            var md = await missionDbService.GetMissionDetails(x => x.MissionUid == missionUid);
            return Ok(md.FirstOrDefault());
        }

        [HttpPost("AddMission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddMission([FromBody]MissionDm dm)
        {
            await missionDbService.AddMission(dm);
            return Ok();
        }
    }
}
