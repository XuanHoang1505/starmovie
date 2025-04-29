package com.movie.starmovie.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(UserDetailsService userDetailsService) {
        var provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }
    

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configure(http))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(
                            "/api/auth/**",
                            "/api/public/**", "/**").permitAll(); // Các endpoint công khai
                    // auth.requestMatchers("/api/admin/**").authenticated(); // yêu cầu xác thực
                    // auth.requestMatchers("/api/user/**").authenticated();
                    // endpoint riêng của mình
                    // auth.anyRequest().authenticated(); // Các endpoint khác yêu cầu xác thực
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
// SecurityConfig là lớp cấu hình bảo mật chính của ứng dụng.
// JWT được sử dụng để bảo mật các endpoint và đảm bảo rằng các yêu cầu HTTP có
// chứa JWT hợp lệ mới được xử lý.
// Không trạng thái: Ứng dụng được cấu hình để hoạt động không trạng thái bằng
// cách sử dụng JWT thay vì session để xác thực.
// Password Encoding: Sử dụng BCryptPasswordEncoder để mã hóa mật khẩu trước khi
// lưu vào cơ sở dữ liệu, đảm bảo tính bảo mật cao.
// Phân quyền: Cấu hình chi tiết phân quyền để kiểm soát truy cập vào các
// endpoint dựa trên vai trò hoặc trạng thái xác thực của người dùng.
