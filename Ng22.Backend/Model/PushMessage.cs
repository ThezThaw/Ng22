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
    [Table("app_subscriber")]
    public class SubscriberInfoDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        public Guid UserUid { get; set; }
        public string endpoint { get; set; }
        public string auth { get; set; }
        public string key { get; set; }
        public DateTime subscribedon { get; set; }

        [ForeignKey("UserUid")]
        public AppUserDm AppUser { get; set; }
    }

    public class SentMessageFilter
    {
        public bool isInbox { get; set; }
        public string startFrom { get; set; }
        public List<string> sentFrom { get; set; }
        public List<string> sentTo { get; set; }
        public string msg { get; set; }
    }

    public class SentMessageVm
    {
        public Guid Uid { get; set; }
        public string message { get; set; }        
        public DateTime senton { get; set; }
        public string sentby { get; set; }
        public bool softdeleted { get; set; }
        public string deletedby { get; set; }
        public DateTime? deletedon { get; set; }
        public List<SentTo> SentTo { get; set; }
    }
    public class SentTo
    {
        public AppUserDm AppUser { get; set; }
        public string status { get; set; }
        public bool softdeleted { get; set; }
        public DateTime? deletedon { get; set; }
    }

    [Table("sent_message")]
    public class SentMessageDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        public string message { get; set; }
        public string sentby { get; set; }
        public DateTime senton { get; set; }
        public bool softdeleted { get; set; }
        public string deletedby { get; set; }
        public DateTime? deletedon { get; set; }
        public ICollection<SentMessageSubscriberRelationDm> SentTo { get; set; }
    }

    [Table("rel_subscriber_message")]
    public class SentMessageSubscriberRelationDm
    {
        [Key]
        [Column(TypeName = "varchar(36)")]
        public Guid Uid { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid MessageUid { get; set; }

        [ForeignKey("MessageUid")]
        [JsonIgnore]
        public SentMessageDm SentMessage { get; set; }

        [Column(TypeName = "varchar(36)")]
        public Guid SubscriberUid { get; set; }

        [ForeignKey("SubscriberUid")]
        public SubscriberInfoDm Subscriber { get; set; }

        [Column(TypeName = "char(7)")]
        public string status { get; set; }

        [Column(TypeName = "tinyint")]
        public bool softdeleted { get; set; }
        public string deletedby { get; set; }
        public DateTime? deletedon { get; set; }
    }

    public class SendMessageVm
    {
        public string message { get; set; }
        public List<Guid> lstUserUid { get; set; }
    }
    public class SubscriberInfoVm
    {
        public string endpoint { get; set; }
        public SubKey keys { get; set; }
    }

    public class SubKey
    {
        public string auth { get; set; }
        public string p256dh { get; set; }
    }

    public class payload
    {
        public noti notification { get; set; }
    }

    public class noti
    {
        public string title { get; set; }
        public string body { get; set; }
    }
}
