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

        public async Task<StatusResult<MissionDetailsDm>> AddUpdateMissionDetails(MissionDetailsDm dm)
        {
            try
            {
                var resultDm = await missionDbService.AddUpdateMissionDetails(dm);
                return new StatusResult<MissionDetailsDm>()
                {
                    status = resultDm != null,
                    data = resultDm
                };
            }
            catch (Exception ex)
            {
                return new StatusResult<MissionDetailsDm>()
                {
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }
        }

        public async Task<StatusResult<MissionDm>> AddUpdateMission(MissionDm dm)
        {
            try
            {
                //check duplicate title
                var resultDm = await missionDbService.AddUpdateMission(dm);
                return new StatusResult<MissionDm>()
                {
                    status = resultDm != null,
                    data = resultDm
                };
            }
            catch (Exception ex)
            {
                return new StatusResult<MissionDm>()
                {
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }
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

        public async Task<List<MissionVm>> SearchMission(string filter)
        {
            var list = await missionDbService.GetMission(x => (string.IsNullOrEmpty(filter) ? true : x.title.Contains(filter)) && x.alive);
            var vm = mapper.Map<List<MissionVm>>(list.ToListAsync().Result);
            return vm;
        }

        public async Task<StatusResult<bool>> DeleteMissionDetails(MissionDetailsDm dm)
        {
            try
            {
                var result = await missionDbService.HardDeleteMissionDetails(dm);
                return new StatusResult<bool>()
                {
                    status = result,
                    data = result
                };
            }
            catch (Exception ex)
            {
                return new StatusResult<bool>()
                {
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }
        }
    }

    public interface IMissionResource
    {
        public Task<List<MissionDm>> GetMissionByUserId(string userId);
        public Task<List<MissionVm>> SearchMission(string filter);

        public Task<MissionDetailsDm> GetMissionDetails(Guid missionUid);
        Task<StatusResult<MissionDm>> AddUpdateMission(MissionDm dm);
        Task<StatusResult<MissionDetailsDm>> AddUpdateMissionDetails(MissionDetailsDm dm);
        Task<StatusResult<bool>> DeleteMissionDetails(MissionDetailsDm dm);
    }
}
