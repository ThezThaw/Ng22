using Microsoft.EntityFrameworkCore;
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

        public async Task LinkMission(MissionUserRelationDm dm)
        {
            ctx.MissionUserRelationTbl.Add(dm);
            await ctx.SaveChangesAsync();
        }

        public async Task<IQueryable<MissionDm>> GetMission(Expression<Func<MissionDm, bool>> predicate)
        {
            var query = ctx.MissionTbl
                .Include(x => x.missionDetails)
                .AsNoTracking()
                .Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<MissionUserRelationDm>> GetMissionByUser(Expression<Func<MissionUserRelationDm, bool>> predicate)
        {
            var query = ctx.MissionUserRelationTbl.Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<MissionDetailsDm>> GetMissionDetails(Expression<Func<MissionDetailsDm, bool>> predicate)
        {
            var query = ctx.MissionDetailsTbl
                .Where(predicate);
            return await Task.FromResult(query);
        }

        public async Task<MissionDm> AddUpdateMission(MissionDm dm)
        {
            var existing = await ctx.MissionTbl.Where(x => x.uid == dm.uid).FirstOrDefaultAsync();
            if (existing == null)
            {
                dm.UpdatedDt = DateTime.Now;
                ctx.MissionTbl.Add(dm);                
            }
            else
            {
                existing.title = dm.title;
                existing.brief = dm.brief;
                existing.alive = dm.alive;
                existing.UpdatedBy = dm.UpdatedBy;
                existing.UpdatedDt = DateTime.Now;
            }

            if ((await ctx.SaveChangesAsync()) > 0) return dm;
            return null;
        }

        public async Task<MissionDetailsDm> AddUpdateMissionDetails(MissionDetailsDm dm)
        {
            var existing = await ctx.MissionDetailsTbl
                .Include(x => x.MissionDm)
                .Where(x => x.Uid == dm.Uid)
                .FirstOrDefaultAsync();

            dm.UpdatedDt = DateTime.Now;

            if (existing == null)
            {
                var m = await ctx.MissionTbl.Where(x => x.uid == dm.MissionUid).FirstOrDefaultAsync();
                m.UpdatedDt = DateTime.Now;
                m.UpdatedBy = dm.MissionDm.UpdatedBy;
                dm.MissionDm = null;
                ctx.MissionDetailsTbl.Add(dm);
            }
            else
            {
                existing.Instruction = dm.Instruction;
                existing.UpdatedDt = dm.UpdatedDt;
                existing.MissionDm.UpdatedDt = DateTime.Now;
                existing.MissionDm.UpdatedBy = dm.MissionDm.UpdatedBy;
            }

            if ((await ctx.SaveChangesAsync()) > 0) return dm;
            return null;

        }
        public async Task<bool> HardDeleteMissionDetails(MissionDetailsDm dm)
        {
            var m = await ctx.MissionTbl.Where(x => x.uid == dm.MissionUid).FirstOrDefaultAsync();
            m.UpdatedDt = DateTime.Now;
            m.UpdatedBy = dm.MissionDm.UpdatedBy;
            dm.MissionDm = null;
            ctx.MissionDetailsTbl.Remove(dm);
            return ((await ctx.SaveChangesAsync()) > 0);
        }
    }

    public interface IMissionDbService
    {
        Task<MissionDm> AddUpdateMission(MissionDm dm);
        Task<MissionDetailsDm> AddUpdateMissionDetails(MissionDetailsDm dm);
        Task<bool> HardDeleteMissionDetails(MissionDetailsDm dm);
        Task LinkMission(MissionUserRelationDm dm);
        Task<IQueryable<MissionDm>> GetMission(Expression<Func<MissionDm, bool>> predicate);
        Task<IQueryable<MissionDetailsDm>> GetMissionDetails(Expression<Func<MissionDetailsDm, bool>> predicate);
        Task<IQueryable<MissionUserRelationDm>> GetMissionByUser(Expression<Func<MissionUserRelationDm, bool>> predicate);
    }
}
