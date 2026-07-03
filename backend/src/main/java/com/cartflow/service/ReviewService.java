package com.cartflow.service;

import com.cartflow.entity.Product;
import com.cartflow.entity.Review;
import com.cartflow.entity.User;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.ProductRepository;
import com.cartflow.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review createReview(User user, Long productId, Review review) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        review.setUser(user);
        review.setProduct(product);
        return reviewRepository.save(review);
    }

    public double getAverageRating(Long productId) {
        List<Review> reviews = getReviewsByProduct(productId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
