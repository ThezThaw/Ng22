using AutoMapper;

namespace Ng22.Backend
{
    public class Ng22MapperClass : Profile
    {
        public Ng22MapperClass()
        {
            CreateMap<AppUserDm, AppUserVm>()
                .ForMember(vm => vm.Password, opt => opt.Ignore())
                .ReverseMap();
        }
    }
}
