package com.movie.starmovie.config;

import com.cloudinary.Cloudinary;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    private final Dotenv dotenv = Dotenv.load();

    @Bean
    Cloudinary cloudinary() {
        return new Cloudinary(dotenv.get("CLOUDINARY_URL"));
    }
}
