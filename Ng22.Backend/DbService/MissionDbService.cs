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
    public class MissionDbService : BaseDbService, IMissionDbService
    {
        public MissionDbService(Ng22DbContext ctx) : base(ctx) { }

        public async Task<bool> AssignMission(List<MissionUserRelationDm> dm)
        {
            dm.Select(x => x.MissionUid).Distinct().ToList().ForEach(x => {
                var mission = ctx.MissionTbl.Where(m => m.uid == x).FirstOrDefaultAsync().Result;
                mission.IsAssigned = true;
            });

            dm.ForEach(n => {
                var existing = ctx.MissionUserRelationTbl
                        .Where(x => x.MissionUid == n.MissionUid)
                        .ToList();
                ctx.MissionUserRelationTbl.RemoveRange(existing);
            });

            ctx.MissionUserRelationTbl.AddRange(dm);
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<IQueryable<MissionDm>> GetMission(Expression<Func<MissionDm, bool>> predicate)
        {
            var query = ctx.MissionTbl
                .Include(x => x.missionDetails)     
                .Include(x => x.MissionUserRelationDm).ThenInclude(x => x.AppUserDm)          
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<IQueryable<MissionUserRelationDm>> GetMissionByUser(Expression<Func<MissionUserRelationDm, bool>> predicate)
        {
            var query = ctx.MissionUserRelationTbl
                .Include(x => x.MissionDm).ThenInclude(x => x.missionDetails)
                .Where(predicate)
                .AsNoTracking();
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
            var existing = await ctx.MissionTbl
                .Include(x => x.MissionUserRelationDm)
                .Where(x => x.uid == dm.uid).FirstOrDefaultAsync();
            if (existing == null)
            {
                dm.UpdatedOn = DateTime.UtcNow.NowByTimezone();
                ctx.MissionTbl.Add(dm);                
            }
            else
            {
                existing.title = dm.title;
                existing.brief = dm.brief;
                existing.alive = dm.alive;
                existing.UpdatedBy = dm.UpdatedBy;
                existing.UpdatedOn = DateTime.UtcNow.NowByTimezone();
                if (!dm.alive)
                {
                    ctx.MissionUserRelationTbl.RemoveRange(existing.MissionUserRelationDm);
                }
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

            dm.UpdatedOn = DateTime.UtcNow.NowByTimezone();

            if (existing == null)
            {
                var m = await ctx.MissionTbl.Where(x => x.uid == dm.MissionUid).FirstOrDefaultAsync();
                m.UpdatedOn = DateTime.UtcNow.NowByTimezone();
                m.UpdatedBy = dm.MissionDm.UpdatedBy;
                dm.MissionDm = null;
                ctx.MissionDetailsTbl.Add(dm);
            }
            else
            {
                existing.Instruction = dm.Instruction;
                existing.UpdatedOn = dm.UpdatedOn;
                existing.MissionDm.UpdatedOn = DateTime.UtcNow.NowByTimezone();
                existing.MissionDm.UpdatedBy = dm.MissionDm.UpdatedBy;
            }

            if ((await ctx.SaveChangesAsync()) > 0) return dm;
            return null;

        }
        public async Task<bool> HardDeleteMissionDetails(MissionDetailsDm dm)
        {
            var m = await ctx.MissionTbl.Where(x => x.uid == dm.MissionUid).FirstOrDefaultAsync();
            m.UpdatedOn = DateTime.UtcNow.NowByTimezone();
            m.UpdatedBy = dm.MissionDm.UpdatedBy;
            dm.MissionDm = null;
            ctx.MissionDetailsTbl.Remove(dm);
            return ((await ctx.SaveChangesAsync()) > 0);
        }

        public async Task<IQueryable<MissionUserRelationDm>> GetAssignedMission(Expression<Func<MissionUserRelationDm, bool>> predicate)
        {
            var query = ctx.MissionUserRelationTbl
                .Include(x => x.MissionDm)
                .Include(x => x.AppUserDm)
                .Where(predicate)
                .AsNoTracking();
            return await Task.FromResult(query);
        }

        public async Task<bool> UnAssignAllUser(Guid missionUid)
        {
            var mission = await ctx.MissionTbl.Where(x => x.uid == missionUid).FirstOrDefaultAsync();
            mission.IsAssigned = false;
            var rel = await ctx.MissionUserRelationTbl.Where(x => x.MissionUid == missionUid).ToListAsync();
            ctx.MissionUserRelationTbl.RemoveRange(rel);
            return ((await ctx.SaveChangesAsync()) > 0);
        }
    }

    public interface IMissionDbService
    {
        Task<MissionDm> AddUpdateMission(MissionDm dm);
        Task<MissionDetailsDm> AddUpdateMissionDetails(MissionDetailsDm dm);
        Task<bool> HardDeleteMissionDetails(MissionDetailsDm dm);
        Task<bool> AssignMission(List<MissionUserRelationDm> dm);
        Task<bool> UnAssignAllUser(Guid missionUid);
        Task<IQueryable<MissionDm>> GetMission(Expression<Func<MissionDm, bool>> predicate);
        Task<IQueryable<MissionDetailsDm>> GetMissionDetails(Expression<Func<MissionDetailsDm, bool>> predicate);
        Task<IQueryable<MissionUserRelationDm>> GetMissionByUser(Expression<Func<MissionUserRelationDm, bool>> predicate);

        Task<IQueryable<MissionUserRelationDm>> GetAssignedMission(Expression<Func<MissionUserRelationDm, bool>> predicate);
    }
}
