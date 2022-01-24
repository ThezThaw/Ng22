using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Model
{
    public class Mission
    {
        public Guid Id { get; set; }
        public string Name { get; set; }        
    }

    public class MissionDetails
    {
        public Guid Id { get; set; }
        public string Instructions { get; set; }
    }
}
