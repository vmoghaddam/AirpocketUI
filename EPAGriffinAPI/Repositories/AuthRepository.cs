using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace EPAGriffinAPI.Repositories
{
    public class AuthRepository : IDisposable
    {
        private EPAGRIFFINEntities _ctx;

        //private UserManager<IdentityUser> _userManager;

        public AuthRepository()
        {
            _ctx = new EPAGRIFFINEntities();
            
        }
        

        
        public async Task<bool> AddRefreshToken(RefreshToken token)
        {

            var existingToken = _ctx.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

            if (existingToken != null)
            {
                var result = await RemoveRefreshToken(existingToken);
            }

            _ctx.RefreshTokens.Add(token);

            //return await _ctx.SaveChangesAsync() > 0;
            try
            {
                return _ctx.SaveChanges() > 0;
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {

                    foreach (var ve in eve.ValidationErrors)
                    {
                        var xxx =
                             ve.PropertyName + " " + ve.ErrorMessage;
                    }
                }
                return false;
            }
            catch(Exception ex)
            {
                return false;
            }

        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            if (refreshToken != null)
            {
                _ctx.RefreshTokens.Remove(refreshToken);
                return await _ctx.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            _ctx.RefreshTokens.Remove(refreshToken);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            return refreshToken;
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
            return _ctx.RefreshTokens.ToList();
        }

        //public async Task<aspne> RemoveRefreshToken(string refreshTokenId)
        //{
        //    var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

        //    if (refreshToken != null)
        //    {
        //        _ctx.RefreshTokens.Remove(refreshToken);
        //        return await _ctx.SaveChangesAsync() > 0;
        //    }

        //    return false;
        //}


        public void Dispose()
        {
            _ctx.Dispose();
        

        }
    }
}