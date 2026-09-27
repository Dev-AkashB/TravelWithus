package com.travelwithus.payment.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI paymentServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TravelWithUs - Payment Service API")
                        .description("Microservice for processing payments, managing gateway interactions, and handling refunds")
                        .version("1.0.0")
                        .contact(new Contact().name("TravelWithUs Engineering").email("support@travelwithus.com"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")));
    }
}
