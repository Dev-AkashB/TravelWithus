package com.travelwithus.destination.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI destinationServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TravelWithUs - Destination Service API")
                        .description("REST API for world travel destinations, search, categories, and attractions")
                        .version("1.0.0")
                        .contact(new Contact().name("TravelWithUs Engineering").email("dev@travelwithus.com"))
                        .license(new License().name("Apache 2.0")));
    }
}
