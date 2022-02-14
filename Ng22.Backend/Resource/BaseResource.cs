using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ng22.Backend.Resource
{
    public class BaseResource
    {
        protected readonly IMapper mapper;
        public BaseResource(IMapper mapper)
        {
            this.mapper = mapper;
        }
    }
}
