package com.cartflow.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartSummary {
    private int totalItems;
    private int totalQuantity;
    private double totalPrice;
}
