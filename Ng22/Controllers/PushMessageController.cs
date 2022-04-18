using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ng22.Backend;
using Ng22.Backend.Resource;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ng22.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PushMessageController : BaseController
    {
        private readonly IPushMessageResource pushMsgResource;
        public PushMessageController(IPushMessageResource pushMsgResource)
        {
            this.pushMsgResource = pushMsgResource;
        }

        [HttpPost("ClientRegistration")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> ClientRegistration([FromBody] SubscriberInfoVm vm)
        {            
            return Ok(await pushMsgResource.ClientRegistration(vm, GetCurrentUserId()));
        }

        [HttpPost("SendMessage")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> SendMessage([FromBody]SendMessageVm sm)
        {
            return Ok(await pushMsgResource.SendMessage(sm, GetCurrentUserId()));
        }

        [HttpPost("GetSentMessage")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> GetSentMessage(SentMessageFilter filter)
        {
            return Ok(await pushMsgResource.GetSentMessage(filter, GetCurrentUserId()));
        }

        [HttpPost("DeleteMessage/{softdelete}/{isInbox}")]
        [Authorize(AuthenticationSchemes = "L1")]
        public async Task<IActionResult> DeleteMessage([FromBody]List<Guid> uids, bool softdelete, bool isInbox)
        {
            return Ok(await pushMsgResource.DeleteMessage(uids, isInbox, softdelete, GetCurrentUserId()));
        }
    }
}
