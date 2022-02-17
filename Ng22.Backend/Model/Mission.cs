using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    [Table("mission")]
    public class MissionDm
    {
        public MissionDm()
        {
            this.alive = true;
        }

        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid uid { get; set; }
        public string title { get; set; }
        public string brief { get; set; }
        [Column(TypeName = "tinyint")]
        public bool alive { get; set; }

        [Column(TypeName = "tinyint")]
        public bool IsAssigned { get; set; }        

        [Column("updated_dt")]
        public DateTime UpdatedDt { get; set; }
        public string UpdatedBy { get; set; }
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
        [JsonIgnore]
        public MissionDm MissionDm { get; set; }
        public string Instruction { get; set; }

        [Column("updated_dt")]
        public DateTime UpdatedDt { get; set; }
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

    public class MissionVm
    {
        public Guid Uid { get; set; }
        public string Title { get; set; }
        public string Brief { get; set; }
        public bool Alive { get; set; }
        public bool IsAssigned { get; set; }
        public DateTime UpdatedDt { get; set; }
        public string UpdatedBy { get; set; }
        public virtual ICollection<MissionDetailsDm> missionDetails { get; set; }
        public int DetailsCount { get; set; }
    }
}
