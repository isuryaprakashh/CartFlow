package com.cartflow.service;

import com.cartflow.entity.Product;
import com.cartflow.entity.User;
import com.cartflow.entity.WishlistItem;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.ProductRepository;
import com.cartflow.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    public List<WishlistItem> getWishlist(User user) {
        return wishlistRepository.findByUserId(user.getId());
    }

    public WishlistItem addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalArgumentException("Product already in wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        return wishlistRepository.save(item);
    }

    public void removeFromWishlist(User user, Long id) {
        WishlistItem item = wishlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item", id));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to remove this item");
        }

        wishlistRepository.delete(item);
    }
}
