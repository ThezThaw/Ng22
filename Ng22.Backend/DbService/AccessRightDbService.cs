using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    public class AccessRightDbService : BaseDbService, IAccessRightDbService
    {
        public AccessRightDbService(Ng22DbContext ctx) : base(ctx) { }
        public async Task<List<PageDm>> GetAvailablePageByUser(string userId)
        {
            var user = await ctx.AppUserTbl.Where(x => x.userId == userId && x.alive).FirstOrDefaultAsync();

            return await ctx.UserPageRelationTbl
                .Include(x => x.PageDm)
                .Include(x => x.AppUserDm)
                .Where(x => x.AppUserDm.uid == user.uid)
                .OrderBy(x => x.PageDm.SortOrder)
                .Select(x => new PageDm()
                {
                    Uid = x.PageDm.Uid,
                    PageCode = x.PageDm.PageCode,
                    MenuName = x.PageDm.MenuName,
                    Icon = x.PageDm.Icon,
                    Default = x.Default
                })                
                .ToListAsync();
        }

        public async Task<IQueryable<PageDm>> GetPage(Expression<Func<PageDm, bool>> predicate)
        {
            var query = ctx.PageTbl.Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task PageSetup(UserPageRelationDm dm)
        {
            ctx.UserPageRelationTbl.Add(dm);
            await ctx.SaveChangesAsync();
        }

        public async Task<bool> AddAccessRight(List<UserPageRelationDm> dm)
        {
            dm.ForEach(n => {
                var existing = ctx.UserPageRelationTbl
                        .Where(x => x.UserUid == n.UserUid)
                        .ToList();
                ctx.UserPageRelationTbl.RemoveRange(existing);
            });

            ctx.UserPageRelationTbl.AddRange(dm);
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<bool> RemoveAccessRight(Guid useruid)
        {
            var rel = await ctx.UserPageRelationTbl.Where(x => x.UserUid == useruid).ToListAsync();
            ctx.UserPageRelationTbl.RemoveRange(rel);
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<IQueryable<UserPageRelationDm>> GetExistingAccessRight(Expression<Func<UserPageRelationDm, bool>> predicate)
        {
            var query = ctx.UserPageRelationTbl
                .Include(x => x.PageDm)
                .Include(x => x.AppUserDm)
                .Where(predicate)
                .OrderBy(x => x.AppUserDm.userId)
                .AsNoTracking();
            return await Task.FromResult(query);
        }
    }

    public interface IAccessRightDbService
    {
        Task<List<PageDm>> GetAvailablePageByUser(string userId);
        Task PageSetup(UserPageRelationDm dm);
        Task<IQueryable<PageDm>> GetPage(Expression<Func<PageDm, bool>> predicate);
        Task<bool> AddAccessRight(List<UserPageRelationDm> dm);
        Task<bool> RemoveAccessRight(Guid useruid);
        Task<IQueryable<UserPageRelationDm>> GetExistingAccessRight(Expression<Func<UserPageRelationDm, bool>> predicate);
    }
}
