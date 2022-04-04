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
            ctx.AppSubscriberTbl.Add(dm);
            return ((await ctx.SaveChangesAsync()) > 0);
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

        public async Task<bool> DeleteMessage(bool removeAll, SentMessageDm dm = null)
        {
            if (removeAll)
            {
                var lst = ctx.SentMessageTbl
                    .Include(x => x.SentTo)
                    .Where(x => true);
                ctx.SentMessageTbl.RemoveRange(lst.ToList());
            }
            else
            {
                ctx.SentMessageTbl.Remove(dm);
            }
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<IQueryable<SentMessageDm>> GetSentMessage(Expression<Func<SentMessageDm, bool>> predicate)
        {
            var query = ctx.SentMessageTbl
                .Include(x => x.SentTo).ThenInclude(x => x.AppUser)
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<SentMessageUserRelationDm>> GetSentMessageByUserId(Expression<Func<SentMessageUserRelationDm, bool>> predicate)
        {
            var query = ctx.SentMessageUserRelationTbl                
                .Include(x => x.SentMessage)
                .Include(x => x.AppUser)
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }
    }

    public interface IPushMessageDbService
    {
        Task<bool> ClientRegistration(SubscriberInfoDm dm);
        Task<bool> SentMessage(SentMessageDm dm);
        Task<bool> DeleteMessage(bool removeAll, SentMessageDm dm = null);
        Task<IQueryable<SubscriberInfoDm>> GetSubscriber(Expression<Func<SubscriberInfoDm, bool>> predicate);
        Task<IQueryable<SentMessageDm>> GetSentMessage(Expression<Func<SentMessageDm, bool>> predicate);
        Task<IQueryable<SentMessageUserRelationDm>> GetSentMessageByUserId(Expression<Func<SentMessageUserRelationDm, bool>> predicate);
    }
}
