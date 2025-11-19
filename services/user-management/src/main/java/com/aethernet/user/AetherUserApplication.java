package com.aethernet.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AetherUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(AetherUserApplication.class, args);
    }
}
