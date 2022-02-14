using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Backend.Resource
{
    public class MissionResource : BaseResource, IMissionResource
    {
        private readonly IMissionDbService missionDbService;
        public MissionResource(IMissionDbService missionDbService, IMapper mapper) : base(mapper)
        {
            this.missionDbService = missionDbService;
        }
        public async Task<List<MissionDm>> GetMissionByUserId(string userId)
        {
            var list = await missionDbService.GetMissionByUser(x => x.AppUserDm.userId == userId);
            return await list.Select(x => x.MissionDm).ToListAsync();
        }

        public async Task<MissionDetailsDm> GetMissionDetails(Guid missionUid)
        {
            return null;
        }

        public async Task<List<MissionDm>> SearchMission(string filter)
        {
            var list = await missionDbService.GetMission(x => x.title.Contains(filter));
            return await list.ToListAsync();
        }
    }

    public interface IMissionResource
    {
        public Task<List<MissionDm>> GetMissionByUserId(string userId);
        public Task<List<MissionDm>> SearchMission(string filter);

        public Task<MissionDetailsDm> GetMissionDetails(Guid missionUid);
    }
}
