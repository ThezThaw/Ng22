using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ng22.Helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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

        public async Task<List<MissionVm>> GetMissionByUserId(string userId)
        {
            var list = await missionDbService.GetMissionByUser(x => x.AppUserDm.userId == userId);
            var vm = mapper.Map<List<MissionVm>>(list.Select(x => x.MissionDm).ToListAsync().Result);
            return vm.OrderByDescending(x => x.UpdatedOn).ToList();
        }

        public async Task<List<MissionDetailsDm>> GetMissionDetails(Guid missionUid)
        {
            var lst = await missionDbService.GetMissionDetails(x => x.MissionUid == missionUid);
            return await lst.ToListAsync();
        }

        public async Task<List<MissionVm>> SearchMission(string filter, bool excludeAssigned)
        {
            var lst = await missionDbService.GetMission(x => 
                                (string.IsNullOrEmpty(filter) ? true : x.title.Contains(filter)) &&
                                (excludeAssigned ? !x.MissionUserRelationDm.Any() : true) &&
                                x.alive);

            var vm = mapper.Map<List<MissionVm>>(lst.ToListAsync().Result);
            return vm.OrderByDescending(x => x.UpdatedOn).ToList();
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

        public async Task<StatusResult<bool>> AssignMission(List<MissionUserRelationDm> dm, string userId)
        {
            try
            {
                Parallel.ForEach(dm, x => {
                    x.UpdatedOn = DateTime.UtcNow.NowByTimezone();
                    x.UpdatedBy = userId;
                });

                var result = await missionDbService.AssignMission(dm);
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

        public async Task<StatusResult<bool>> UnAssignAllUser(Guid missionUid)
        {
            try
            {
                var result = await missionDbService.UnAssignAllUser(missionUid);
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

        public async Task<List<AssignMissionVm>> GetAssignedMission(Guid? missionUid)
        {
            var all = await missionDbService.GetAssignedMission(x => (missionUid.HasValue ? x.MissionUid == missionUid : true) &&
                                x.AppUserDm.alive);

            var group = all.AsEnumerable().GroupBy(x => new  
            { 
                x.MissionDm.uid, 
                x.MissionDm.title,
                x.UpdatedBy,
                x.UpdatedOn
            }).ToList();

            var lst = new ConcurrentBag<AssignMissionVm>();
            Parallel.ForEach(group, g => {
                lst.Add(new AssignMissionVm 
                { 
                    MissionVm = new MissionVm()
                    { 
                        Uid = g.Key.uid,
                        Title = g.Key.title,
                        UpdatedBy = g.Key.UpdatedBy,
                        UpdatedOn = g.Key.UpdatedOn
                    },
                    AppUserVm = mapper.Map<AppUserVm[]>(g.Select(u => u.AppUserDm).ToArray()),
                    UpdatedOn = g.Key.UpdatedOn,
                    UpdatedBy = g.Key.UpdatedBy
                });
            });

            return lst.OrderByDescending(x => x.UpdatedOn).ToList();
        }
    }

    public interface IMissionResource
    {
        Task<List<MissionVm>> GetMissionByUserId(string userId);
        Task<List<MissionVm>> SearchMission(string filter, bool excludeAssigned);
        Task<List<MissionDetailsDm>> GetMissionDetails(Guid missionUid);
        Task<StatusResult<MissionDm>> AddUpdateMission(MissionDm dm);
        Task<StatusResult<MissionDetailsDm>> AddUpdateMissionDetails(MissionDetailsDm dm);
        Task<StatusResult<bool>> DeleteMissionDetails(MissionDetailsDm dm);
        Task<StatusResult<bool>> AssignMission(List<MissionUserRelationDm> dm, string userId);
        Task<StatusResult<bool>> UnAssignAllUser(Guid missionUid);
        Task<List<AssignMissionVm>> GetAssignedMission(Guid? missionUid);
    }
}
