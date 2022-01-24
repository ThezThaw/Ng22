using Ng22.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Resource
{
    public class MissionResource : IMissionResource
    {
        public async Task<List<Mission>> GetMission(string userId)
        {
            return new List<Mission>()
            {
                new Mission()
                { 
                    Id = Guid.NewGuid(),
                    Name = "Mission A"
                },
                new Mission()
                {
                    Id = Guid.NewGuid(),
                    Name = "Mission B"
                }
            };
        }

        public async Task<MissionDetails> GetMissionDetails(Guid missionUid)
        {
            return new MissionDetails()
            { 
                Id = Guid.NewGuid(),
                Instructions = "Instruction details ..."
            };
        }
    }

    public interface IMissionResource
    {
        public Task<List<Mission>> GetMission(string userId);

        public Task<MissionDetails> GetMissionDetails(Guid missionUid);
    }
}
