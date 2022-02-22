using Microsoft.Extensions.Configuration;
using System;

namespace Ng22.Helper
{
    public static class Config
    {
        public static void LoadConfig(IConfiguration cfg)
        {
            var AppConfig = cfg.GetSection("Config");
            DbName = AppConfig["DbName"];
            DbServer = AppConfig["DbServer"];
            DbPort = AppConfig["DbPort"];
            DbUser = AppConfig["DbUser"];
            DbPassword = AppConfig["DbPassword"];
            L1TokenExpireMinute = Convert.ToDouble(AppConfig["L1TokenExpireMinute"]);
            Timezone = AppConfig["Timezone"];
        }

        public static string DbName { get; set; }
        public static string DbServer { get; set; }
        public static string DbPort { get; set; }
        public static string DbUser { get; set; }
        public static string DbPassword { get; set; }        
        public static Double L1TokenExpireMinute { get; set; }
        public static string Timezone { get; set; }
    }
}
