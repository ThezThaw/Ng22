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
    public class IPFilterDbService : BaseDbService, IIPFilterDbService
    {
        public IPFilterDbService(Ng22DbContext ctx) : base(ctx) { }

        public async Task<IQueryable<IpBlackListDm>> GetIpBlackList(Expression<Func<IpBlackListDm, bool>> predicate)
        {
            var query = ctx.IpBlackListTbl
                .Select(x => new IpBlackListDm() 
                { 
                    Uid = x.Uid,
                    StartIPAddress = x.StartIPAddress,
                    StartIPNumber = x.StartIPNumber,
                    EndIPAddress = x.EndIPAddress ?? x.StartIPAddress,
                    EndIPNumber = x.EndIPNumber ?? x.StartIPNumber
                })
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }
    }

    public interface IIPFilterDbService
    {
        Task<IQueryable<IpBlackListDm>> GetIpBlackList(Expression<Func<IpBlackListDm, bool>> predicate);
    }
}
