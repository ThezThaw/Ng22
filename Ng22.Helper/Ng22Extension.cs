using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Helper
{
    public static class Ng22Extension
    {
        public static DateTime NowByTimezone(this DateTime dt, string timezone = "Singapore Standard Time")
        {
            var sgtz = TimeZoneInfo.FindSystemTimeZoneById(timezone);            
            var ts = sgtz.GetUtcOffset(DateTime.UtcNow);
            return dt.Add(ts);
        }
    }
}
