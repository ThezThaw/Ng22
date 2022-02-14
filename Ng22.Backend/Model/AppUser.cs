using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Backend
{
    public class AppUserVm
    {
        public Guid? Uid { get; set; }
        public string userId { get; set; }
        public string nickName { get; set; }
        public string CurrentPassword { get; set; }
        public string Password { get; set; }
        public bool? SkipPassword { get; set; }
        public bool alive { get; set; }
    }

    [Table("app_user")]
    public class AppUserDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid uid { get; set; }
        public string userId { get; set; }
        public string nickName { get; set; }
        public string password { get; set; }

        [Column(TypeName = "tinyint")]
        public bool alive { get; set; }
    }

    public class UserRoleVm
    {
        public string PageCode { get; set; }
        public string MenuName { get; set; }
    }

    [Table("app_page")]
    public class PageDm //Vm = ViewModel, Dm = DataModel, Bm = Both Combine together
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }
        public string PageCode { get; set; }
        public string MenuName { get; set; }
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
    }
}
