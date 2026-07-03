package com.cartflow.dto;

import com.cartflow.entity.Order;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDashboardSummary {
    private int cartItemsCount;
    private int wishlistItemsCount;
    private long totalOrdersCount;
    private List<Order> recentOrders;
}
