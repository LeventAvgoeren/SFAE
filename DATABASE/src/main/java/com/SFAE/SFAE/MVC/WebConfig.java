
package com.SFAE.SFAE.MVC;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Configuration;


/**
 * Configuration class for setting up CORS (Cross-Origin Resource Sharing) settings.
 * This class implements the {@link WebMvcConfigurer} interface to customize Spring MVC's configuration.
 * @author erayzor
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Adds CORS mappings to the application.
     * 
     * @param registry The {@link CorsRegistry} to configure CORS mappings.
     */
    @Override
    public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .exposedHeaders("Access-Control-Allow-Origin")
            .allowCredentials(true);
    }
    
}
