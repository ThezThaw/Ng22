using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    [Table("ip_blacklist")]
    public class IpBlackListDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }        
        public string StartIPAddress { get; set; }
        public int StartIPNumber { get; set; }        
        public string EndIPAddress { get; set; }
        public int? EndIPNumber { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }
}
