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
    public class MissionController : BaseController
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
        public async Task<IActionResult> SearchMission(string filter, bool excludeAssigned)
        {
            return Ok(await missionResource.SearchMission(filter, excludeAssigned));
        }

        [HttpPost("AssignMission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AssignMission(List<MissionUserRelationDm> dm)
        {   
            return Ok(await missionResource.AssignMission(dm, GetCurrentUserId()));
        }

        [HttpPost("UnAssignAllUser/{missionUid}")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> UnAssignAllUser(Guid missionUid)
        {
            return Ok(await missionResource.UnAssignAllUser(missionUid));
        }

        [HttpGet("l2/GetMissionDetails")]//for user
        [Authorize(AuthenticationSchemes = "L2")]
        public async Task<IActionResult> GetMissionDetails(Guid missionUid)
        {
            var md = await missionDbService.GetMissionDetails(x => x.MissionUid == missionUid);
            return Ok(await md.ToListAsync());
        }

        [HttpGet("GetMissionDetails")]//for user
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetMissionDetails(Guid missionUid, Guid? missionDetailsUid)
        {
            var md = await missionDbService.GetMissionDetails(x => x.MissionUid == missionUid 
                            && (missionDetailsUid.HasValue ? x.Uid == missionDetailsUid : true));
            return Ok(await md.ToListAsync());
        }

        [HttpPost("AddUpdateMission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddUpdateMission([FromBody] MissionDm dm)
        {
            dm.UpdatedBy = GetCurrentUserId();
            return Ok(await missionResource.AddUpdateMission(dm));
        }

        [HttpPost("AddUpdateMissionDetails")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> AddUpdateMissionDetails([FromBody] MissionDetailsDm dm)
        {
            dm.MissionDm = new MissionDm()
            { 
                uid = dm.MissionUid,
                UpdatedBy = GetCurrentUserId()
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
                UpdatedBy = GetCurrentUserId()
            };
            return Ok(await missionResource.DeleteMissionDetails(dm));
        }

        [HttpGet("GetAssignedMission")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetAssignedMission(Guid? missionUid)
        {
            return Ok(await missionResource.GetAssignedMission(missionUid));
        }

        
    }
}
