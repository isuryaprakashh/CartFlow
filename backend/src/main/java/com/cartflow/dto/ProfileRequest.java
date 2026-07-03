package com.cartflow.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequest {
    private String email;
    private String phone;
    private String address;
    private String profileImageUrl;
}
