using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    public class UserDbService : BaseDbService, IUserDbService
    {
        public UserDbService(Ng22DbContext ctx) : base(ctx) { }

        public async Task AddUser(AppUserDm dm)
        {
            ctx.AppUserTbl.Add(dm);
            await ctx.SaveChangesAsync();
        }

        public async Task UpdateUser(AppUserDm dm)
        {
            var existing = await ctx.AppUserTbl.Where(x => x.uid == dm.uid).FirstOrDefaultAsync();
            existing.nickName = dm.nickName;
            existing.alive = dm.alive;
            existing.password = dm.password == null ? existing.password : dm.password;
            await ctx.SaveChangesAsync();
        }

        

        public async Task<AppUserDm> GetUser(string userId)
        {
            return await ctx.AppUserTbl
                        .Where(x => x.userId == userId && x.alive)
                        .FirstOrDefaultAsync();
        }

        public async Task<IQueryable<AppUserDm>> GetUserList(Expression<Func<AppUserDm, bool>> predicate)
        {
            var query = ctx.AppUserTbl
                .Include(x => x.AccessRight)
                .Where(predicate)
                .OrderBy(x => x.userId)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<AppUserDm>> GetSubscriberUserList(Expression<Func<AppUserDm, bool>> predicate)
        {
            var query = ctx.AppSubscriberTbl
                .Select(x => x.AppUser)
                .Where(predicate)                
                .AsNoTracking();
            return await Task.FromResult(query);
        }
    }

    public interface IUserDbService
    {        
        Task<IQueryable<AppUserDm>> GetUserList(Expression<Func<AppUserDm, bool>> predicate);
        Task<IQueryable<AppUserDm>> GetSubscriberUserList(Expression<Func<AppUserDm, bool>> predicate);
        Task<AppUserDm> GetUser(string userId);
        Task AddUser(AppUserDm dm);
        Task UpdateUser(AppUserDm dm);        
    }
}
