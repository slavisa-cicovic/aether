package com.aethernet.user.service.user;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.aethernet.user.domain.User;
import com.aethernet.user.dto.request.RegisterUserRequest;
import com.aethernet.user.dto.request.UpdateUserRequest;
import com.aethernet.user.dto.response.UserResponse;
import com.aethernet.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(u -> !u.isDeleted())
                .map(this::toUserResponse)
                .toList();
    }

    public UserResponse getUserById(@NonNull Integer id) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toUserResponse(user);
    }

    @SuppressWarnings("null")
    public UserResponse createUser(RegisterUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .lang(resolveLang(request.getLang()))
                .active(true)
                .locked(false)
                .deleted(false)
                .build();

        return toUserResponse(userRepository.save(user));
    }

    public UserResponse updateUser(@NonNull Integer id, UpdateUserRequest request) {

        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setActive(Boolean.TRUE.equals(request.isActive()));
        user.setLocked(Boolean.TRUE.equals(request.isLocked()));
        if (StringUtils.hasText(request.getLang())) {
            user.setLang(resolveLang(request.getLang()));
        }

        return toUserResponse(userRepository.save(user));
    }

    public void deleteUser(@NonNull Integer id) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setDeleted(true);
        user.setActive(false);
        userRepository.save(user);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .lang(user.getLang())
                .active(user.isActive())
                .locked(user.isLocked())
                .roles(toRoleNames(user))
                .build();
    }

    private Set<String> toRoleNames(User user) {
        return Optional.ofNullable(user.getRoles())
                .orElseGet(Collections::emptySet)
                .stream()
                .map(role -> role.getName())
                .collect(java.util.stream.Collectors.toSet());
    }

    private String resolveLang(String lang) {
        return StringUtils.hasText(lang) ? lang : "en";
    }
}
