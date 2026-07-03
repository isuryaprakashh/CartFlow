package com.cartflow.dto;

import com.cartflow.entity.Product;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    private long totalProducts;
    private long totalCategories;
    private long totalUsers;
    private long totalOrders;
    private double revenue;
    private List<Product> lowStockProducts;
}
