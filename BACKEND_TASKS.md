# Backend Development Tasks — User Management Module

## Overview

Implement the full **User Management** module (CRUD + status/role management) for the `TrendSearchor` backend. All endpoints are under the `/api/admin/users` prefix and require `ADMIN` role authorization.

---

## 1. Files to Create

### 1.1 DTOs (in `src/main/java/com/fpt/swp/dto/`)

#### `CreateUserRequest.java`
```java
package com.fpt.swp.dto;

import com.fpt.swp.model.Gender;
import com.fpt.swp.model.Role;
import com.fpt.swp.model.UserStatus;
import com.fpt.swp.validation.ValidDob;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, message = "Username must be at least 3 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{9,}$",
        message = "Password must be at least 9 characters, contain 1 uppercase, 1 number, 1 special character"
    )
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String mail;

    @NotNull(message = "Role is required")
    private Role role;

    private UserStatus status; // Defaults to ACTIVE if null

    @ValidDob
    private LocalDate dob;

    @Pattern(regexp = "^0[35789][0-9]{8}$",
             message = "Phone must start with 03, 05, 07, 08, 09 and have exactly 10 digits")
    private String phone;

    private Gender gender;

    private String workplace;
}
```

#### `UpdateUserRequest.java`
```java
package com.fpt.swp.dto;

import com.fpt.swp.model.Gender;
import com.fpt.swp.model.Role;
import com.fpt.swp.model.UserStatus;
import com.fpt.swp.validation.ValidDob;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @Size(min = 3, message = "Username must be at least 3 characters")
    private String username;

    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{9,}$",
        message = "Password must be at least 9 characters, contain 1 uppercase, 1 number, 1 special character"
    )
    private String password;

    @Email(message = "Invalid email format")
    private String mail;

    private Role role;
    private UserStatus status;

    @ValidDob
    private LocalDate dob;

    @Pattern(regexp = "^0[35789][0-9]{8}$",
             message = "Phone must start with 03, 05, 07, 08, 09 and have exactly 10 digits")
    private String phone;

    private Gender gender;
    private String workplace;
}
```

#### `UpdateStatusRequest.java`
```java
package com.fpt.swp.dto;

import com.fpt.swp.model.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    @NotNull(message = "Status is required")
    private UserStatus status;
}
```

#### `UpdateRoleRequest.java`
```java
package com.fpt.swp.dto;

import com.fpt.swp.model.Role;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRoleRequest {
    @NotNull(message = "Role is required")
    private Role role;
}
```

---

### 1.2 Service (in `src/main/java/com/fpt/swp/service/`)

