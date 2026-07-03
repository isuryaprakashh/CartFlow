package com.cartflow.controller;

import com.cartflow.dto.CartItemRequest;
import com.cartflow.dto.CartSummary;
import com.cartflow.entity.CartItem;
import com.cartflow.entity.User;
import com.cartflow.repository.UserRepository;
import com.cartflow.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart() {
        User user = getAuthenticatedUser();
        List<CartItem> items = cartService.getCartItems(user);
        CartSummary summary = cartService.getCartSummary(user);

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("summary", summary);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItemRequest request) {
        User user = getAuthenticatedUser();
        CartItem item = cartService.addToCart(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        User user = getAuthenticatedUser();
        Integer quantity = body.get("quantity");
        CartItem updated = cartService.updateCartItem(user, id, quantity);
        if (updated == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        cartService.removeFromCart(user, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        User user = getAuthenticatedUser();
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
