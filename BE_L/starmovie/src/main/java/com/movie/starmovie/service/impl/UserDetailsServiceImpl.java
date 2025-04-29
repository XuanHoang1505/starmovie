package com.movie.starmovie.service.impl;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Bạn có thể load user từ DB thay vì hardcode
        if ("admin".equals(username)) {
            return new User("admin", "$2a$10$DowJ6/5kTz1c6wxeo1PuSuX5OMnYpLgDEaQBD9x2JpgHhMZ0qjLmu", // password: admin
                    Collections.emptyList());
        }
        throw new UsernameNotFoundException("User not found");
    }
}