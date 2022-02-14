using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    public abstract class BaseDbService
    {
        protected readonly Ng22DbContext ctx;
        public BaseDbService(Ng22DbContext ctx)
        {
            this.ctx = ctx;
        }

        public async Task SaveChangesAsync()
        {
            await ctx.SaveChangesAsync();
        }
    }
}
