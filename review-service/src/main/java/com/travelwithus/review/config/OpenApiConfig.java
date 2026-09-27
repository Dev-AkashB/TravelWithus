package com.travelwithus.review.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI reviewServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TravelWithUs - Review & Rating Service API")
                        .description("Microservice for managing traveler reviews, verified booking checks, rating distributions, and moderation")
                        .version("1.0.0")
                        .contact(new Contact().name("TravelWithUs Engineering").email("support@travelwithus.com"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")));
    }
}
