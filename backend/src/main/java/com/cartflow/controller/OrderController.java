package com.cartflow.controller;

import com.cartflow.dto.*;
import com.cartflow.entity.Order;
import com.cartflow.entity.User;
import com.cartflow.repository.UserRepository;
import com.cartflow.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@Valid @RequestBody OrderRequest request) {
        User user = getAuthenticatedUser();
        Order order = orderService.createOrder(user, request.getShippingAddress(), request.getPhoneNumber(), request.getCouponCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getOrderHistory(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Order order = orderService.getOrderById(id);
        
        // Ensure customer can only view their own order
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin && !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(order);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }
}
