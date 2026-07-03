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

        // Prevent overselling
        if (targetQuantity > product.getQuantity()) {
            throw new IllegalArgumentException("Cannot add requested quantity. Available stock: " + product.getQuantity());
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(targetQuantity);
            return cartItemRepository.save(item);
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(targetQuantity);
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

        // Prevent overselling
        if (quantity > cartItem.getProduct().getQuantity()) {
            throw new IllegalArgumentException("Cannot update quantity. Available stock: " + cartItem.getProduct().getQuantity());
        }

        cartItem.setQuantity(quantity);
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
}
