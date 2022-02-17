using AutoMapper;
using Ng22.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Backend.Resource
{
    public class AppUserResource : BaseResource, IAppUserResource
    {
        private readonly IUserDbService userDbService;
        public AppUserResource(IUserDbService userDbService, IMapper mapper): base(mapper)
        {
            this.userDbService = userDbService;
        }

        public async Task<StatusResult<AppUserVm>> AddUser(AppUserVm vm)
        {
            try
            {
                var isExists = await userDbService.GetUser(vm.userId);
                if (isExists != null)
                {
                    return new StatusResult<AppUserVm>()
                    {
                        status = false,
                        message = new List<string>() { "User Id already exists." }
                    };
                }

                var dm = mapper.Map<AppUserDm>(vm);
                dm.password = BCrypt.Net.BCrypt.HashPassword(vm.Password);
                dm.alive = true;
                await userDbService.AddUser(dm);
                return new StatusResult<AppUserVm>()
                {
                    status = true

                };
            }
            catch (Exception ex)
            {
                return new StatusResult<AppUserVm>()
                { 
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }
        }

        public async Task<StatusResult<AppUserVm>> UpdateUser(AppUserVm vm)
        {
            try
            {
                var dm = mapper.Map<AppUserDm>(vm);
                if (vm.SkipPassword.HasValue && !vm.SkipPassword.Value && dm.alive)
                {
                    if (string.IsNullOrEmpty(vm.CurrentPassword))
                    {
                        dm.password = BCrypt.Net.BCrypt.HashPassword(vm.Password);
                    }
                    else
                    {
                        dm = await userDbService.GetUser(vm.userId);
                        if (dm == null) return new StatusResult<AppUserVm>() 
                        { 
                            status = false,
                            message = new List<string>() { $"Invalid User : {vm.userId}" }
                        };

                        if (BCrypt.Net.BCrypt.Verify(vm.CurrentPassword, dm.password))
                        {
                            dm.password = BCrypt.Net.BCrypt.HashPassword(vm.Password);
                        }
                        else
                        {
                            return new StatusResult<AppUserVm>()
                            {
                                status = false,
                                message = new List<string>() { $"Invalid Current Password" }
                            };
                        }
                    }                    
                }
                await userDbService.UpdateUser(dm);
                return new StatusResult<AppUserVm>()
                {
                    status = true
                };
            }
            catch (Exception ex)
            {
                return new StatusResult<AppUserVm>()
                {
                    status = false,
                    message = new List<string>() { ex.ToString() }
                };
            }            
        }

        public async Task<List<AppUserVm>> GetUserList(string filter)
        {
            var dm = await userDbService.GetUserList(x => (string.IsNullOrEmpty(filter) ? true : x.userId.Contains(filter) || x.nickName.Contains(filter)) && x.alive);
            return mapper.Map<List<AppUserVm>>(dm);
        }

        public async Task<AppUserVm> GetVerifyUser(string userId, string password)
        {
            var dm = await userDbService.GetUser(userId);
            if (dm == null) return null;

            if (BCrypt.Net.BCrypt.Verify(password, dm.password))
            {
                var v = mapper.Map<AppUserVm>(dm);
                return mapper.Map<AppUserVm>(dm);
            }
            return null;
        }

        public async Task<List<PageDm>> GetAvailablePageByUser(string userId)
        {
            var page = await userDbService.GetAvailablePageByUser(userId);
            if (userId != Const.AdminUserId)
            {
                var defaultPage = await userDbService.GetPage(x => x.PageCode == Const.PageCodeUserInfo);
                page.Add(defaultPage.FirstOrDefault());
            }            
            return page;
        }
    }

    public interface IAppUserResource
    {
        Task<List<AppUserVm>> GetUserList(string filter);
        Task<AppUserVm> GetVerifyUser(string userId, string password);
        Task<StatusResult<AppUserVm>> AddUser(AppUserVm vm);
        Task<StatusResult<AppUserVm>> UpdateUser(AppUserVm vm);
        Task<List<PageDm>> GetAvailablePageByUser(string userId);
    }
}
