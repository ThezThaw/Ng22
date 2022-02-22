using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
