package com.cartflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Coupon code is required")
    @Column(nullable = false, unique = true)
    private String code;

    @NotNull(message = "Discount amount is required")
    @Positive(message = "Discount must be positive")
    @Column(nullable = false)
    private Double discountAmount;

    @NotBlank(message = "Discount type is required")
    @Column(nullable = false)
    private String discountType; // PERCENTAGE or FIXED

    @NotNull(message = "Expiry date is required")
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    private Boolean active = true;
}
