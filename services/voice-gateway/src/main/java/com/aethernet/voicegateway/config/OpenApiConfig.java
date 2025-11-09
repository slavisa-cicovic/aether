package com.aethernet.voicegateway.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

    @Value("${aethervoice.openapi.dev-url:http://localhost:8080/v1}")
    private String devUrl;

    @Bean
    public OpenAPI aetherVoiceOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl(devUrl);
        devServer.setDescription("Development Server");

        Contact contact = new Contact();
        contact.setEmail("api@aethernet.com");
        contact.setName("AetherNet API Support");
        contact.setUrl("https://www.aethernet.com");

        License mitLicense = new License()
            .name("MIT License")
            .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
            .title("AetherVoice Gateway API")
            .version("1.0.0")
            .contact(contact)
            .description("""
                REST API za AetherNet glasovni agent. Ovaj API omogućava glasovnom agentu 
                da komunicira sa AetherNet backend sistemom za kreiranje i upravljanje narudžbinama putem glasa.
                
                ## Autentifikacija
                Svi API pozivi (osim health checkova) zahtevaju JWT token u Authorization header-u.
                
                ## Base URL
                `https://api.aethernet.com/v1`
                """)
            .license(mitLicense);

        // Security Scheme - NOVO
        SecurityScheme securityScheme = new SecurityScheme()
            .name("Bearer Authentication")
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .description("Unesite JWT token dobijen od AetherNet auth servisa");

        SecurityRequirement securityRequirement = new SecurityRequirement()
            .addList("bearerAuth");

        return new OpenAPI()
            .info(info)
            .servers(List.of(devServer))
            .components(new Components().addSecuritySchemes("bearerAuth", securityScheme))
            .addSecurityItem(securityRequirement);
    }
}