package com.cartflow.service;

import com.cartflow.dto.CartItemRequest;
import com.cartflow.dto.CartSummary;
import com.cartflow.entity.CartItem;
import com.cartflow.entity.Product;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.CartItemRepository;
import com.cartflow.repository.ProductRepository;
import org.springframework.stereotype.Service;

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

    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }

    public CartItem addToCart(CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        // If item already in cart, increase quantity
        Optional<CartItem> existingItem = cartItemRepository.findByProductId(request.getProductId());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return cartItemRepository.save(item);
        }

        // Otherwise create new cart item
        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(Long id, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", id));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(Long id) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", id));
        cartItemRepository.delete(cartItem);
    }

    public void clearCart() {
        cartItemRepository.deleteAll();
    }

    public CartSummary getCartSummary() {
        List<CartItem> items = cartItemRepository.findAll();

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
