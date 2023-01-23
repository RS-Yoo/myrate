using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using myrate_backend.Data;
using myrate_backend.Models;
using System.Text.Json.Serialization;

namespace myrate_backend.Controllers
{
    [Route("api/[controller]/[action]/")]
    public class CollectionsController : Controller
    {
        private MyRateDbContext _context;
        public CollectionsController(MyRateDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> GetCollections()
        {
            // TODO: Get user from DB in the future
            var collections = _context.Set<MediaCollection>();
            return Ok(new { success = true, res = collections });
        }
    }
}