#### `UserService.java`
```java
package com.fpt.swp.service;

import com.fpt.swp.dto.*;
import com.fpt.swp.model.*;
import com.fpt.swp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ─── 3.1 GET /api/admin/users — Paginated list ─────────────────────────
    @Transactional(readOnly = true)
    public Map<String, Object> getAllUsers(int page, int limit, String role, String status, String search) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("id").descending());
        Specification<User> spec = buildSpecification(role, status, search);
        Page<User> userPage = userRepository.findAll(spec, pageable);

        List<UserResponse> data = userPage.getContent().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("data", data);
        result.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "total", userPage.getTotalElements(),
                "totalPages", userPage.getTotalPages()
        ));
        return result;
    }

    // ─── 3.2 GET /api/admin/users/{id} — Single user ───────────────────────
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return UserResponse.fromUser(user);
    }

    // ─── 3.3 POST /api/admin/users — Create ────────────────────────────────
    public UserResponse createUser(CreateUserRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }
        if (userRepository.existsByMail(req.getMail())) {
            throw new IllegalArgumentException("Email is already taken!");
        }

        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .mail(req.getMail())
                .role(req.getRole())
                .status(req.getStatus() != null ? req.getStatus() : UserStatus.ACTIVE)
                .dob(req.getDob())
                .phone(req.getPhone())
                .gender(req.getGender())
                .workplace(req.getWorkplace())
                .build();

        return UserResponse.fromUser(userRepository.save(user));
    }

    // ─── 3.4 PUT /api/admin/users/{id} — Update ───────────────────────────
    public UserResponse updateUser(Long id, UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        if (req.getUsername() != null && !req.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(req.getUsername())) {
                throw new IllegalArgumentException("Username is already taken!");
            }
            user.setUsername(req.getUsername());
        }
        if (req.getMail() != null && !req.getMail().equals(user.getMail())) {
            if (userRepository.existsByMail(req.getMail())) {
                throw new IllegalArgumentException("Email is already taken!");
            }
            user.setMail(req.getMail());
        }
        if (req.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getRole() != null) user.setRole(req.getRole());
        if (req.getStatus() != null) user.setStatus(req.getStatus());
        if (req.getDob() != null) user.setDob(req.getDob());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getWorkplace() != null) user.setWorkplace(req.getWorkplace());

        return UserResponse.fromUser(userRepository.save(user));
    }

    // ─── 3.5 DELETE /api/admin/users/{id} ────────────────────────────────
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // ─── 3.6 PATCH /api/admin/users/{id}/status ──────────────────────────
    public UserResponse updateUserStatus(Long id, UserStatus newStatus) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        user.setStatus(newStatus);
        return UserResponse.fromUser(userRepository.save(user));
    }

    // ─── 3.7 PATCH /api/admin/users/{id}/role ─────────────────────────────
    public UserResponse updateUserRole(Long id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        user.setRole(newRole);
        return UserResponse.fromUser(userRepository.save(user));
    }

    // ─── Helper: Build JPA Specification for filtering ───────────────────────
    private Specification<User> buildSpecification(String role, String status, String search) {
        return Specification.where(null)
                .and((root, query, cb) -> {
                    if (role != null && !role.isBlank()) {
                        query.distinct(true);
                        return cb.equal(root.get("role"), Role.valueOf(role.toUpperCase()));
                    }
                    return null;
                })
                .and((root, query, cb) -> {
                    if (status != null && !status.isBlank()) {
                        return cb.equal(root.get("status"), UserStatus.valueOf(status.toUpperCase()));
                    }
                    return null;
                })
                .and((root, query, cb) -> {
                    if (search != null && !search.isBlank()) {
                        String pattern = "%" + search.toLowerCase() + "%";
                        query.distinct(true);
                        return cb.or(
                                cb.like(cb.lower(root.get("username")), pattern),
                                cb.like(cb.lower(root.get("mail")), pattern)
                        );
                    }
                    return null;
                });
    }
}
```

---

### 1.3 Controller (in `src/main/java/com/fpt/swp/controller/`)

#### `UserController.java`
```java
package com.fpt.swp.controller;

import com.fpt.swp.dto.*;
import com.fpt.swp.model.*;
import com.fpt.swp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 3.1 GET /api/admin/users — Paginated list with filters
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(userService.getAllUsers(page, limit, role, status, search));
    }

    // 3.2 GET /api/admin/users/{id} — Single user
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // 3.3 POST /api/admin/users — Create new user
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(req));
    }

    // 3.4 PUT /api/admin/users/{id} — Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                       @Valid @RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(userService.updateUser(id, req));
    }

    // 3.5 DELETE /api/admin/users/{id} — Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(java.util.Map.of("message", "User deleted successfully"));
    }

    // 3.6 PATCH /api/admin/users/{id}/status — Update user status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                         @Valid @RequestBody UpdateStatusRequest req) {
        return ResponseEntity.ok(userService.updateUserStatus(id, req.getStatus()));
    }

    // 3.7 PATCH /api/admin/users/{id}/role — Update user role
    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id,
                                        @Valid @RequestBody UpdateRoleRequest req) {
        return ResponseEntity.ok(userService.updateUserRole(id, req.getRole()));
    }
}
```

---

## 2. Files to Modify

### 2.1 `UserRepository.java`
**Add JPA Specification support + search methods**

```java
package com.fpt.swp.repository;

import com.fpt.swp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;  // ADD
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>,
                                       JpaSpecificationExecutor<User> {  // ADD JpaSpecificationExecutor
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByMail(String mail);
    Optional<User> findByMail(String mail);
}
```

### 2.2 `UserResponse.java`
**Add `status` and `createdAt`/`lastLogin` fields**

```java
// Add these fields to UserResponse:
private UserStatus status;
private java.time.LocalDateTime createdAt;  // if User entity has this
// Note: lastLogin can be added later when session tracking is implemented

// Update fromUser():
public static UserResponse fromUser(User user) {
    if (user == null) return null;
    return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .mail(user.getMail())
            .dob(user.getDob())
            .phone(user.getPhone())
            .gender(user.getGender())
            .workplace(user.getWorkplace())
            .role(user.getRole())
            .status(user.getStatus())                          // ADD THIS
            // .createdAt(user.getCreatedAt())                  // ADD when User has it
            .build();
}
```

### 2.3 `User.java` (optional enhancement)
**Add `createdAt` and `lastLogin` timestamps for richer responses**

