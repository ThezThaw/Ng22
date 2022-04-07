using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    [Table("config_expiry")]
    public class ExpiryConfigDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        [Column(TypeName = "TINYINT")]
        public ushort Duration { get; set; }

        [Column(TypeName = "char(1)")]
        public string Unit { get; set; }
    }

    [Table("2fa")]
    public class TwoFADm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        public string Passcode { get; set; }

        //[JsonIgnore]
        public DateTime Expire { get; set; }

        [NotMapped]
        public Guid ExpireUid { get; set; }
        public string LastUsedBy { get; set; }
        public DateTime? LastUsedOn { get; set; }
        public virtual ICollection<User2FaRelationDm> GrantTo { get; set; }
    }

    public class TwoFAVm
    {
        public Guid Uid { get; set; }
        public string Passcode { get; set; }
        public DateTime Expire { get; set; }
        public Guid ExpireUid { get; set; }
        //public string LastUsedBy { get; set; }
        //public DateTime? LastUsedOn { get; set; }
        public List<Guid> lstUserUid { get; set; }
    }

    [Table("rel_user_2fa")]
    public class User2FaRelationDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        [Column("2fauid", TypeName = "varchar(36)")]
        public Guid TwoFaUid { get; set; }

        [ForeignKey("TwoFaUid")]
        [JsonIgnore]
        public TwoFADm TwoFADm { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid UserUid { get; set; }

        [ForeignKey("UserUid")]
        public AppUserDm AppUserDm { get; set; }
    }
}
