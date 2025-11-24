package com.aethernet.common.health;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(HealthController.class)
public class HealthConfiguration {
}
