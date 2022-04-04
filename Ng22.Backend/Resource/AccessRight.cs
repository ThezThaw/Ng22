using AutoMapper;
using Ng22.Helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend.Resource
{
    public class AccessRightResource : BaseResource, IAccessRightResource
    {
        private readonly IAccessRightDbService arDbService;
        public AccessRightResource(IMapper mapper, IAccessRightDbService arDbService) : base(mapper)
        {
            this.arDbService = arDbService;
        }

        public async Task<List<PageDm>> GetAvailablePageByUser(string userId)
        {
            var page = await arDbService.GetAvailablePageByUser(userId);
            var defaultPage = await arDbService.GetPage(x => (userId == Const.AdminUserId) ? x.PageCode == Const.PageCodeAccessRight : x.PageCode == Const.PageCodeUserInfo);
            if (!(page.Where(x => x.Uid == defaultPage.FirstOrDefault().Uid).Any()))
            {
                page.Add(defaultPage.FirstOrDefault());
            }

            if (userId != Const.AdminUserId)
            {
                defaultPage = await arDbService.GetPage(x => x.PageCode == Const.PageCodeInbox);
                if (!(page.Where(x => x.Uid == defaultPage.FirstOrDefault().Uid).Any()))
                {
                    page.Add(defaultPage.FirstOrDefault());
                }
            }
            
            

            return page;
        }

        public async Task<StatusResult<bool>> AddAccessRight(List<UserPageRelationDm> dm, string userId)
        {
            try
            {
                var result = await arDbService.AddAccessRight(dm);
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

        public async Task<StatusResult<bool>> RemoveAccessRight(Guid useruid)
        {
            try
            {
                var result = await arDbService.RemoveAccessRight(useruid);
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

        public async Task<List<AccessRightVm>> GetAccessRightList(Guid? useruid)
        {
            var all = await arDbService.GetExistingAccessRight(x => (useruid.HasValue ? x.UserUid == useruid : true) &&
                                x.AppUserDm.alive);

            Parallel.ForEach(all, x => {
                x.PageDm.Default = x.Default;
            });

            var group = all.AsEnumerable().GroupBy(x => new
            {
                x.AppUserDm.uid,
                x.AppUserDm.userId,
                x.AppUserDm.nickName,
            }).ToList();

            var lst = new ConcurrentBag<AccessRightVm>();
            Parallel.ForEach(group, g => {
                lst.Add(new AccessRightVm
                {
                    AppUser = new AppUserDm()
                    {
                        uid = g.Key.uid,
                        userId = g.Key.userId,
                        nickName = g.Key.nickName
                    },
                    Pages = g.Select(p => new PageDm()
                    { 
                        Uid = p.PageDm.Uid,
                        PageCode = p.PageDm.PageCode,
                        MenuName = p.PageDm.MenuName,
                        Icon = p.PageDm.Icon,
                        Default = p.Default
                    }).ToList()
                });
            });

            return lst.OrderBy(x => x.AppUser.userId).ToList();
        }
    }

    public interface IAccessRightResource
    {
        Task<List<PageDm>> GetAvailablePageByUser(string userId);
        Task<StatusResult<bool>> AddAccessRight(List<UserPageRelationDm> dm, string userId);
        Task<StatusResult<bool>> RemoveAccessRight(Guid useruid);
        Task<List<AccessRightVm>> GetAccessRightList(Guid? useruid);
    }
}
