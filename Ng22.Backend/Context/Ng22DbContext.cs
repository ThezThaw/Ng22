﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    public class Ng22DbContext : DbContext
    {
        public Ng22DbContext(DbContextOptions<Ng22DbContext> options) : base(options) { }

        public DbSet<AppUserDm> AppUserTbl { get; set; }
        public DbSet<PageDm> PageTbl { get; set; }
        public DbSet<UserPageRelationDm> UserPageRelationTbl { get; set; }
        public DbSet<MissionDm> MissionTbl { get; set; }
        public DbSet<MissionDetailsDm> MissionDetailsTbl { get; set; }
        public DbSet<MissionUserRelationDm> MissionUserRelationTbl { get; set; }
        
    }
}