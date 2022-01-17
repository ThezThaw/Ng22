using System;

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
    }
}
