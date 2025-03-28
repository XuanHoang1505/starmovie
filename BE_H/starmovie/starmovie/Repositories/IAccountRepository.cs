﻿using Microsoft.AspNetCore.Identity;
using starmovie.Models;

namespace starmovie.Repositories
{
    public interface IAccountRepository
    {
        public Task<IdentityResult> SignUpAsync(SignUpModel model);
        public Task<string> SignInAsync(SignInModel model);
    }
}
