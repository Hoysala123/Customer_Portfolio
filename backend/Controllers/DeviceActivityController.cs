using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "CustomerOnly")]
    public class DeviceActivityController : ControllerBase
    {
        private readonly FinVistaDbContext db;

        public DeviceActivityController(FinVistaDbContext db)
        {
            this.db = db;
        }

        [HttpGet("{customerId}")]
        public IActionResult GetDeviceActivity(Guid customerId)
        {
            var authenticatedUserId =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (authenticatedUserId == null ||
                customerId.ToString() != authenticatedUserId)
            {
                return Forbid();
            }

            var logs = db.AuditLogs
                .Where(l =>
                    l.CustomerId == customerId &&
                    l.Role == "Customer" &&
                    !l.IsRead)
                .OrderByDescending(l => l.Timestamp)
                .Take(10)
                .Select(l => new
                {
                    l.Id,
                    l.Action,
                    l.Status,
                    Timestamp = l.Timestamp
                        .ToString("yyyy-MM-dd HH:mm:ss")
                })
                .ToList();

            return Ok(logs);
        }

        [HttpPost("{customerId}/mark-read")]
        public IActionResult MarkNotificationsAsRead(Guid customerId, [FromBody] List<Guid> notificationIds)
        {
            var authenticatedUserId =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (authenticatedUserId == null ||
                customerId.ToString() != authenticatedUserId)
            {
                return Forbid();
            }

            var logs = db.AuditLogs
                .Where(l =>
                    l.CustomerId == customerId &&
                    l.Role == "Customer" &&
                    notificationIds.Contains(l.Id))
                .ToList();

            foreach (var log in logs)
            {
                log.IsRead = true;
            }

            db.SaveChanges();

            return Ok();
        }
    }
}