```java
// In User.java, add:
@Column(updatable = false)
private LocalDateTime createdAt;

private LocalDateTime lastLogin;

// And add to the entity:
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
}
```

### 2.4 `GlobalExceptionHandler.java`
**Add handlers for `EntityNotFoundException`, `IllegalArgumentException`, and `AccessDeniedException`**

```java
package com.fpt.swp.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.util.Map;
import java.util.HashMap;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleEntityNotFound(EntityNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "You do not have permission to access this resource");
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }
}
```

### 2.5 `SecurityConfig.java`
**Permit CORS preflight (OPTIONS) requests globally**

```java
// In authorizeHttpRequests block — add this line:
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

// Full block should look like:
.authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()   // ADD THIS LINE
        .requestMatchers("/", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                .permitAll()
        .requestMatchers("/api/auth/**", "/error").permitAll()
        .anyRequest().authenticated()
)
```

---

## 3. Endpoint Summary

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 3.1 | `GET` | `/api/admin/users` | ADMIN | Paginated list, supports `page`, `limit`, `role`, `status`, `search` |
| 3.2 | `GET` | `/api/admin/users/{id}` | ADMIN | Get single user by ID |
| 3.3 | `POST` | `/api/admin/users` | ADMIN | Create new user |
| 3.4 | `PUT` | `/api/admin/users/{id}` | ADMIN | Update user (partial — only send fields to update) |
| 3.5 | `DELETE` | `/api/admin/users/{id}` | ADMIN | Delete user |
| 3.6 | `PATCH` | `/api/admin/users/{id}/status` | ADMIN | Update user status |
| 3.7 | `PATCH` | `/api/admin/users/{id}/role` | ADMIN | Update user role |

---

## 4. Response Formats

### 4.1 Paginated List (GET /api/admin/users)

```json
{
  "data": [
    {
      "id": 1,
      "username": "admin",
      "mail": "admin@trendsearchor.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "dob": "2000-01-01",
      "phone": "0123456789",
      "gender": "MALE",
      "workplace": "System"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "totalPages": 5
  }
}
```

### 4.2 Single User (GET /api/admin/users/{id}, POST, PUT, PATCH)

```json
{
  "id": 1,
  "username": "admin",
  "mail": "admin@trendsearchor.com",
  "role": "ADMIN",
  "status": "ACTIVE",
  "dob": "2000-01-01",
  "phone": "0123456789",
  "gender": "MALE",
  "workplace": "System"
}
```

### 4.3 Delete Success

```json
{ "message": "User deleted successfully" }
```

### 4.4 Error Responses

```json
// 400 Bad Request (validation)
{ "username": "Username is required" }

// 400 Bad Request (business logic)
{ "message": "Username is already taken!" }

// 401 Unauthorized
{ "error": "Authentication failed", "message": "Bad credentials" }

// 403 Forbidden
{ "message": "You do not have permission to access this resource" }

// 404 Not Found
{ "message": "User not found with id: 99" }
```

---

## 5. Validation Rules

| Field | Rules |
|-------|-------|
| `username` | Min 3 chars, unique |
| `password` | Min 9 chars, 1 uppercase, 1 number, 1 special (`@$!%*?&`) |
| `mail` | Valid email format, unique |
| `role` | Required on create. Values: `ADMIN`, `LECTURER`, `STUDENT`, `RESEARCHER`, `USER` |
| `status` | Optional on create (defaults to `ACTIVE`). Values: `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| `phone` | Format: `0[35789][0-9]{8}` (10 digits, starts with 03/05/07/08/09) |
| `dob` | Must be in the past, year > 1920 (via `@ValidDob` custom validator) |
| `gender` | Values: `MALE`, `FEMALE`, `OTHERS` |

---

## 6. Priority Order

1. **Create `UserService.java`** with all 7 methods
2. **Create 4 request DTOs** (`CreateUserRequest`, `UpdateUserRequest`, `UpdateStatusRequest`, `UpdateRoleRequest`)
3. **Create `UserController.java`** with `@PreAuthorize("hasRole('ADMIN')")`
4. **Update `UserRepository`** — add `JpaSpecificationExecutor`
5. **Update `UserResponse`** — add `status` field
6. **Update `GlobalExceptionHandler`** — add handlers for `EntityNotFoundException`, `IllegalArgumentException`, `AccessDeniedException`
7. **Update `SecurityConfig`** — add `.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()`
8. **Test all 7 endpoints** via Swagger UI at `http://localhost:8080/swagger-ui.html`
