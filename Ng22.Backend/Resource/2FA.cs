using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ng22.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Backend.Resource
{
    public class TwoFAResource: BaseResource, ITwoFAResource
    {
        const string DefaultExpiryUid = "11111111-1111-1111-1111-111111111111";
        const ushort DefaultDuration = 30;
        const string DefaultExpireUnit = "M";
        private readonly ITwoFADbService twoFaDbService;
        public TwoFAResource(ITwoFADbService twoFaDbService, IMapper mapper) : base(mapper)
        {
            this.twoFaDbService = twoFaDbService;
        }

        public async Task<StatusResult<bool>> Add2FA(TwoFADm dm)
        {
            try
            {
                var existing = await twoFaDbService.Get2FA(x => x.Passcode.ToUpper() == dm.Passcode.ToUpper());
                if (await existing.AnyAsync())
                {
                    return new StatusResult<bool>()
                    {
                        status = false,
                        message = new List<string>() { "Already Exists !" }
                    };
                }


                if (dm.ExpireUid == Guid.Parse(DefaultExpiryUid))
                {
                    dm.Expire = DateTime.UtcNow.NowByTimezone(Config.Timezone).AddMinutes(DefaultDuration);
                }
                else
                {
                    var q = await twoFaDbService.Get2FAExpiry(x => x.Uid == dm.ExpireUid);
                    var e = await q.FirstOrDefaultAsync();
                    
                    if (e.Unit == "M")
                    {
                        dm.Expire = DateTime.UtcNow.NowByTimezone(Config.Timezone).AddMinutes(e.Duration);
                    }
                    else if (e.Unit == "H")
                    {
                        dm.Expire = DateTime.UtcNow.NowByTimezone(Config.Timezone).AddHours(e.Duration);
                    }
                    else if (e.Unit == "D")
                    {
                        dm.Expire = DateTime.UtcNow.NowByTimezone(Config.Timezone).AddDays(e.Duration);
                    }
                }
                var result = await twoFaDbService.AddUpdate2FA(dm);
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
        public async Task<ICollection<TwoFADm>> Get2FA(string passcode = null)
        {
            //put logic to show 10 expire passcode
            var lst = await twoFaDbService.Get2FA(x => string.IsNullOrEmpty(passcode) ? true : x.Passcode == passcode && x.Expire >= DateTime.UtcNow.NowByTimezone(Config.Timezone));
            return await lst.ToListAsync();
        }

        public async Task<List<ExpiryConfigDm>> Get2FAExpiry()
        {
            var lst = new List<ExpiryConfigDm>()
            { 
                new ExpiryConfigDm()
                { 
                    Uid = Guid.Parse(DefaultExpiryUid),
                    Duration = DefaultDuration,
                    Unit = DefaultExpireUnit
                }
            };
            lst.AddRange(await twoFaDbService.Get2FAExpiry(x => true));
            return lst;
        }

        public async Task<StatusResult<bool>> Remove2FA(TwoFADm dm)
        {
            try
            {
                var result = await twoFaDbService.HardDelete2FA(dm);
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

        public async Task<StatusResult<ExpiryConfigDm>> AddExpiryConfig(ExpiryConfigDm dm)
        {
            try
            {
                var existing = await twoFaDbService.Get2FAExpiry(x => x.Duration == dm.Duration && x.Unit == dm.Unit);
                if (existing.Any() || (dm.Duration == DefaultDuration && dm.Unit == DefaultExpireUnit))
                {
                    return new StatusResult<ExpiryConfigDm>()
                    {
                        status = false,
                        message = new List<string>() { "Already Exists !" }
                    };
                }
                var result = await twoFaDbService.AddExpiryConfig(dm);
                return new StatusResult<ExpiryConfigDm>()
                {
                    status = result != null,
                    data = result
                };
            }
            catch (Exception ex)
            {
                return new StatusResult<ExpiryConfigDm>()
                {
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }
        }
        public async Task<StatusResult<bool>> RemoveExpiryConfig(Guid uid)
        {
            try
            {
                var result = await twoFaDbService.HardDeleteExpiryConfig(uid);
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
    }

    public interface ITwoFAResource
    {
        Task<List<ExpiryConfigDm>> Get2FAExpiry();
        Task<StatusResult<bool>> Add2FA(TwoFADm dm);
        Task<StatusResult<bool>> Remove2FA(TwoFADm dm);
        Task<ICollection<TwoFADm>> Get2FA(string passcode = null);
        Task<StatusResult<ExpiryConfigDm>> AddExpiryConfig(ExpiryConfigDm dm);
        Task<StatusResult<bool>> RemoveExpiryConfig(Guid uid);
    }
}
