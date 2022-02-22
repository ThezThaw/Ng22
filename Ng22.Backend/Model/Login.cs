using System;
using System.Collections.Generic;

namespace Ng22.Backend
{
    public class LoginRequestVm
    {
        public string userId { get; set; }
        public string password { get; set; }
        public Guid missionUid { get; set; }
    }

    public class LoginResultVm
    {
        public string token { get; set; }
        public AppUserVm appUser { get; set; }
        public List<MissionVm> missions { get; set; }

    }

    public class LoginResultL2Vm
    {
        public string token { get; set; }
        public List<MissionDetailsDm> missionDetails { get; set; }
    }
}
