using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    [Table("app_page")]
    public class PageDm //Vm = ViewModel, Dm = DataModel, Bm = Both Combine together
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }
        public string PageCode { get; set; }
        public string MenuName { get; set; }
        public string Icon { get; set; }

        [Column("exclude_access_right", TypeName = "tinyint")]
        public bool ExcludeAccessRight { get; set; }

        [NotMapped]
        public bool? Default { get; set; }

        [Column(TypeName = "smallint")]
        public ushort? SortOrder { get; set; }
    }

    [Table("rel_user_page")]
    public class UserPageRelationDm //Vm = ViewModel, Dm = DataModel, Bm = Both Combine together
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid UserUid { get; set; }
        [ForeignKey("UserUid")]
        public AppUserDm AppUserDm { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid PageUid { get; set; }
        [ForeignKey("PageUid")]
        public PageDm PageDm { get; set; }

        [Column(TypeName = "tinyint(1)")]
        public bool? Default { get; set; }

    }

    public class AccessRightVm
    {
        public AppUserDm AppUser { get; set; }
        public ICollection<PageDm> Pages { get; set; }
    }
}
