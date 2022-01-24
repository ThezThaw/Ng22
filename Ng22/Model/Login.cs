using System;
using System.Collections.Generic;

namespace Ng22.Model
{
    public class LoginRequestVm
    {
        public string userId { get; set; }
        public string password { get; set; }
    }

    public class LoginResultVm
    {
        public string token { get; set; }
        public UserInfoVm userInfo { get; set; }
        public List<Mission> missions { get; set; }

    }

    public class LoginResultL2Vm
    {
        public string token { get; set; }
        public MissionDetails missionDetails { get; set; }
    }
}
