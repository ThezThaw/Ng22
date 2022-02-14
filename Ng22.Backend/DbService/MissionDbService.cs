using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    public class MissionDbService : BaseDbService, IMissionDbService
    {
        public MissionDbService(Ng22DbContext ctx) : base(ctx) { }

        public async Task AddMission(MissionDm dm)
        {
            ctx.MissionTbl.Add(dm);
            await ctx.SaveChangesAsync();
        }

        public async Task LinkMission(MissionUserRelationDm dm)
        {
            ctx.MissionUserRelationTbl.Add(dm);
            await ctx.SaveChangesAsync();
        }

        public async Task<IQueryable<MissionDm>> GetMission(Expression<Func<MissionDm, bool>> predicate)
        {
            var query = ctx.MissionTbl.Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<MissionUserRelationDm>> GetMissionByUser(Expression<Func<MissionUserRelationDm, bool>> predicate)
        {
            var query = ctx.MissionUserRelationTbl.Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<MissionDetailsDm>> GetMissionDetails(Expression<Func<MissionDetailsDm, bool>> predicate)
        {
            var query = ctx.MissionTbl
                .Select(x => x.missionDetails.FirstOrDefault())
                .Where(predicate);
            return await Task.FromResult(query);
        }
    }

    public interface IMissionDbService
    {
        Task AddMission(MissionDm dm);
        Task LinkMission(MissionUserRelationDm dm);
        Task<IQueryable<MissionDm>> GetMission(Expression<Func<MissionDm, bool>> predicate);
        Task<IQueryable<MissionDetailsDm>> GetMissionDetails(Expression<Func<MissionDetailsDm, bool>> predicate);
        Task<IQueryable<MissionUserRelationDm>> GetMissionByUser(Expression<Func<MissionUserRelationDm, bool>> predicate);
    }
}
