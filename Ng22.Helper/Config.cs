using Microsoft.Extensions.Configuration;
using System;

namespace Ng22.Helper
{
    public static class Config
    {
        public static void LoadConfig(IConfiguration cfg)
        {
            var AppConfig = cfg.GetSection("Config");
            TokenExpireMinute = Convert.ToDouble(AppConfig["TokenExpireMinute"]);
        }

        public static Double TokenExpireMinute { get; set; }
    }
}
