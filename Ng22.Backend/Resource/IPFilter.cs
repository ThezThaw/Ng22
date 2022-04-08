using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ng22.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Backend.Resource
{
    public class IPFilterResource: BaseResource, IIPFilterResource
    {
        private readonly IIPFilterDbService ipFilterDbService;
        public IPFilterResource(IIPFilterDbService ipFilterDbService, IMapper mapper) : base(mapper)
        {
            this.ipFilterDbService = ipFilterDbService;
        }
        public async Task<bool> IsValid(string clientIP)
        {
            try
            {
                if (clientIP == "::1")
                {
                    return true;
                }
                //https://lite.ip2location.com/faq
                var ipSegment = clientIP.Split('.');
                var ipNumber = 16777216 * Convert.ToInt32(ipSegment[0]) +
                               65536 * Convert.ToInt32(ipSegment[1]) +
                               256 * Convert.ToInt32(ipSegment[2]) +
                               Convert.ToInt32(ipSegment[3]);

                var ipBlackList = await ipFilterDbService.GetIpBlackList(x => ipNumber >= x.StartIPNumber && ipNumber <= x.EndIPNumber);
                var allowed = !await ipBlackList.AnyAsync();
                return allowed;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }

    public interface IIPFilterResource
    {
        Task<bool> IsValid(string clientIP);
    }
}
