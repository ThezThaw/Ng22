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

            CreateMap<MissionDm, MissionVm>()
                .ForMember(vm => vm.missionDetails, opt => opt.Ignore())
                .ForMember(vm => vm.DetailsCount, opt => opt.MapFrom(dm => dm.missionDetails.Count))
                ;

            CreateMap<TwoFAVm, TwoFADm>()
                ;
        }
    }
}
