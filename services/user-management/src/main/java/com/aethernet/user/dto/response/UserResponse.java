package com.aethernet.user.dto.response;

import java.util.Set;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private boolean active;
    private boolean locked;

    private Set<String> roles;
}
