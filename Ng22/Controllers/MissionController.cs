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

        [HttpGet("l2/GetMissionDetails")]//for user
        [Authorize(AuthenticationSchemes = "L2")]
        public async Task<IActionResult> GetMissionDetails(Guid missionUid)
        {
            var md = await missionDbService.GetMissionDetails(x => x.MissionUid == missionUid);
            return Ok(md.FirstOrDefault());
        }

        [HttpGet("GetMissionDetails")]//for user
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetMissionDetails(Guid missionUid, Guid? missionDetailsUid)
        {
            var md = await missionDbService.GetMissionDetails(x => x.MissionUid == missionUid 
                            && (missionDetailsUid.HasValue ? x.Uid == missionDetailsUid : true));
            return Ok(await md.ToListAsync());
        }

        //[HttpPost("AddMission")]
        //[Authorize(AuthenticationSchemes = "L1")]
        //public async Task<IActionResult> AddMission([FromBody]MissionDm dm)
        //{
        //    await missionDbService.AddMission(dm);
        //    return Ok();
        //}

        [HttpPost("AddUpdateMission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddUpdateMission([FromBody] MissionDm dm)
        {
            dm.UpdatedBy = User.FindFirst(ClaimTypes.Name)?.Value;
            return Ok(await missionResource.AddUpdateMission(dm));
        }

        [HttpPost("AddUpdateMissionDetails")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddUpdateMissionDetails([FromBody] MissionDetailsDm dm)
        {
            dm.MissionDm = new MissionDm()
            { 
                uid = dm.MissionUid,
                UpdatedBy = User.FindFirst(ClaimTypes.Name)?.Value
            };
            return Ok(await missionResource.AddUpdateMissionDetails(dm));
        }

        [HttpPost("DeleteMissionDetails")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> DeleteMissionDetails([FromBody] MissionDetailsDm dm)
        {
            dm.MissionDm = new MissionDm()
            {
                uid = dm.MissionUid,
                UpdatedBy = User.FindFirst(ClaimTypes.Name)?.Value
            };
            return Ok(await missionResource.DeleteMissionDetails(dm));
        }
    }
}
