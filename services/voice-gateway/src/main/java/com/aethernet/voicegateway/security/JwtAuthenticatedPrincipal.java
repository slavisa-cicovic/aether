package com.aethernet.voicegateway.security;

import java.util.Set;

public record JwtAuthenticatedPrincipal(Integer userId, String email, Set<String> roles) {
}
