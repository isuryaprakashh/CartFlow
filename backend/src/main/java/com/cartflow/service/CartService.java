package com.cartflow.service;

import com.cartflow.dto.CartItemRequest;
import com.cartflow.dto.CartSummary;
import com.cartflow.entity.CartItem;
import com.cartflow.entity.Product;
import com.cartflow.entity.User;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.CartItemRepository;
import com.cartflow.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCartItems(User user) {
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusMinutes(10);
        List<CartItem> expired = cartItemRepository.findByUserId(user.getId()).stream()
                .filter(item -> item.getReservedAt() != null && item.getReservedAt().isBefore(threshold))
                .toList();
        if (!expired.isEmpty()) {
            cartItemRepository.deleteAll(expired);
        }
        return cartItemRepository.findByUserId(user.getId());
    }

    public CartItem addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(user.getId(), request.getProductId());
        int targetQuantity = request.getQuantity();
        
        if (existingItem.isPresent()) {
            targetQuantity += existingItem.get().getQuantity();
        }

        // Calculate active reservations for this product (excluding this user's current item if it exists)
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusMinutes(10);
        List<CartItem> reservations = cartItemRepository.findByProductId(product.getId());
        int activeOtherReservations = reservations.stream()
                .filter(item -> !item.getUser().getId().equals(user.getId()))
                .filter(item -> item.getReservedAt() != null && item.getReservedAt().isAfter(threshold))
                .mapToInt(CartItem::getQuantity)
                .sum();

        int availableQuantity = product.getQuantity() - activeOtherReservations;

        if (targetQuantity > availableQuantity) {
            throw new IllegalArgumentException("Cannot add requested quantity. Available stock after active reservations: " + availableQuantity);
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(targetQuantity);
            item.setReservedAt(java.time.LocalDateTime.now());
            return cartItemRepository.save(item);
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(targetQuantity);
        cartItem.setReservedAt(java.time.LocalDateTime.now());
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(User user, Long id, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", id));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to update this cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        // Calculate active reservations for this product (excluding this cart item)
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusMinutes(10);
        List<CartItem> reservations = cartItemRepository.findByProductId(cartItem.getProduct().getId());
        int activeOtherReservations = reservations.stream()
                .filter(item -> !item.getId().equals(id))
                .filter(item -> item.getReservedAt() != null && item.getReservedAt().isAfter(threshold))
                .mapToInt(CartItem::getQuantity)
                .sum();

        int availableQuantity = cartItem.getProduct().getQuantity() - activeOtherReservations;

        if (quantity > availableQuantity) {
            throw new IllegalArgumentException("Cannot update quantity. Available stock after active reservations: " + availableQuantity);
        }

        cartItem.setQuantity(quantity);
        cartItem.setReservedAt(java.time.LocalDateTime.now());
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(User user, Long id) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", id));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to remove this cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUserId(user.getId());
    }

    public CartSummary getCartSummary(User user) {
        List<CartItem> items = getCartItems(user);

        int totalItems = items.size();
        int totalQuantity = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        double totalPrice = items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        return new CartSummary(totalItems, totalQuantity, totalPrice);
    }

    @Transactional
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 60000)
    public void purgeExpiredReservations() {
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusMinutes(10);
        List<CartItem> expiredItems = cartItemRepository.findByReservedAtBefore(threshold);
        if (!expiredItems.isEmpty()) {
            cartItemRepository.deleteAll(expiredItems);
            System.out.println("Purged " + expiredItems.size() + " expired cart item reservations.");
        }
    }
}
