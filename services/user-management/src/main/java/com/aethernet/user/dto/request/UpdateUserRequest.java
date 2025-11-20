package com.aethernet.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String lang;

    @NotNull
    private boolean active;

    @NotNull
    private boolean locked;
}
