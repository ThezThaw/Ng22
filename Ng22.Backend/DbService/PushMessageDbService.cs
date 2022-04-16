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
    public class PushMessageDbService : BaseDbService, IPushMessageDbService
    {
        public PushMessageDbService(Ng22DbContext ctx) : base(ctx) { }

        public async Task<bool> ClientRegistration(SubscriberInfoDm dm)
        {
            var isExists = ctx.AppSubscriberTbl.Where(x => x.UserUid == dm.UserUid &&
                                    x.endpoint == dm.endpoint &&
                                    x.key == dm.key &&
                                    x.auth == dm.auth).Any();

            if (!isExists)
            {
                ctx.AppSubscriberTbl.Add(dm);
                return ((await ctx.SaveChangesAsync()) > 0);
            }
            return true;
        }

        public async Task<IQueryable<SubscriberInfoDm>> GetSubscriber(Expression<Func<SubscriberInfoDm, bool>> predicate)
        {
            var query = ctx.AppSubscriberTbl
                .Include(x => x.AppUser)
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<bool> SentMessage(SentMessageDm dm)
        {
            ctx.SentMessageTbl.Add(dm);
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<bool> DeleteMessage(List<Guid> msgUids)
        {
            var msgs = await ctx.SentMessageTbl
                            .Where(x => msgUids.Contains(x.Uid))
                            .Include(x => x.SentTo)
                            .ToListAsync();
            ctx.SentMessageTbl.RemoveRange(msgs);
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<IQueryable<SentMessageDm>> GetSentMessage(Expression<Func<SentMessageDm, bool>> predicate)
        {
            var query = ctx.SentMessageTbl
                .Include(x => x.SentTo).ThenInclude(x => x.Subscriber).ThenInclude(x => x.AppUser)
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<SentMessageSubscriberRelationDm>> GetSentMessageByUserId(Expression<Func<SentMessageSubscriberRelationDm, bool>> predicate)
        {
            var query = ctx.SentMessageSubscriberRelationTbl                
                .Include(x => x.SentMessage)
                .Include(x => x.Subscriber).ThenInclude(x => x.AppUser)
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<bool> SoftDeleteSubscriber(List<Guid> msgUids, string userId)
        {
            var existing = await ctx.SentMessageSubscriberRelationTbl                            
                            .Where(x => msgUids.Contains(x.MessageUid) && x.Subscriber.AppUser.userId == userId)
                            .ToListAsync();
            existing.ForEach(x => {
                x.softdeleted = true;
                x.deletedby = userId;
                x.deletedon = DateTime.UtcNow.NowByTimezone(Config.Timezone);
            });
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<bool> SoftDeleteMessage(List<Guid> msgUids, string userId)
        {
            var existing = await ctx.SentMessageTbl
                            .Where(x => msgUids.Contains(x.Uid))
                            .ToListAsync();
            existing.ForEach(x => {
                x.softdeleted = true;
                x.deletedby = userId;
                x.deletedon = DateTime.UtcNow.NowByTimezone(Config.Timezone);
            });
            return ((await ctx.SaveChangesAsync()) > 0);
        }
    }

    public interface IPushMessageDbService
    {
        Task<bool> ClientRegistration(SubscriberInfoDm dm);
        Task<bool> SentMessage(SentMessageDm dm);
        Task<bool> DeleteMessage(List<Guid> msgUids);
        Task<bool> SoftDeleteSubscriber(List<Guid> msgUids, string userId);
        Task<bool> SoftDeleteMessage(List<Guid> msgUids, string userId);
        Task<IQueryable<SubscriberInfoDm>> GetSubscriber(Expression<Func<SubscriberInfoDm, bool>> predicate);
        Task<IQueryable<SentMessageDm>> GetSentMessage(Expression<Func<SentMessageDm, bool>> predicate);
        Task<IQueryable<SentMessageSubscriberRelationDm>> GetSentMessageByUserId(Expression<Func<SentMessageSubscriberRelationDm, bool>> predicate);
    }
}
