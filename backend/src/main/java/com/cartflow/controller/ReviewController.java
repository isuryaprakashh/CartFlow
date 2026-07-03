package com.cartflow.controller;

import com.cartflow.entity.Review;
import com.cartflow.entity.User;
import com.cartflow.repository.UserRepository;
import com.cartflow.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> createReview(@PathVariable Long productId, @Valid @RequestBody Review review) {
        User user = getAuthenticatedUser();
        Review created = reviewService.createReview(user, productId, review);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long productId) {
        double average = reviewService.getAverageRating(productId);
        return ResponseEntity.ok(Map.of("average", average));
    }
}
