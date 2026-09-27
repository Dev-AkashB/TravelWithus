package com.travelwithus.hotel.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hotelServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TravelWithUs - Hotel Service API")
                        .description("REST API for luxury hotels, room type inventories, pricing, and amenities")
                        .version("1.0.0")
                        .contact(new Contact().name("TravelWithUs Engineering").email("dev@travelwithus.com"))
                        .license(new License().name("Apache 2.0")));
    }
}
