package com.cartflow.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File uploadDir = new File("uploads");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        String uploadPath = uploadDir.getAbsolutePath();
        
        // Match standard format for file URL based on OS (ensure trailing slash)
        String resourceLocation = "file:" + (uploadPath.startsWith("/") ? "" : "/") + uploadPath.replace("\\", "/") + "/";
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}
