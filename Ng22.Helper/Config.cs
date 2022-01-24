using Microsoft.Extensions.Configuration;
using System;

namespace Ng22.Helper
{
    public static class Config
    {
        public static void LoadConfig(IConfiguration cfg)
        {
            var AppConfig = cfg.GetSection("Config");
            L1TokenExpireMinute = Convert.ToDouble(AppConfig["L1TokenExpireMinute"]);
            L2TokenExpireMinute = Convert.ToDouble(AppConfig["L2TokenExpireMinute"]);
        }

        public static Double L1TokenExpireMinute { get; set; }
        public static Double L2TokenExpireMinute { get; set; }
    }
}
