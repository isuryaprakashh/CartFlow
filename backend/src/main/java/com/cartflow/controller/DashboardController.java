package com.cartflow.controller;

import com.cartflow.dto.CustomerDashboardSummary;
import com.cartflow.dto.DashboardSummary;
import com.cartflow.entity.Order;
import com.cartflow.entity.Product;
import com.cartflow.entity.User;
import com.cartflow.repository.*;
import com.cartflow.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final WishlistRepository wishlistRepository;
    private final CartService cartService;

    public DashboardController(ProductRepository productRepository,
                               CategoryRepository categoryRepository,
                               UserRepository userRepository,
                               OrderRepository orderRepository,
                               WishlistRepository wishlistRepository,
                               CartService cartService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.wishlistRepository = wishlistRepository;
        this.cartService = cartService;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardSummary> getAdminDashboard() {
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalUsers = userRepository.count();
        
        List<Order> orders = orderRepository.findAll();
        long totalOrders = orders.size();
        
        double revenue = orders.stream()
                .filter(o -> !o.getStatus().equalsIgnoreCase("CANCELLED"))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        List<Product> lowStock = productRepository.findAll().stream()
                .filter(p -> p.getQuantity() < 5)
                .collect(Collectors.toList());

        DashboardSummary summary = new DashboardSummary(
                totalProducts, totalCategories, totalUsers, totalOrders, revenue, lowStock);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/customer")
    public ResponseEntity<CustomerDashboardSummary> getCustomerDashboard() {
        User user = getAuthenticatedUser();

        int cartCount = cartService.getCartItems(user).size();
        int wishlistCount = wishlistRepository.findByUserId(user.getId()).size();
        
        List<Order> userOrders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        long ordersCount = userOrders.size();
        
        List<Order> recentOrders = userOrders.stream()
                .limit(5)
                .collect(Collectors.toList());

        CustomerDashboardSummary summary = new CustomerDashboardSummary(
                cartCount, wishlistCount, ordersCount, recentOrders);

        return ResponseEntity.ok(summary);
    }
}
