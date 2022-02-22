using Microsoft.EntityFrameworkCore;
using Ng22.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    public class TwoFADbService : BaseDbService, ITwoFADbService
    {
        public TwoFADbService(Ng22DbContext ctx) : base(ctx) { }

        public async Task<IQueryable<ExpiryConfigDm>> Get2FAExpiry(Expression<Func<ExpiryConfigDm, bool>> predicate)
        {
            var query = ctx.ExpiryConfigTbl
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<bool> AddUpdate2FA(TwoFADm dm)
        {
            var existing = await ctx.TwoFATbl.Where(x => x.Uid == dm.Uid).FirstOrDefaultAsync();
            if (existing == null)
            {
                ctx.TwoFATbl.Add(dm);
            }
            else
            {
                existing.LastUsedBy = dm.LastUsedBy;
                existing.LastUsedOn = DateTime.UtcNow.NowByTimezone();
            }
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<IQueryable<TwoFADm>> Get2FA(Expression<Func<TwoFADm, bool>> predicate)
        {
            var query = ctx.TwoFATbl
                .Where(predicate)
                .OrderByDescending(x => x.Expire)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<bool> HardDelete2FA(TwoFADm dm)
        {
            if (dm.Uid == Guid.Empty)//remove all expired record
            {
                var all = await ctx.TwoFATbl.Where(x => x.Expire < DateTime.UtcNow.NowByTimezone(Config.Timezone)).ToListAsync();
                ctx.TwoFATbl.RemoveRange(all);
            }
            else
            {
                ctx.TwoFATbl.Remove(dm);
            }            
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<ExpiryConfigDm> AddExpiryConfig(ExpiryConfigDm dm)
        {
            ctx.ExpiryConfigTbl.Add(dm);
            if ((await ctx.SaveChangesAsync()) > 0) return dm;
            return null;
        }

        public async Task<bool> HardDeleteExpiryConfig(Guid uid)
        {
            var dm = await ctx.ExpiryConfigTbl.Where(x => x.Uid == uid).FirstOrDefaultAsync();
            if (dm != null)
            {
                ctx.ExpiryConfigTbl.Remove(dm);
            }
            return ((await ctx.SaveChangesAsync()) > 0);
        }
    }

    public interface ITwoFADbService
    {
        Task<IQueryable<ExpiryConfigDm>> Get2FAExpiry(Expression<Func<ExpiryConfigDm, bool>> predicate);
        Task<bool> AddUpdate2FA(TwoFADm dm);
        Task<bool> HardDelete2FA(TwoFADm dm);
        Task<IQueryable<TwoFADm>> Get2FA(Expression<Func<TwoFADm, bool>> predicate);
        Task<ExpiryConfigDm> AddExpiryConfig(ExpiryConfigDm dm);
        Task<bool> HardDeleteExpiryConfig(Guid uid);
    }
}
