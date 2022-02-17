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

        public async Task<List<PageDm>> GetAvailablePageByUser(string userId)
        {
            return await ctx.UserPageRelationTbl
                .Include(x => x.PageDm)
                .Include(x => x.AppUserDm)
                .Where(x => x.AppUserDm.userId == userId)
                .Select(x => x.PageDm)
                .ToListAsync();
        }

        public async Task<IQueryable<PageDm>> GetPage(Expression<Func<PageDm, bool>> predicate)
        {
            var query = ctx.PageTbl.Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task<AppUserDm> GetUser(string userId)
        {
            return await ctx.AppUserTbl
                        .Where(x => x.userId == userId && x.alive)
                        .FirstOrDefaultAsync();
        }

        public async Task<IQueryable<AppUserDm>> GetUserList(Expression<Func<AppUserDm, bool>> predicate)
        {
            var query = ctx.AppUserTbl.Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task PageSetup(UserPageRelationDm dm)
        {
            ctx.UserPageRelationTbl.Add(dm);
            await ctx.SaveChangesAsync();
        }
    }

    public interface IUserDbService
    {
        Task<List<PageDm>> GetAvailablePageByUser(string userId);
        Task<IQueryable<AppUserDm>> GetUserList(Expression<Func<AppUserDm, bool>> predicate);
        Task<AppUserDm> GetUser(string userId);
        Task AddUser(AppUserDm dm);
        Task UpdateUser(AppUserDm dm);
        Task PageSetup(UserPageRelationDm dm);
        Task<IQueryable<PageDm>> GetPage(Expression<Func<PageDm, bool>> predicate);
    }
}
