package com.cartflow.controller;

import com.cartflow.entity.User;
import com.cartflow.entity.WishlistItem;
import com.cartflow.repository.UserRepository;
import com.cartflow.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    public WishlistController(WishlistService wishlistService, UserRepository userRepository) {
        this.wishlistService = wishlistService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping("/add")
    public ResponseEntity<WishlistItem> addToWishlist(@RequestBody Map<String, Long> body) {
        User user = getAuthenticatedUser();
        Long productId = body.get("productId");
        WishlistItem item = wishlistService.addToWishlist(user, productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        wishlistService.removeFromWishlist(user, id);
        return ResponseEntity.noContent().build();
    }
}
