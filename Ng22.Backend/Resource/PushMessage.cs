using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ng22.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebPush;

namespace Ng22.Backend.Resource
{
    public class PushMessageResource: BaseResource, IPushMessageResource
    {
        private readonly IPushMessageDbService pushMsgDbService;
        private readonly IUserDbService userDbService;
        public PushMessageResource(IPushMessageDbService pushMsgDbService, IUserDbService userDbService, IMapper mapper) : base(mapper)
        {
            this.pushMsgDbService = pushMsgDbService;
            this.userDbService = userDbService;
        }

        public async Task<StatusResult<bool>> ClientRegistration(SubscriberInfoVm vm, string userId)
        {
            try
            {
                var appUser = await userDbService.GetUser(userId);
                var dm = new SubscriberInfoDm()
                { 
                    endpoint = vm.endpoint,
                    auth = vm.keys.auth,
                    key = vm.keys.p256dh,
                    UserUid = appUser.uid,
                    subscribedon = DateTime.UtcNow.NowByTimezone(Config.Timezone)
                };
                var result = await pushMsgDbService.ClientRegistration(dm);
                return new StatusResult<bool>()
                {
                    status = result,
                    data = result
                };
            }
            catch (Exception ex)
            {
                return new StatusResult<bool>()
                {
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }
        }

        public async Task<List<SentMessageVm>> GetSentMessage(string userId)
        {
            var lstSentMessage = new List<SentMessageVm>();
            var lstRaw = await pushMsgDbService.GetSentMessageByUserId(x => x.Subscriber.AppUser.alive && (string.IsNullOrEmpty(userId) ? true : x.Subscriber.AppUser.userId == userId));

            if (string.IsNullOrEmpty(userId))
            {
                var lst = await lstRaw.ToListAsync();
                var msgGroup = lst.GroupBy(x => new { x.SentMessage.Uid, x.SentMessage.message, x.SentMessage.senton }).ToList();
                foreach (var mg in msgGroup)
                {
                    var sm = new SentMessageVm()
                    {
                        Uid = mg.Key.Uid,
                        message = mg.Key.message,
                        senton = mg.Key.senton,
                        SentTo = new List<SentTo>()
                    };
                    var userGroup = mg.GroupBy(x => new { x.Subscriber.AppUser.userId, x.Subscriber.AppUser.nickName }).ToList();
                    foreach (var ug in userGroup)
                    {
                        var status = ug.Any(x => x.status == Const.SentStatus.Success) ? Const.SentStatus.Success : Const.SentStatus.Fail;

                        sm.SentTo.Add(new SentTo()
                        {
                            AppUser = new AppUserDm()
                            {
                                userId = ug.Key.userId,
                                nickName = ug.Key.nickName
                            },
                            status = status
                        });
                    }
                    lstSentMessage.Add(sm);
                }
            }
            else
            {
                var lst = await lstRaw.Where(x => x.status == Const.SentStatus.Success).ToListAsync();
                var msgGroup = lst.GroupBy(x => new { x.SentMessage.message, x.SentMessage.senton }).ToList();
                foreach (var msg in msgGroup)
                {
                    lstSentMessage.Add(new SentMessageVm()
                    { 
                         message = msg.Key.message,
                         senton = msg.Key.senton
                    });
                }
            }
            return lstSentMessage.OrderByDescending(x => x.senton).ToList();
        }

        public async Task<StatusResult<bool>> DeleteMessage(Guid uid)
        {
            try
            {
                var result = false;
                if (uid == Guid.Empty)
                {
                    result = await pushMsgDbService.DeleteMessage(true);
                }
                else
                {                    
                    var dm = await pushMsgDbService.GetSentMessage(x => x.Uid == uid);
                    result = await pushMsgDbService.DeleteMessage(false, await dm.FirstOrDefaultAsync());
                }

                return new StatusResult<bool>()
                {
                    status = result,
                    data = result
                };
            }
            catch (Exception ex)
            {
                return new StatusResult<bool>()
                {
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }
        }

        public async Task<StatusResult<bool>> SendMessage(SendMessageVm sm, string sentBy)
        {
            var guid = Guid.NewGuid();
            var dm = new SentMessageDm()
            {
                Uid = guid,
                message = sm.message,
                sentby = sentBy,
                senton = DateTime.UtcNow.NowByTimezone(Config.Timezone),
                SentTo = new List<SentMessageSubscriberRelationDm>()
            };


            var lst = await pushMsgDbService.GetSubscriber(x => sm.lstUserUid.Contains(x.AppUser.uid));
            foreach (var s in await lst.ToListAsync())
            {
                var subject = @"https://www.ma_a_loe_min_aung_hlaing.com";
                var publicKey = @"BHDuQkQUYQdnkSimea3jVDYDDOLH7qVeb8yW9KjjGlCjCNJdlAUE5L5lCdxtIyvdCnZSMQZn-X7Htt-jeypXi94";
                var privateKey = @"MwHzqldLV7SlWwdVCKRLP4PGAbgnMetcy7g1HrrKwLo";

                var subscription = new PushSubscription(s.endpoint, s.key, s.auth);
                var vapidDetails = new VapidDetails(subject, publicKey, privateKey);
                //var gcmAPIKey = @"[your key here]";

                var payload = new payload();
                payload.notification = new noti();
                payload.notification.title = "New Message from Ng22";
                payload.notification.body = sm.message;
                var pl = Newtonsoft.Json.JsonConvert.SerializeObject(payload);
                var status = Const.SentStatus.Success;
                var webPushClient = new WebPushClient();
                try
                {
                    await webPushClient.SendNotificationAsync(subscription, pl, vapidDetails);
                }
                catch
                {
                    status = Const.SentStatus.Fail;
                }

                dm.SentTo.Add(new SentMessageSubscriberRelationDm()
                {
                    MessageUid = guid,
                    SubscriberUid = s.Uid,
                    status = status
                });
            }

            await pushMsgDbService.SentMessage(dm);
            return new StatusResult<bool> { status = true };
        }
    }

    public interface IPushMessageResource
    {
        Task<StatusResult<bool>> ClientRegistration(SubscriberInfoVm vm, string userId);
        Task<StatusResult<bool>> SendMessage(SendMessageVm sm, string sentBy);
        Task<StatusResult<bool>> DeleteMessage(Guid uid);
        Task<List<SentMessageVm>> GetSentMessage(string userId);
    }
}
