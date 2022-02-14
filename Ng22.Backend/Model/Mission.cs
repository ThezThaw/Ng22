using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    [Table("mission")]
    public class MissionDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid uid { get; set; }
        public string title { get; set; }
        public string brief { get; set; }
        [Column(TypeName = "tinyint")]
        public bool alive { get; set; }
        public virtual ICollection<MissionDetailsDm> missionDetails { get; set; }
    }

    [Table("mission_details")]
    public class MissionDetailsDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid MissionUid { get; set; }

        [ForeignKey("MissionUid")]
        public MissionDm MissionDm { get; set; }

        public string Instruction { get; set; }
    }


    [Table("rel_user_mission")]
    public class MissionUserRelationDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid MissionUid { get; set; }

        [ForeignKey("MissionUid")]
        public MissionDm MissionDm { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid UserUid { get; set; }

        [ForeignKey("UserUid")]
        public AppUserDm AppUserDm { get; set; }
    }
}
