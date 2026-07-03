package com.cartflow.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    private String phone;
    private String address;
    private Set<String> role; // optional list of roles (admin, customer)
}
